/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import AppConfig from "../preferences/Config";
import MultiAnimator from "../../components/animator/MultiAnimator";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ HowOften: undefined }, "HowOften">,
}
export interface State {
    switching: boolean
}

class Name extends React.PureComponent<Props, State> {

    /* Refs */
    animator: RefObject<MultiAnimator> = React.createRef();
    nameInput: RefObject<TextInput> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false
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
    fadeIn(callback?: () => void): void { this.animator.current?.fadeIn(300, 100, callback); }
    fadeOut(callback?: () => void): void { this.animator.current?.fadeOut(300, 100, callback); }

    /* Try confirm */
    onConfirm(): void {
        let name = this.nameInput.current?.tryGetValue();

        if (name != null) {
            AppConfig.setUsername(name);

            this.setState({ switching: true });
            this.fadeOut(() => {
                this.props.navigation.navigate("HowOften");
            });
        }
    }

	render() {
		return (
			<View style={Styles.container}>
                <KeyboardAvoidingView style={Styles.containerInner} behavior="padding">
                    <MultiAnimator ref={this.animator}>
                        <Text style={Styles.header}>Welcome! 🎉</Text>
                        <Text style={Styles.paragraph}>Let's begin by entering your username.</Text>

                        <TextInput
                            ref={this.nameInput}
                            placeholder="Name..."
                            active={!this.state.switching}
                        />

                        {/* Confirm */}
                        <Button active={!this.state.switching} onPress={this.onConfirm} text="Confirm" />
                    </MultiAnimator>
                </KeyboardAvoidingView>
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Name {...props} navigation={navigation} />;
}
