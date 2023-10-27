/* Imports */
import React, { RefObject } from "react";
import { Alert, KeyboardAvoidingView, Linking, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "../Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../../components/button/Button";
import SelectInput from "../../../components/selectInput/SelectInput";
import AppConfig from "../Config";
import ScrollGradient from "../../../components/scrollGradient/ScrollGradient";
import { OnionSkin } from "../../camera/onionSkin/OnionSkin";
import * as Device from "expo-device";
import SliderInput from "../../../components/sliderInput/SliderInput";

/* @ts-ignore */
import { BANNER, REWARDED } from "@env";
import { TestIds } from "react-native-google-mobile-ads";
import { StatusBar } from "expo-status-bar";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Preferences: undefined,
    }, "Preferences">,
}
export interface State {
    alwaysUseLatestSelfie: boolean,
    onionSkinVisible: boolean,
    onionSkinOpacity: number,
}

class OnionSkinPreferences extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            onionSkinVisible: false,
            alwaysUseLatestSelfie: false,
            onionSkinOpacity: 0.45
        };

        /* Bindings */
        this.resetSettings = this.resetSettings.bind(this);
    };

    async componentDidMount(): Promise<void> {
        this.setState({
            onionSkinVisible: await OnionSkin.getOnionSkinVisibility(),
            onionSkinOpacity: await OnionSkin.getOnionSkinOpacity(),
            alwaysUseLatestSelfie: await OnionSkin.getAlwaysUseLatestSelfie(),
        });
    }

    /* Scene switches */
    preferencesScene = () => this.props.navigation.navigate("Preferences");

    /** Reset all settings to default */
    async resetSettings(): Promise<void> {
        await OnionSkin.setOnionSkinVisibility(false);
        await OnionSkin.setAlwaysUseLatestSelfie(false);
        await OnionSkin.setOnionSkinOpacity(0.45);

        this.setState({
            onionSkinVisible: false,
            alwaysUseLatestSelfie: false,
            onionSkinOpacity: 0.45
        });
    }

	render() {
		return (
            <React.Fragment>
			<SafeAreaView style={Styles.container}>

                <KeyboardAvoidingView style={[Styles.keyboardAvoidingView, {paddingHorizontal: 0}]} behavior="padding">
                    <View style={Styles.scrollViewContainer}>
                        <ScrollGradient />
                        <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                            <View style={Styles.padded}><Text style={Styles.header}>Onion Skin 🧅</Text></View>

                            {/* Onionskin */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>👀 Visible</Text>
                                <View><Text style={Styles.paragraph}>
                                    To select onionskin selfie, go to review images {">"} ⚙️ {">"} Onionskin
                                </Text></View>

                                <SelectInput
                                    buttons={["YES", "NO"]}
                                    initial={this.state.onionSkinVisible ? 0 : 1}
                                    onChange={(idx) => {
                                        this.setState({ onionSkinVisible: idx == 0 ? true : false });
                                        OnionSkin.setOnionSkinVisibility(idx == 0 ? true : false);
                                    }}
                                />

                                <Text style={[Styles.paragraph, { marginTop: 10 }]}>Onion skin opacity</Text>
                                <SliderInput
                                    onChange={(nr) => {
                                        this.setState({ onionSkinOpacity: nr });
                                        OnionSkin.setOnionSkinOpacity(nr);
                                    }}
                                    initial={this.state.onionSkinOpacity}
                                />

                                <View><Text style={Styles.paragraph}>
                                    Always use the latest selfie taken instead of the one set in review-images
                                </Text></View>

                                <SelectInput
                                    buttons={["YES", "NO"]}
                                    initial={this.state.alwaysUseLatestSelfie ? 0 : 1}
                                    onChange={(idx) => {
                                        this.setState({ alwaysUseLatestSelfie: idx == 0 ? true : false });
                                        OnionSkin.setAlwaysUseLatestSelfie(idx == 0 ? true : false);
                                    }}
                                />
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Redo face calibration */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>🚨 Danger zone</Text>
                                <Text style={Styles.paragraph}>Reset onionskin settings to default</Text>
                                <Button
                                    confirm={{ message: "Are you sure you want to reset your onion-skin settings?", title: "Reset config" }}
                                    color="red"
                                    active
                                    onPress={this.resetSettings}
                                    text="Reset settings"
                                />
                            </View>
                        </ScrollView>
                    </View>

                    {/* Confirm */}
                    <View style={[Styles.padded, { transform: [{ translateY: -12 }] }]}>
                        <Button color="blue" active onPress={this.preferencesScene} text="← Back" />
                    </View>
                </KeyboardAvoidingView>

                <StatusBar style="dark" />
			</SafeAreaView>
            </React.Fragment>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <OnionSkinPreferences {...props} navigation={navigation} />;
}
