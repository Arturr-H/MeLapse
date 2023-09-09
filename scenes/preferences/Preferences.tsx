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
import AppConfig, { TargetTimesPerDay } from "./Config";
import MultiAnimator from "../../components/animator/MultiAnimator";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: "preferences" } }, "Camera">,
}
export interface State {
    switching: boolean,

    transformCamera: boolean,
    timesPerDay: number,
    username: string,
}

class Preferences extends React.Component<Props, State> {
    nameInput: RefObject<TextInput>;
    animatorComponent: RefObject<MultiAnimator>;
    bottomNavAnimator: RefObject<Animator>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false,
            timesPerDay: TargetTimesPerDay.Twice,
            username: "",
            transformCamera: false,
        };

        /* Bindings */
        this.cameraScene = this.cameraScene.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        
        /* Refs */
        this.nameInput = React.createRef();
        this.animatorComponent = React.createRef();
        this.bottomNavAnimator = React.createRef();
    };

    async componentDidMount(): Promise<void> {
        const fadeIn = () => {
            this.animatorComponent.current?.fadeIn(300, 50);
            this.bottomNavAnimator.current?.fadeOut(0).fadeIn(750).start();
        };

        fadeIn();
        this.props.navigation.addListener("focus", fadeIn);

        this.setState({
            timesPerDay: await AppConfig.getTargetTimesPerDay() as number,
            username: await AppConfig.getUsername(),
            transformCamera: await AppConfig.getTransformCamera(),
        });
    }

    /* Lifetime */
    cameraScene(): void {
        this.bottomNavAnimator.current?.fadeOut(750).start();
        this.animatorComponent.current?.fadeOut(300, 50, () => {
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
                <KeyboardAvoidingView style={Styles.keyboardAvoidingView} behavior="padding">
                    <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                        <MultiAnimator
                            // style={Styles.containerInner}
                            ref={this.animatorComponent}
                            // startOpacity={0}
                        >
                            <View><Text style={Styles.header}>Preferences ⚙️</Text></View>

                            {/* Username input */}
                            <View>
                                <View><Text style={Styles.paragraph}>Username</Text></View>
                                <TextInput
                                    ref={this.nameInput}
                                    placeholder="Username..."
                                    active={!this.state.switching}
                                    initial={this.state.username}
                                    onChangeText={AppConfig.setUsername}
                                    minChars={1}
                                    maxChars={16}
                                />
                            </View>

                            {/* "How often" input */}
                            <View>
                                <View><Text style={Styles.paragraph}>How often</Text></View>
                                <SelectInput
                                    buttons={["1", "2", "3", "🤷‍♂️"]}
                                    initial={this.state.timesPerDay}
                                    onChange={AppConfig.setTargetTimesPerDay}
                                />
                            </View>

                            <View>
                                {/* Transform camera */}
                                <View><Text style={Styles.paragraph}>Transform camera in camera view</Text></View>
                                <SelectInput
                                    buttons={["YES", "NO"]}
                                    initial={this.state.transformCamera ? 0 : 1}
                                    onChange={(idx) => {
                                        this.setState({ transformCamera: idx == 0 ? true : false });
                                        AppConfig.setTransformCamera(idx == 0 ? true : false);
                                    }}
                                />
                            </View>

                            <View>
                                {/* Redo face calibration */}
                                <View><Text style={Styles.paragraph}>Redo your face calibration (not recommended)</Text></View>
                                <Button color="blue" active={!this.state.switching} onPress={this.onConfirm} text="New face calib  📸" />
                            </View>

                            <View>
                                <Text style={Styles.paragraph}>Reset settings to default</Text>
                            </View>

                            <View>
                                <Button color="red" active={!this.state.switching} onPress={this.onConfirm} text="Reset settings  🗑️" />
                            </View>
                        </MultiAnimator>
                    </ScrollView>

                    {/* Confirm */}
                    <Animator startOpacity={0} ref={this.bottomNavAnimator}>
                        <Button color="blue" active={!this.state.switching} onPress={this.cameraScene} text="Done" />
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
