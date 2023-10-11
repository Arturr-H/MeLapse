import React, { RefObject } from "react";
import { Linking, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AppConfig from "../preferences/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { allowsNotificationsAsync } from "../../LocalNotification";
import * as Notifications from "expo-notifications";
import { Animator } from "../../components/animator/Animator";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Calibration: undefined, Preferences: undefined }, "Calibration" | "Preferences">,
    confirmLocation: "Calibration" | "Preferences"
}
export interface State {
    notisEnabled: boolean,
    selectInputInitial: number
}

export class HowOften extends React.PureComponent<Props, State> {
    animator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            notisEnabled: true,
            selectInputInitial: 1,
        };

        /* Bindings */
        this.tryEnableNotifications = this.tryEnableNotifications.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.animator.current?.fadeIn(400).start();

        /* If notis are enabled */
        const notisEnabled = await allowsNotificationsAsync();
        this.setState({
            notisEnabled,
            selectInputInitial: await AppConfig.getTargetTimesPerDay()
        });
    };

    async onConfirm(): Promise<void> {
        await AsyncStorage.setItem("setupComplete", "true");
        const location = this.props.confirmLocation;

        this.animator.current?.fadeOut(400).start(() => {
            if (location === "Calibration" || location === "Preferences") {
                this.props.navigation.navigate(location);
            }else {
                this.props.navigation.navigate("Calibration");
            }
        });
    }

    async tryEnableNotifications(): Promise<void> {
        const result = await Notifications.requestPermissionsAsync();
        if (!result.granted) {
            Linking.openSettings();
        }else {
            alert("Notifications allowed!");
            this.setState({ notisEnabled: true });
        }
    }

    async onChange(nr: number): Promise<void> {
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

    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <Animator startOpacity={0} ref={this.animator} style={Styles.column}>
                    <View style={Styles.body}>
                        <Text style={Styles.header}>Goal per day 🎯</Text>
                        <Text style={Styles.paragraph}>
                            How many notifications would you like to receive throughout the day? (For reminding you about taking selfies)
                        </Text>

                        <View style={Styles.gap}>

                            {/* Name */}
                            <SelectInput
                                initial={this.state.selectInputInitial}
                                buttons={["0", "1", "2", "3"]}
                                onChange={this.onChange}
                            />

                            {!this.state.notisEnabled && <View>
                                <Text style={Styles.paragraph}>Recommended but not obligatory</Text>
                                <Button
                                    onPress={this.tryEnableNotifications}
                                    text="Enable notifications"
                                    active
                                />
                            </View>
                            }
                        </View>
                    </View>

                    {/* Confirm */}
                    <View style={Styles.footer}>
                        <Button active onPress={this.onConfirm} text="Confirm" />
                    </View>
                </Animator>
            </SafeAreaView>
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <HowOften {...props} confirmLocation={props.route.params.confirmLocation} navigation={navigation} />;
}
