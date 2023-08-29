/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import SelectInput from "../../components/selectInput/SelectInput";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: "preferences" } }, "Camera">,
}
export interface State {
    switching: boolean
}

class Preferences extends React.Component<Props, State> {
    nameInput: RefObject<TextInput>;
    animatorComponent: RefObject<Animator>;
    bottomNavAnimator: RefObject<Animator>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false
        };

        /* Bindings */
        this.cameraScene = this.cameraScene.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        
        /* Refs */
        this.nameInput = React.createRef();
        this.animatorComponent = React.createRef();
        this.bottomNavAnimator = React.createRef();
    };

    componentDidMount(): void {
        this.props.navigation.addListener("focus", () => {
            this.animatorComponent.current?.fadeOut(0).fadeIn(750).start();
            this.bottomNavAnimator.current?.fadeOut(0).fadeIn(750).start();
        })
    }

    /* Lifetime */
    cameraScene(): void {
        this.bottomNavAnimator.current?.fadeOut(750).start();
        this.animatorComponent.current?.fadeOut(750).start(() => {
            this.props.navigation.navigate("Camera", { comesFrom: "preferences" });
        });
    }

    /* Try confirm */
    onConfirm(): void {
        let name = this.nameInput.current?.tryGetValue();

        if (name != null) {
            this.setState({ switching: true });

            this.cameraScene();
        }else {
            console.log("NO NAME");
        }
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.keyboardAvoidingView}
                    behavior="padding"
                >
                        <ScrollView
                            contentContainerStyle={Styles.containerInner}
                            showsVerticalScrollIndicator={false}
                            // keyboardShouldPersistTaps="handled"    
                        >
                            <Animator
                                style={Styles.containerInner}
                                ref={this.animatorComponent}
                                startOpacity={0}
                            >
                                <View><Text style={Styles.header}>Preferences ⚙️</Text></View>

                                {/* Username input */}
                                <View>
                                <View><Text style={Styles.paragraph}>Username</Text></View>
                                <TextInput
                                    ref={this.nameInput}
                                    placeholder="Name..."
                                    active={!this.state.switching}
                                />
                                </View>

                                {/* "How often" input */}
                                <View>
                                <View><Text style={Styles.paragraph}>How often</Text></View>
                                <SelectInput
                                    buttons={["1", "2", "3", "🤷‍♂️"]}
                                    onChange={() => {}}
                                />
                                </View>

                                {/* Redo face calibration */}
                                <View>
                                <View><Text style={Styles.paragraph}>Redo your face calibration (not recommended)</Text></View>
                                <Button color="blue" active={!this.state.switching} onPress={this.onConfirm} text="New face calib  📸" />
                                </View>

                                {/* Reset settings */}
                                <View>
                                <View><Text style={Styles.paragraph}>Reset settings to default</Text></View>
                                <Button color="red" active={!this.state.switching} onPress={this.onConfirm} text="Reset settings  🗑️" />
                                </View>
                            </Animator>
                        </ScrollView>

                        {/* Confirm */}
                        <Animator startOpacity={0} ref={this.bottomNavAnimator}>
                            <View style={Styles.row}>
                                <Button flex color="blue" active={!this.state.switching} onPress={this.onConfirm} text="Save" />
                                <Button flex color="blue" active={!this.state.switching} onPress={this.cameraScene} text="Cancel" />
                            </View>
                        </Animator>
                </KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Preferences {...props} navigation={navigation} />;
}
