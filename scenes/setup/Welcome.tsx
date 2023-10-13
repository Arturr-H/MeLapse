import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ HowOften: { confirmLocation: "Calibration" } }, "HowOften">,
}

export class Welcome extends React.PureComponent<Props, {}> {
    constructor(props: Props) {
        super(props);

        /* Bindings */
        this.onConfirm = this.onConfirm.bind(this);
    };

    async onConfirm(): Promise<void> {
        this.props.navigation.navigate("HowOften", { confirmLocation: "Calibration" });
    }

    render() {
        return (
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
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <Welcome {...props} navigation={navigation} />;
}
