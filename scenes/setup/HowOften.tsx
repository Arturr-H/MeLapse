import React, { RefObject } from "react";
import { Linking, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AppConfig from "../menu/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allowsNotificationsAsync, clearAllScheduled } from "../../LocalNotification";
import * as Notifications from "expo-notifications";
import { TitleH3 } from "../../components/text/Title";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Calibration: undefined, Preferences: undefined }, "Calibration" | "Preferences">,
}
interface State {}

export class HowOften extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    };

    async onConfirm(): Promise<void> {
        await AsyncStorage.setItem("setupComplete", "true");
        this.props.navigation.navigate("Calibration");
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
    selectInputInitial: number
}
export class NotificationOptions extends React.PureComponent<NOProps, NOState> {
    constructor(props: NOProps) {
        super(props);

        this.state = {
            notisEnabled: true,
            selectInputInitial: 1
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
            selectInputInitial: await AppConfig.getTargetTimesPerDay()
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
        clearAllScheduled().then(async () => {
            await AppConfig.setTargetTimesPerDay(nr);
            let notifications: { hour: number, minute: number }[] = [];
            
            if (nr === 1)
                notifications = [ { hour: 16, minute: 0 } ];
        
            else if (nr === 2)
                notifications = [
                    { hour: 12, minute: 0 },
                    { hour: 20, minute: 0 },
                ];

            else if (nr === 3)
                notifications = [
                    { hour: 12, minute: 0 },
                    { hour: 16, minute: 0 },
                    { hour: 20, minute: 0 },
                ]

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

    render(): React.ReactNode {
        return <View style={Styles.gap}>
            {/* Name */}
            <SelectInput
                initial={this.state.selectInputInitial}
                buttons={["0", "1", "2", "3"]}
                onChange={this.onChange}
            />

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

    return <HowOften {...props} confirmLocation={props.route.params.confirmLocation} navigation={navigation} />;
}
