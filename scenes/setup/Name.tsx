/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ HowOften: undefined }, "HowOften">,
}
export interface State {
    switching: boolean
}

class Name extends React.PureComponent<Props, State> {
    nameInput: RefObject<TextInput>;

    s1: RefObject<Animator>;
    s2: RefObject<Animator>;
    s3: RefObject<Animator>;

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
        
        /* Refs */
        this.nameInput = React.createRef();
        this.s1 = React.createRef();
        this.s2 = React.createRef();
        this.s3 = React.createRef();
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.fadeIn();
    };
    fadeIn(): void {
        [this.s1, this.s2, this.s3].forEach((e, index) => {
            e.current?.wait(index*200).fadeIn(400).start()
        });
    }
    fadeOut(): void {
        [this.s1, this.s2, this.s3].forEach((e, index) => {
            e.current?.wait(index*200).fadeOut(400).start()
        });
    }

    /* Try confirm */
    onConfirm(): void {
        let name = this.nameInput.current?.tryGetValue();

        if (name != null) {
            this.setState({ switching: true });
            this.fadeOut();

            setTimeout(() => {
                this.props.navigation.navigate("HowOften");
            }, 800);
            
        }else {
            console.log("NO NAME");
        }
    }

	render() {
		return (
			<View style={Styles.container}>
                <KeyboardAvoidingView style={Styles.containerInner} behavior="padding">
                    <Animator startOpacity={0} ref={this.s1}>
                        <Text style={Styles.header}>Welcome! 🎉</Text>
                        <Text style={Styles.paragraph}>Let's begin by entering your username.</Text>
                    </Animator>

                    <Animator startOpacity={0} ref={this.s2}>
                        <TextInput
                            ref={this.nameInput}
                            placeholder="Name..."
                            active={!this.state.switching}
                        />
                    </Animator>

                    {/* Confirm */}
                    <Animator startOpacity={0} ref={this.s3}>
                        <Button active={!this.state.switching} onPress={this.onConfirm} text="Confirm" />
                    </Animator>
                </KeyboardAvoidingView>
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Name {...props} navigation={navigation} />;
}
