import React from "react";
import { Linking, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import { useNavigation } from "@react-navigation/native";
import AppConfig from "../menu/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allowsNotificationsAsync, clearAllScheduled } from "../../LocalNotification";
import * as Notifications from "expo-notifications";
import { TitleH3 } from "../../components/text/Title";
import NotificationTimestampSelector from "./NotificationTimestampSelector";

/* Interfaces */
interface Props {
    navigation: any,
}
interface State {}

export class HowOften extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* Bindings */
        this.onConfirm = this.onConfirm.bind(this);
    };

    async onConfirm(): Promise<void> {
        await AsyncStorage.setItem("setupComplete", "true").then(() => {
            this.props.navigation.navigate("Calibration");
        });
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <View style={Styles.column}>
                    <View style={Styles.body}>
                        <Text style={Styles.header}>Goal per day 🎯</Text>
                        <Text style={Styles.paragraph}>
                            How many notifications would you like to receive throughout the day? (For reminding you about taking selfies)
                        </Text>

                        <NotificationOptions />
                    </View>

                    {/* Confirm */}
                    <View style={Styles.footer}>
                        <Button active onPress={this.onConfirm} text="Confirm" />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

/** Notification Option Props */
interface NOProps {}

/** Notification Option State */
interface NOState {
    notisEnabled: boolean,
    selectInputInitial: number,
    notisPerDay: number,
}
export class NotificationOptions extends React.PureComponent<NOProps, NOState> {
    constructor(props: NOProps) {
        super(props);

        this.state = {
            notisEnabled: true,
            selectInputInitial: 1,
            notisPerDay: 1
        };

        this.tryEnableNotifications = this.tryEnableNotifications.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        /* If notis are enabled */
        const notisEnabled = await allowsNotificationsAsync();
        this.setState({
            notisEnabled,
            selectInputInitial: await AppConfig.getTargetTimesPerDay(),
            notisPerDay: await AppConfig.getTargetTimesPerDay()
        });
    };

    /** Yeah */
    async tryEnableNotifications(): Promise<void> {
        const result = await Notifications.requestPermissionsAsync();
        if (!result.granted) {
            Linking.openSettings();
        }else {
            alert("Notifications allowed!");
            this.setState({ notisEnabled: true });
        }
    }

    /** Schedule new notifications */
    async onChange(nr: number): Promise<void> {
        this.setState({ notisPerDay: nr });
        await AppConfig.setTargetTimesPerDay(nr).then(scheduleNotis);
    }

    render(): React.ReactNode {
        return <View style={Styles.gap}>
            {/* Name */}
            <SelectInput
                initial={this.state.selectInputInitial}
                buttons={["0", "1", "2", "3"]}
                onChange={this.onChange}
            />

            <NotificationTimestampSelector notificationsPerDay={this.state.notisPerDay} />

            {!this.state.notisEnabled && <View>
                <TitleH3 title="Enable notifications" info="Recommended but not obligatory - give MeLapse permission to send out notifications to you throughout the day. Can be turned off at any time." />
                <Button
                    onPress={this.tryEnableNotifications}
                    text="Enable"
                    active
                />
            </View>}
        </View>
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <HowOften {...props} navigation={navigation} />;
}

export async function scheduleNotis(): Promise<void> {
    let nr = await AppConfig.getTargetTimesPerDay();
    clearAllScheduled().then(async () => {
        await AppConfig.setTargetTimesPerDay(nr);
        let notifications: { hour: number, minute: number }[] = [];
        
        const time1default = { hour: 12, minute: 0 };
        const time2default = { hour: 16, minute: 0 };
        const time3default = { hour: 20, minute: 0 };
        const time1 = JSON.parse(await AsyncStorage.getItem("notification-time-1") ?? JSON.stringify(time1default));
        const time2 = JSON.parse(await AsyncStorage.getItem("notification-time-2") ?? JSON.stringify(time2default));
        const time3 = JSON.parse(await AsyncStorage.getItem("notification-time-3") ?? JSON.stringify(time3default));

        console.log("scheduling", nr, [ time1, time2, time3 ]);
        if (nr === 1)
            notifications = [ time1 ];
    
        else if (nr === 2)
            notifications = [ time1, time2 ];

        else if (nr === 3)
            notifications = [ time1, time2, time3 ]

        const now = new Date();

        // No notis
        notifications.forEach(({ hour, minute }) => {
            const triggerTime = new Date();
            triggerTime.setHours(hour);
            triggerTime.setMinutes(minute);
            triggerTime.setSeconds(0);
            
            if (triggerTime < now) {
                triggerTime.setDate(triggerTime.getDate() + 1);
            }
            
            Notifications.scheduleNotificationAsync({
                content: {
                    title: "Selfie time 📸",
                    body: "Make sure to find a well-lit place 💡",
                    sound: "notification.wav",
                },
                trigger: {
                    hour: triggerTime.getHours(),
                    minute: triggerTime.getMinutes(),
                    repeats: true,
                },
            });
        });
    })
}