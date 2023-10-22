/* Imports */
import React, { RefObject } from "react";
import { Alert, KeyboardAvoidingView, Linking, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import AppConfig from "./Config";
import { LSImage, saveImage } from "../../functional/Image";
import { StatusBar } from "expo-status-bar";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";
import * as RNFS from "react-native-fs";
import * as Ads from "../../components/advertising/Ad";
import { OnionSkin } from "../camera/onionSkin/OnionSkin";
import { ModalConstructor } from "../../components/modal/ModalConstructor";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { env } from "../../env.pubilc";
import { getBannerId, getRewardedId } from "../../LocalNotification";
import * as Device from "expo-device";

/* @ts-ignore */
import { BANNER, REWARDED } from "@env";
import { TestIds } from "react-native-google-mobile-ads";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Camera: { comesFrom: "preferences" },
        Debug: undefined,
        Composer: undefined,
        Review: undefined,
        Calibration: undefined,
        Tutorial: undefined,
        Statistics: undefined,
        ThankYou: undefined,
        PrivacyPolicy: { confirmLocation: "Preferences" },
        HowOften: { confirmLocation: "Preferences" | "Calibration" }
    }, "Camera" | "Debug" | "Composer" | "Review"
    | "Calibration" | "Tutorial" | "PrivacyPolicy"
    | "Statistics" | "HowOften" | "ThankYou">,
}
export interface State {
    switching: boolean,

    saveSelfiesToCameraRoll: boolean,
    onionSkinVisible: boolean,
    deletingImages: boolean,
    personalizedAds: boolean,
    transformCamera: boolean
}

class Preferences extends React.Component<Props, State> {
    modalConstructor: RefObject<ModalConstructor> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false,
            saveSelfiesToCameraRoll: false,
            onionSkinVisible: false,
            deletingImages: false,
            personalizedAds: false,
            transformCamera: true
        };

        /* Bindings */
        this.warnAboutRestartingApp = this.warnAboutRestartingApp.bind(this);
        this.importSelfies = this.importSelfies.bind(this);
        this.resetSettings = this.resetSettings.bind(this);
        this.deleteImages = this.deleteImages.bind(this);
    };

    async componentDidMount(): Promise<void> {
        this.setState({
            saveSelfiesToCameraRoll: await AppConfig.getSaveSelfiesToCameraRoll(),
            onionSkinVisible: await OnionSkin.getOnionSkinVisibility(),
            personalizedAds: await AppConfig.getPersonalizedAds(),
            transformCamera: await AppConfig.getTransformCamera(),
        });
    }

    /* Scene switches */
    cameraScene        = () => this.props.navigation.navigate("Camera", { comesFrom: "preferences" });
    composerScene      = () => this.props.navigation.navigate("Composer");
    reviewScene        = () => this.props.navigation.navigate("Review");
    calibrationScene   = () => this.props.navigation.navigate("Calibration");
    tutorialScene      = () => this.props.navigation.navigate("Tutorial");
    statisticsScene    = () => this.props.navigation.navigate("Statistics");
    howOftenScene      = () => this.props.navigation.navigate("HowOften", { confirmLocation: "Preferences" });
    thankYouScene      = () => this.props.navigation.navigate("ThankYou");
    privacyPolicyScene = () => {
        Linking.openURL("https://arturr-h.github.io/MeLapse-Pages/index.html");
    }

    /** Reset all settings to default */
    async resetSettings(): Promise<void> {
        await AppConfig.setSaveSelfiesToCameraRoll(false);
        await OnionSkin.setOnionSkinVisibility(false);
        await AppConfig.setTransformCamera(true);

        this.setState({
            onionSkinVisible: false,
            saveSelfiesToCameraRoll: false,
            transformCamera: true,
        });
    }

    /** Delete all selfies */
    async deleteImages(): Promise<void> {
        this.setState({ deletingImages: true });

        /* Noooooooo */
        async function delete_(): Promise<void> {
            await LSImage.resetImagePointersFile();
            await RNFS.readdir(RNFS.DocumentDirectoryPath).then(async e =>
                e.forEach(async a =>
                    await RNFS.unlink(RNFS.DocumentDirectoryPath + "/" + a)
                )
            );
        };

        const cancel = async (): Promise<void> => {
            this.setState({ deletingImages: false });
            alert("Phew images saved!")
        }
        const confirm = async (value?: string): Promise<void> => {
            if (value && value.toLocaleLowerCase().trim() === "yes") await delete_().then(_ => {
                this.setState({ deletingImages: false });
                alert("All selfies deleted 😣");
            })
            else cancel();
        };

        /* Prompt */
        Alert.prompt(
            "Really?",
            "Are you really REALLY sure? (type \"yes\")",
            [
                { text: "Cancel", style: "default", onPress: cancel },
                { text: "Submit", style: "destructive", onPress: confirm },
            ]
        );
    }

    /* When settings personalized ads to enabled */
    warnAboutRestartingApp(isPersonal: boolean): void {
        this.modalConstructor.current?.constructModal({
            header: "Restart app",
            description: 
                isPersonal
                    ? "Restart the app to have your ads personalized (Can be done later)"
                    : "Restart the app to fully disable personalized ads (Can be done later)",

            buttons: [{
                text: "Okay",
                color: "blue",
                onClick: "close"
            }]
        })
    }

    /** Opens user media lib to select selfies to import */
    async importSelfies(): Promise<void> {
        await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            allowsMultipleSelection: true
        }).then(result => {
            if (!result.canceled) {
                result.assets.forEach((asset, idx) => {
                    setTimeout(() => {
                        saveImage(new LSImage().withPath(asset.uri));
                    }, 40*idx);
                })
            }
        }).finally(() => {
            alert("Selfies imported!")
        })
    }

	render() {
		return (
            <React.Fragment>
            <ModalConstructor ref={this.modalConstructor} />
			<SafeAreaView style={Styles.container}>

                <KeyboardAvoidingView style={[Styles.keyboardAvoidingView, {paddingHorizontal: 0}]} behavior="padding">
                    <View style={Styles.scrollViewContainer}>
                        <ScrollGradient />
                        <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                            <View style={Styles.padded}><Text style={Styles.header}>Preferences ⚙️</Text></View>

                            {/* Goto composer scene */}
                            <View style={[Styles.row, Styles.padded]}>
                                <View style={Styles.tile}>
                                    <Button flex active onPress={this.composerScene} text="Create →" />
                                </View>
                                <View style={Styles.tile}>
                                    <Text style={Styles.header2}>🎨 Composer</Text>
                                    <Text style={Styles.paragraph}>Create your final timelapse-footage.</Text>
                                </View>
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />
                            
                            {/* Review images */}
                            <View style={Styles.padded}>
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
                            <View style={Styles.padded}>
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

                            <Ads.Banner />

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Onionskin */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>🧅 Onion skin</Text>
                                <View><Text style={Styles.paragraph}>
                                    Display a thin layer above the camera view of a previous selfie, to help you align your face better.
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
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Notification */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>🔔 Notifications</Text>
                                <View><Text style={Styles.paragraph}>
                                    Change your notification preferences. I recommend 2 notifications per day 😎
                                </Text></View>

                                <Button
                                    active
                                    onPress={this.howOftenScene}
                                    text="Notifications →"
                                />
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Personalized ads */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>🎯 Personalized ads</Text>
                                <View><Text style={Styles.paragraph}>
                                    Enable personalized ads
                                </Text></View>

                                <SelectInput
                                    buttons={["ON", "OFF"]}
                                    initial={this.state.personalizedAds ? 0 : 1}
                                    onChange={(idx) => {
                                        const personalized = idx == 0 ? true : false;
                                        this.warnAboutRestartingApp(personalized);
                                        this.setState({ personalizedAds: personalized });
                                        AppConfig.setPersonalizedAds(personalized);
                                    }}
                                />
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Personalized ads */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>📽️ Transform camera</Text>
                                <View><Text style={Styles.paragraph}>
                                    Transform the camera to the center in camera view. Only visual - transformations
                                    will be applied nonetheless
                                </Text></View>

                                <SelectInput
                                    buttons={["ON", "OFF"]}
                                    initial={this.state.transformCamera ? 0 : 1}
                                    onChange={(idx) => {
                                        const condition = idx == 0 ? true : false;
                                        this.setState({ transformCamera: condition });
                                        AppConfig.setTransformCamera(condition);
                                    }}
                                />
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Redo tutorial */}
                            <View style={[Styles.padded, { gap: 15 }]}>
                                <Text style={Styles.header2}>🔩 Miscellaneous</Text>
                                <Button
                                    color="blue"
                                    active
                                    onPress={this.tutorialScene}
                                    text="Tutorial →"
                                />
                                {/* <Button
                                    color="blue"
                                    active
                                    onPress={this.statisticsScene}
                                    text="Statistics →"
                                /> */}
                                <Button
                                    color="blue"
                                    active
                                    onPress={this.importSelfies}
                                    text="Import selfies"
                                />
                                <Button
                                    color="blue"
                                    active
                                    onPress={this.privacyPolicyScene}
                                    text="Privacy policy →"
                                />
                                <Button
                                    color="blue"
                                    active
                                    onPress={this.thankYouScene}
                                    text="Credits →"
                                />
                            </View>

                            <View style={[Styles.hr, Styles.hrPadded]} />

                            {/* Redo face calibration */}
                            <View style={Styles.padded}>
                                <Text style={Styles.header2}>🚨 Danger zone</Text>
                                <View><Text style={Styles.paragraph}>Redo your face calibration (not recommended)</Text></View>
                                <Button color="red" active onPress={this.calibrationScene} text="New face calib →" />
                            </View>

                            {/* Reset config */}
                            <View style={Styles.padded}>
                                <Text style={Styles.paragraph}>Reset settings to default</Text>
                                <Button
                                    confirm={{ message: "Are you sure you want to reset your settings?", title: "Reset config" }}
                                    color="red"
                                    active
                                    onPress={this.resetSettings}
                                    text="Reset settings"
                                />
                            </View>

                            {/* Delete data */}
                            <View style={Styles.padded}>
                                <Text style={Styles.paragraph}>Delete all selfies you've taken (forever)</Text>
                                <Button
                                    confirm={{
                                        message: "Are you really sure you want to delete all your selfies? This process cannot be undone.",
                                        title: "⚠️ Delete images ⚠️"
                                    }}
                                    color="red"
                                    active
                                    onPress={this.deleteImages}
                                    loading={this.state.deletingImages}
                                    text="Delete all selfies"
                                />
                            </View>

                            <View style={{ position: "absolute", bottom: 0, transform: [{ translateY: 400 }], paddingHorizontal: 30 }}>
                                <Text style={Styles.paragraph}>p_ads: {env.PRODUCTION_ADS === true ? "true" : "false"}</Text>
                                <Text style={Styles.paragraph}>g_bid: {getBannerId().slice(getBannerId().length - 3, getBannerId().length - 1)}</Text>
                                <Text style={Styles.paragraph}>g_rid: {getRewardedId().slice(getRewardedId().length - 3, getRewardedId().length - 1)}</Text>
                                <Text style={Styles.paragraph}>production</Text>
                                <Text style={Styles.paragraph}>p_bid: {BANNER.slice(BANNER.length - 3, BANNER.length - 1)}</Text>
                                <Text style={Styles.paragraph}>p_rid: {REWARDED.slice(REWARDED.length - 3, REWARDED.length - 1)}</Text>
                                <Text style={Styles.paragraph}>dev</Text>
                                <Text style={Styles.paragraph}>t_bid: {TestIds.BANNER.slice(TestIds.BANNER.length - 3, TestIds.BANNER.length - 1)}</Text>
                                <Text style={Styles.paragraph}>t_rid: {TestIds.REWARDED.slice(TestIds.REWARDED.length - 3, TestIds.REWARDED.length - 1)}</Text>
                                <Text style={Styles.paragraph}>{Device.brand}</Text>
                                <Text style={Styles.paragraph}>{Device.osBuildId}</Text>
                                <Text style={Styles.paragraph}>{Device.supportedCpuArchitectures?.join("...")}</Text>
                                <Text style={Styles.paragraph}>{Device.osBuildId}</Text>
                                <Text style={Styles.paragraph}>{Device.totalMemory}</Text>
                                <Text style={Styles.paragraph}>{Device.platformApiLevel}</Text>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Confirm */}
                    <View style={[Styles.padded, { transform: [{ translateY: -12 }] }]}>
                        <Button color="blue" active onPress={this.cameraScene} text="← Back" />
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
  
	return <Preferences {...props} navigation={navigation} />;
}
