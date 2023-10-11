import React, { RefObject } from "react";
import { SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import SelectInput from "../../components/selectInput/SelectInput";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AppConfig from "../preferences/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { allowsNotificationsAsync } from "../../LocalNotification";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ HowOften: { confirmLocation: "Calibration" } }, "HowOften">,
}
export interface State {
}

export class Welcome extends React.PureComponent<Props, State> {
    animator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
        };

        /* Bindings */
        this.onConfirm = this.onConfirm.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.fadeIn();
    };
    fadeIn(): void {
        this.animator.current?.fadeIn(400).start();
    }
    fadeOut(callback?: () => void): void {
        this.animator.current?.fadeOut(400).start(callback);
    }

    async onConfirm(): Promise<void> {
        this.fadeOut(() => {
            this.props.navigation.navigate("HowOften", { confirmLocation: "Calibration" });
        });
    }

    render() {
        return (
            <SafeAreaView style={Styles.container}>
                <Animator ref={this.animator} style={Styles.column}>
                    <View style={Styles.body}>
                        <Text style={Styles.header}>Welcome 👋</Text>
                        <Text style={Styles.paragraph}>
                            Let's begin with a quick setup
                        </Text>
                    </View>

                    {/* Confirm */}
                    <View style={Styles.footer}>
                        <Button
                            onPress={this.onConfirm}
                            text="Next"
                            active
                        />
                    </View>
                </Animator>

                <StatusBar style="dark" />
            </SafeAreaView>
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <Welcome {...props} navigation={navigation} />;
}
