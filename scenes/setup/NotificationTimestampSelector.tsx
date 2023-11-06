import React from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TitleH3 } from "../../components/text/Title";
import { scheduleNotis } from "./HowOften";

/* Interfaces */
interface Props {
    /** Should be 0, 1, 2, or 3 if not updated */
    notificationsPerDay: number,
}
interface State {
    shouldRender: boolean,
    notisPerDay: number,
    times: {
        time1: { hour: number, minute: number },
        time2: { hour: number, minute: number },
        time3: { hour: number, minute: number },
    }
}

const time1default = { hour: 12, minute: 0 };
const time2default = { hour: 16, minute: 0 };
const time3default = { hour: 20, minute: 0 };
export default class extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            shouldRender: true,
            notisPerDay: 0,
            times: {
                time1: time1default,
                time2: time2default,
                time3: time3default,
            }
        }
    }

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        const time1 = JSON.parse(await AsyncStorage.getItem("notification-time-1") ?? JSON.stringify(time1default));
        const time2 = JSON.parse(await AsyncStorage.getItem("notification-time-2") ?? JSON.stringify(time2default));
        const time3 = JSON.parse(await AsyncStorage.getItem("notification-time-3") ?? JSON.stringify(time3default));

        this.setState({ notisPerDay: this.props.notificationsPerDay, times: {
            time1, time2, time3,
        }});
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.notificationsPerDay !== this.props.notificationsPerDay) {
            this.setState({ notisPerDay: this.props.notificationsPerDay });
        }
    }

    /**
     * Add or subtract from notification time
     * `1` = `notification-time-1` and so on
     * */
    async add(idx: number): Promise<void> {
        const default_ = idx === 1 ? time1default : idx === 2 ? time2default : time3default;
        const time_name = "notification-time-" + idx;
        const new_time_name = "time" + idx;
        const time: { hour: number, minute: number } = JSON.parse(await AsyncStorage.getItem(time_name) ?? JSON.stringify(default_));

        const new_time = time.hour === 24
            ? { hour: 24, minute: 0 }
            : time.minute === 30
                ? { hour: Math.min(time.hour+1, 24), minute: 0 }
                : { hour: time.hour, minute: 30 };
        await AsyncStorage.setItem(time_name, JSON.stringify(new_time)).then(scheduleNotis);
        this.setState({ times: {
            ...this.state.times,
            [new_time_name]: new_time
        }});
    }
    async sub(idx: number): Promise<void> {
        const default_ = idx === 1 ? time1default : idx === 2 ? time2default : time3default;
        const time_name = "notification-time-" + idx;
        const new_time_name = "time" + idx;
        const time: { hour: number, minute: number } = JSON.parse(await AsyncStorage.getItem(time_name) ?? JSON.stringify(default_));

        const new_time = (time.hour === 0 && time.minute === 0)
            ? { hour: 0, minute: 0 }
            : time.minute === 30
                ? { hour: time.hour, minute: 0 }
                : { hour: Math.max(time.hour - 1, 0), minute: 30 };
        await AsyncStorage.setItem(time_name, JSON.stringify(new_time)).then(scheduleNotis);
        this.setState({ times: {
            ...this.state.times,
            [new_time_name]: new_time
        }});
    }

    /* Render */
    render(): React.ReactNode {
        if (this.state.shouldRender && this.state.notisPerDay >= 1) return <View>
        <TitleH3 title="When to recieve them" info="At what times during the day would you like to recieve your notifications?" />
        <View style={Styles.timestampSelectorWrapper}>
            <View style={Styles.timestampSelector}>
                <ChangeButton change={() => this.sub(1)} sign="-" />
                <TimeSign hour={this.state.times.time1.hour} minute={this.state.times.time1.minute} />
                <ChangeButton change={() => this.add(1)} sign="+" />
            </View>
            {this.state.notisPerDay >= 2 && <View style={Styles.timestampSelector}>
                <ChangeButton change={() => this.sub(2)} sign="-" />
                <TimeSign hour={this.state.times.time2.hour} minute={this.state.times.time2.minute} />
                <ChangeButton change={() => this.add(2)} sign="+" />
            </View>}
            {this.state.notisPerDay >= 3 && <View style={Styles.timestampSelector}>
                <ChangeButton change={() => this.sub(3)} sign="-" />
                <TimeSign hour={this.state.times.time3.hour} minute={this.state.times.time3.minute} />
                <ChangeButton change={() => this.add(3)} sign="+" />
            </View>}
        </View>
        </View>
        else return null;
    }
}


/** (ms) how long the user needs to hold plus or minus
 * button for it to automatically switch every
 * {@link SWITCH_SPEED}ms */
const DURATION_FOR_STARTING_AUTOSWITCH = 300;

/** Auto image switching speed */
const SWITCH_SPEED = 60;

interface ChangeButtonProps {
    sign: "+" | "-",
    change: () => void
}
class ChangeButton extends React.PureComponent<ChangeButtonProps> {
    /* For holding (repeating next / prev) */
    holdInterval?: NodeJS.Timeout;
    startIntervalTimeout?: NodeJS.Timeout;
    isHolding: boolean = false;

    constructor(props: ChangeButtonProps) {
        super(props);

        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
    }

    /** button hold interactions */
    onTouchStart(): void {
        if (!this.isHolding) {
            this.isHolding = true;
            
            /* Wait the min hold ms for starting interval */
            this.startIntervalTimeout = setTimeout(() => {
                if (this.isHolding) this.holdInterval = setInterval(this.props.change, SWITCH_SPEED);
            }, DURATION_FOR_STARTING_AUTOSWITCH);

            this.props.change();
        }
    }
    onTouchEnd(): void {
        this.isHolding = false;
        clearInterval(this.holdInterval);
        clearTimeout(this.startIntervalTimeout);
    }

    /* Render */
    render(): React.ReactNode {
        return <TouchableOpacity
            activeOpacity={0.7}
            style={Styles.changeButton}
            onPressIn={this.onTouchStart}
            onPressOut={this.onTouchEnd}
        >
            <Text style={Styles.changeButtonText}>{this.props.sign}</Text>
        </TouchableOpacity>
    }
}

interface TimeSignProps {
    hour: number,
    minute: number,
}
class TimeSign extends React.PureComponent<TimeSignProps> {
    constructor(props: TimeSignProps) {
        super(props);
    }

    /* Render */
    render(): React.ReactNode {
        const hour = this.props.hour < 10 ? "0" + this.props.hour : this.props.hour;
        const minute = this.props.minute < 10 ? "0" + this.props.minute : this.props.minute;

        return <View style={Styles.timeSign}>
            <Text style={Styles.timeSignText}>
                {hour}:{minute}
            </Text>
        </View>
    }
}
