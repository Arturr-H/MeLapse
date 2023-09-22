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
import { LSImage } from "../../functional/Image";
import { stitchImages } from "../../functional/VideoCreator";
import { StatusBar } from "expo-status-bar";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Camera: { comesFrom: "preferences" },
        Debug: undefined,
        Composer: undefined,
        Review: undefined
    }, "Camera" | "Debug" | "Composer" | "Review">,
}
export interface State {
    switching: boolean,

    saveSelfiesToCameraRoll: boolean,
    postProcessingTransform: boolean,
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
            postProcessingTransform: true,
            saveSelfiesToCameraRoll: false,
            username: "",
            transformCamera: false,
        };

        /* Bindings */
        this.resetSettings = this.resetSettings.bind(this);
        
        /* Refs */
        this.nameInput = React.createRef();
        this.animatorComponent = React.createRef();
        this.bottomNavAnimator = React.createRef();
    };

    async componentDidMount(): Promise<void> {
        this.fadeIn();
        this.props.navigation.addListener("focus", this.fadeIn);

        this.setState({
            timesPerDay: await AppConfig.getTargetTimesPerDay() as number,
            username: await AppConfig.getUsername(),
            transformCamera: await AppConfig.getTransformCamera(),
            postProcessingTransform: await AppConfig.getPostProcessingTransform(),
            saveSelfiesToCameraRoll: await AppConfig.getSaveSelfiesToCameraRoll(),
        });
    }
    componentWillUnmount(): void {
        this.props.navigation.removeListener("focus", this.fadeIn);
    }
    fadeIn = () => {
        this.animatorComponent.current?.fadeOut(0, 0, () => {
            this.animatorComponent.current?.fadeIn(200, 50);
        });
        this.bottomNavAnimator.current?.fadeOut(0).fadeIn(400).start();
    }
    fadeOut = (callback?: () => void) => {
        this.animatorComponent.current?.fadeOut(200, 50);
        this.bottomNavAnimator.current?.fadeOut(400).start(callback);
    }

    /* Scene switches */
    cameraScene = () => this.fadeOut(() => 
        this.props.navigation.navigate("Camera", { comesFrom: "preferences" })
    )
    composerScene = () => this.fadeOut(() => 
        this.props.navigation.navigate("Composer")
    )
    reviewScene = () => this.fadeOut(() => 
        this.props.navigation.navigate("Review")
    )

    /** Reset all settings to default */
    async resetSettings(): Promise<void> {
        await AppConfig.setTargetTimesPerDay(TargetTimesPerDay.NotSet);
        await AppConfig.setUsername("User");
        await AppConfig.setTransformCamera(false);
        await AppConfig.setPostProcessingTransform(true);
        await AppConfig.setSaveSelfiesToCameraRoll(false);

        this.setState({
            timesPerDay: await AppConfig.getTargetTimesPerDay() as number,
            username: await AppConfig.getUsername(),
            transformCamera: await AppConfig.getTransformCamera(),
            postProcessingTransform: await AppConfig.getPostProcessingTransform(),
            saveSelfiesToCameraRoll: await AppConfig.getSaveSelfiesToCameraRoll(),
        });
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView style={Styles.keyboardAvoidingView} behavior="padding">
                    <View style={Styles.scrollViewContainer}>
                        <ScrollGradient />
                        <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                            <MultiAnimator ref={this.animatorComponent}>
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
                                    <View><Text style={Styles.paragraph}>Your target amount of selfies per day</Text></View>
                                    <SelectInput
                                        buttons={["1", "2", "3", "🤷‍♂️"]}
                                        initial={this.state.timesPerDay}
                                        onChange={AppConfig.setTargetTimesPerDay}
                                    />
                                </View>

                                {/* Transform camera */}
                                <View>
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

                                {/* Goto composer scene */}
                                <View>
                                    <Text style={Styles.paragraph}>Go to composer scene for creating your final timelapse-footage.</Text>
                                    <Button color="green" active={!this.state.switching} onPress={this.composerScene} text="Generate video  🎨" />
                                </View>

                                <View style={Styles.hr} />

                                {/* Post processing */}
                                <View>
                                    <Text style={Styles.header2}>⭐️ Post processing</Text>
                                    <View><Text style={Styles.paragraph}>Automatically align your face to the calibrated position after taking photo (recommended)</Text></View>

                                    <SelectInput
                                        buttons={["ALIGN", "STATIC"]}
                                        initial={this.state.postProcessingTransform ? 0 : 1}
                                        onChange={(idx) => {
                                            this.setState({ postProcessingTransform: idx == 0 ? true : false });
                                            AppConfig.setPostProcessingTransform(idx == 0 ? true : false);
                                        }}
                                    />
                                </View>

                                <View style={Styles.hr} />
                                
                                {/* Post processing */}
                                <View>
                                    <Text style={Styles.header2}>🧹 Review images</Text>
                                    <View><Text style={Styles.paragraph}>Cycle through all of your selfies, and remove the ones you don't like</Text></View>

                                    <Button
                                        color="blue"
                                        onPress={this.reviewScene}
                                        active
                                        text="Review images"
                                    />
                                </View>

                                {/* Save image media lib */}
                                <View>
                                    <View><Text style={Styles.paragraph}>Automatically save each selfie to your camera roll (won't apply to previous selfies)</Text></View>

                                    <SelectInput
                                        buttons={["YES", "NO"]}
                                        initial={this.state.saveSelfiesToCameraRoll ? 0 : 1}
                                        onChange={(idx) => {
                                            this.setState({ saveSelfiesToCameraRoll: idx == 0 ? true : false });
                                            AppConfig.setSaveSelfiesToCameraRoll(idx == 0 ? true : false);
                                        }}
                                    />
                                </View>

                                <View style={Styles.hr} />

                                {/* Redo face calibration */}
                                <View>
                                    <Text style={Styles.header2}>🚨 Danger zone</Text>
                                    <View><Text style={Styles.paragraph}>Redo your face calibration (not recommended)</Text></View>
                                    <Button color="red" active={!this.state.switching} onPress={() => {}} text="New face calib  📸" />
                                </View>

                                {/* Reset config */}
                                <View>
                                    <Text style={Styles.paragraph}>Reset settings to default</Text>
                                    <Button
                                        confirm={{ message: "Are you sure you want to reset your settings?", title: "Reset config" }}
                                        color="red"
                                        active={!this.state.switching}
                                        onPress={this.resetSettings}
                                        text="Reset settings  🗑️"
                                    />
                                </View>
                            </MultiAnimator>
                        </ScrollView>
                    </View>

                    {/* Confirm */}
                    <Animator startOpacity={0} ref={this.bottomNavAnimator} style={{ transform: [{ translateY: -12 }] }}>
                        <Button color="blue" active={!this.state.switching} onPress={this.cameraScene} text="Done" />
                    </Animator>
                </KeyboardAvoidingView>

                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Preferences {...props} navigation={navigation} />;
}
