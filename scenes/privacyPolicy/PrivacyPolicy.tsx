/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import AppConfig from "../preferences/Config";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { StatusBar } from "expo-status-bar";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined }, "Preferences">,
}
export interface State {}

class PrivacyPolicy extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
        };

        /* Bindings */
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {};
    goBack = () => this.props.navigation.navigate("Preferences");

	render() {
		return (
            <SafeAreaView style={Styles.container}>
                <View style={Styles.privacyPolicyContainer}>
                    <ScrollView style={Styles.scrollContainer}>
                        <Text style={Styles.header}>Privacy policy 📃</Text>

                        <Text style={Styles.privacyPolicyText}>
                            This Privacy Policy governs the manner in which this app collects, uses, maintains, and discloses information collected from users of the MeLapse mobile application.
                        </Text>

                        <Text style={Styles.header2}>Information this app collects</Text>

                        <Text style={Styles.privacyPolicyText}>
                            The App uses Google AdMob, an advertising service provided by Google Inc. Google AdMob may collect and use data to provide personalized advertising. This data includes but is not limited to:
                        </Text>

                        <Text style={Styles.bulletText}>• Device Information: This app may collect information about your mobile device, including the device type, unique device identifiers, and mobile network information.</Text>
                        <Text style={Styles.bulletText}>• Usage Information: This app may collect information about how you use the App, such as the duration of usage, interactions with ads, and other usage data.</Text>
                        <Text style={Styles.bulletText}>• Location Information: This app does not collect precise location information, but Google AdMob may collect this information for ad personalization if you have granted the necessary permissions.</Text>

                        <Text style={Styles.header2}>How We Use Information</Text>

                        <Text style={Styles.privacyPolicyText}>
                            This app collects and uses this information for the sole purpose of displaying advertisements within the App. The information helps the app to provide you with relevant and engaging ads. This app does not share this information with third parties for purposes other than ad personalization.
                        </Text>

                        <Text style={Styles.header2}>Opting Out of Ad Personalization</Text>

                        <Text style={Styles.privacyPolicyText}>
                            You have the option to opt out of personalized advertising within the App. To do so, please follow the instructions provided in the App's ads section in the app preferences.
                        </Text>

                        <Text style={Styles.header2}>Data Security</Text>

                        <Text style={Styles.privacyPolicyText}>
                            I take reasonable measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.
                        </Text>
                        
                        <Text style={Styles.header2}>Changes to This Privacy Policy</Text>

                        <Text style={Styles.privacyPolicyText}>
                            I may update this Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                        </Text>

                        <Text style={Styles.header2}>Contact Us</Text>

                        <Text style={Styles.privacyPolicyText}>
                            If you have any questions about this Privacy Policy, please contact me at artur.hoffsummer@icloud.com
                        </Text>

                        <Text style={Styles.privacyPolicyText}>
                            This Privacy Policy was last updated on the 11th of October 2023
                        </Text>
                    </ScrollView>
                </View>

                <View style={Styles.footer}>
                    <Button active color="blue" onPress={this.goBack} text="Okay" />
                </View>
                <StatusBar style="dark" />
            </SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <PrivacyPolicy {...props} navigation={navigation} />;
}
