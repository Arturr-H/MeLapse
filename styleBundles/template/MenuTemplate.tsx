/* Imports */
import React from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";

/* @ts-ignore */
import { StatusBar } from "expo-status-bar";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";
import { Button } from "../../components/button/Button";

/* Interfaces */
interface OuterProps {
    /** Scene title */
    title?: string,

    /** Content */
    children?: JSX.Element | JSX.Element[] | (JSX.Element | undefined)[],

    /** When pressing back button what 
     * scene should we switch to */
    backButtonPress: string
}
interface InnerProps {
    navigation: any,
}
interface State {}

class MenuTemplate extends React.Component<OuterProps & InnerProps, State> {
    constructor(props: OuterProps & InnerProps) {
        super(props);

        /* Bindings */
    };

    /** Scene switches */
    goTo = (scene: string) => this.props.navigation.navigate(scene);

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView style={[Styles.keyboardAvoidingView, {paddingHorizontal: 0}]} behavior="padding">
                    <View style={Styles.scrollViewContainer}>
                        <ScrollGradient />
                        <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                            {this.props.title && <View style={Styles.padded}><Text style={Styles.header}>{this.props.title}</Text></View>}

                            {this.props.children}
                        </ScrollView>
                    </View>

                    {/* Confirm */}
                    <View style={[Styles.padded, { transform: [{ translateY: -12 }] }]}>
                        <Button
                            color="blue"
                            active
                            onPress={() => this.goTo(this.props.backButtonPress)}
                            text="Back"
                        />
                    </View>
                </KeyboardAvoidingView>

                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: OuterProps) {
	const navigation = useNavigation();
  
	return <MenuTemplate {...props} navigation={navigation} />;
}
