import React, { RefObject } from "react";
import { Linking, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { ModalConstructor } from "../../components/modal/ModalConstructor";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        HowOften: { confirmLocation: "Calibration" },
        PrivacyPolicy: { confirmLocation: "Welcome" },
    }, "HowOften" | "PrivacyPolicy">,
}

export class Welcome extends React.PureComponent<Props, {}> {
    modalConstructor: RefObject<ModalConstructor> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* Bindings */
        this.onConfirm = this.onConfirm.bind(this);
    };

    async onConfirm(): Promise<void> {
        const read = () => {
            // this.props.navigation.navigate("PrivacyPolicy", { confirmLocation: "Welcome" })
            Linking.openURL("https://arturr-h.github.io/MeLapse-Pages/index.html");
        };
        const confirm = () => this.props.navigation.navigate("HowOften", { confirmLocation: "Calibration" });

        this.modalConstructor.current?.constructModal({
            header: "Privacy Policy",
            description: "Would you like to read the privacy policy? (Can be read later on)",

            buttons: [
                { text: "Read", onClick: read, color: "blue", hollow: true },
                { text: "Accept", onClick: confirm, color: "blue" },
            ]
        })
    }

    render() {
        return (
            <React.Fragment>
            <ModalConstructor ref={this.modalConstructor} />
            <SafeAreaView style={Styles.container}>
                <View style={Styles.column}>
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
                </View>

                <StatusBar style="dark" />
            </SafeAreaView>
            </React.Fragment>
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <Welcome {...props} navigation={navigation} />;
}
