/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import SelectInput from "../../components/selectInput/SelectInput";
import AppConfig, { TargetTimesPerDay } from "./Config";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { LSImage } from "../../functional/Image";
import { StatusBar } from "expo-status-bar";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";
import * as RNFS from "react-native-fs";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Camera: { comesFrom: "preferences" },
        Debug: undefined,
        Composer: undefined,
        Review: undefined,
        Calibration: undefined,
        Tutorial: undefined,
        PrivacyPolicy: undefined,
    }, "Camera" | "Debug" | "Composer" | "Review"
    | "Calibration" | "Tutorial" | "PrivacyPolicy">,
}
export interface State {
    switching: boolean,

    saveSelfiesToCameraRoll: boolean,
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
    fadeOut = (shouldIgnoreBottomNavAnim: boolean, callback?: () => void) => {
        this.animatorComponent.current?.fadeOut(200, 50, callback);

        if (!shouldIgnoreBottomNavAnim)
            this.bottomNavAnimator.current?.fadeOut(400).start();
    }

    /* Scene switches */
    cameraScene = () => this.fadeOut(false, () => 
        this.props.navigation.navigate("Camera", { comesFrom: "preferences" })
    )
    composerScene = () => this.fadeOut(true, () => 
        this.props.navigation.navigate("Composer")
    )
    reviewScene = () => this.fadeOut(false, () => 
        this.props.navigation.navigate("Review")
    )
    calibrationScene = () => this.fadeOut(false, () => 
        this.props.navigation.navigate("Calibration")
    )
    tutorialScene = () => this.fadeOut(false, () => 
        this.props.navigation.navigate("Tutorial")
    )
    privacyPolicyScene = () => this.fadeOut(false, () => 
        this.props.navigation.navigate("PrivacyPolicy")
    )

    /** Reset all settings to default */
    async resetSettings(): Promise<void> {
        await AppConfig.setTargetTimesPerDay(TargetTimesPerDay.NotSet);
        await AppConfig.setUsername("User");
        await AppConfig.setTransformCamera(false);
        await AppConfig.setSaveSelfiesToCameraRoll(false);

        this.setState({
            timesPerDay: await AppConfig.getTargetTimesPerDay() as number,
            username: await AppConfig.getUsername(),
            transformCamera: await AppConfig.getTransformCamera(),
            saveSelfiesToCameraRoll: await AppConfig.getSaveSelfiesToCameraRoll(),
        });
    }

    /** Delete all selfies */
    async deleteImages(): Promise<void> {
		await LSImage.resetImagePointersFile();
		RNFS.readdir(RNFS.DocumentDirectoryPath).then(e =>
            e.forEach(a =>
                RNFS.unlink(RNFS.DocumentDirectoryPath + "/" + a)
            )
        );
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

                                {/* Goto composer scene */}
                                <View style={Styles.row}>
                                    <View style={Styles.tile}>
                                        <Button flex color="green" active={!this.state.switching} onPress={this.composerScene} text="Create →" />
                                    </View>
                                    <View style={Styles.tile}>
                                        <Text style={Styles.header2}>🎨 Composer</Text>
                                        <Text style={Styles.paragraph}>Create your final timelapse-footage.</Text>
                                    </View>
                                </View>

                                <View style={Styles.hr} />
                                
                                {/* Review images */}
                                <View>
                                    <Text style={Styles.header2}>🧹 Review images</Text>
                                    <View><Text style={Styles.paragraph}>Review all the selfies you've taken so far. Delete, save, or keep them</Text></View>

                                    <Button
                                        color="blue"
                                        onPress={this.reviewScene}
                                        active
                                        text="Review images →"
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

                                {/* Redo tutorial */}
                                <View>
                                    <Text style={Styles.header2}>🔩 Miscellaneous</Text>
                                    <Text style={Styles.paragraph}>View the tutorial (inlcudes tips for taking better selfies)</Text>
                                    <Button
                                        color="blue"
                                        active={!this.state.switching}
                                        onPress={this.tutorialScene}
                                        text="Tutorial →"
                                    />
                                </View>

                                {/* "Privacy policy" */}
                                <View>
                                    <Text style={Styles.paragraph}>View the privacy policy</Text>
                                    <Button
                                        color="blue"
                                        active={!this.state.switching}
                                        onPress={this.privacyPolicyScene}
                                        text="Privacy policy →"
                                    />
                                </View>

                                <View style={Styles.hr} />

                                {/* Redo face calibration */}
                                <View>
                                    <Text style={Styles.header2}>🚨 Danger zone</Text>
                                    <View><Text style={Styles.paragraph}>Redo your face calibration (not recommended)</Text></View>
                                    <Button color="red" active={!this.state.switching} onPress={this.calibrationScene} text="New face calib →" />
                                </View>

                                {/* Reset config */}
                                <View>
                                    <Text style={Styles.paragraph}>Reset settings to default</Text>
                                    <Button
                                        confirm={{ message: "Are you sure you want to reset your settings?", title: "Reset config" }}
                                        color="red"
                                        active={!this.state.switching}
                                        onPress={this.resetSettings}
                                        text="Reset settings"
                                    />
                                </View>

                                {/* Delete data */}
                                <View>
                                    <Text style={Styles.paragraph}>Delete all selfies you've taken (forever)</Text>
                                    <Button
                                        confirm={{
                                            message: "Are you really sure you want to delete all your selfies? This process cannot be undone.",
                                            title: "⚠️ Delete images ⚠️"
                                        }}
                                        color="red"
                                        active={!this.state.switching}
                                        onPress={this.deleteImages}
                                        text="Delete all selfies"
                                    />
                                </View>
                            </MultiAnimator>
                        </ScrollView>
                    </View>

                    {/* Confirm */}
                    <Animator startOpacity={0} ref={this.bottomNavAnimator} style={{ transform: [{ translateY: -12 }] }}>
                        <Button color="blue" active={!this.state.switching} onPress={this.cameraScene} text="← Back" />
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
