/* Imports */
import React from "react";
import { Alert, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as RNFS from "react-native-fs";
import { Button } from "../../components/button/Button";
import { Banner } from "../../components/advertising/Ad";
import MenuTemplate from "../../styleBundles/template/MenuTemplate";
import AppConfig from "./Config";
import { OnionSkin } from "../camera/onionSkin/OnionSkin";
import { LSImage } from "../../functional/Image";
import ComposerConfig from "../composer/Config";
import { TitleH1, TitleH2, TitleH3 } from "../../components/text/Title";
import StreakHandler from "../../functional/Streak";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        CameraPreferences: undefined,
        GeneralPreferences: undefined
    }, "CameraPreferences" | "GeneralPreferences">,
}
export interface State {
    alwaysUseLatestSelfie: boolean,
    onionSkinVisible: boolean,
    onionSkinOpacity: number,
    streak: number,
    
    deletingImages: boolean
}

class Menu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            onionSkinVisible: false,
            alwaysUseLatestSelfie: false,
            onionSkinOpacity: 0.45,
            streak: 0.45,

            deletingImages: false
        };

        /* Bindings */
        this.deleteImages = this.deleteImages.bind(this);
    };

    async componentDidMount(): Promise<void> {
        this.setState({
            streak: await StreakHandler.getCurrent()
        });
    }

    /** Reset all settings to default */
    async resetSettings(): Promise<void> {
        await OnionSkin.setOnionSkinVisibility(false);
        await OnionSkin.setAlwaysUseLatestSelfie(false);
        await OnionSkin.setOnionSkinOpacity(0.45);

        await AppConfig.setTransformCamera(true);
        await AppConfig.setCameraDirectionFront(true);
        await AppConfig.setPersonalizedAds(true);
        await AppConfig.setSaveSelfiesToCameraRoll(false);
        await AppConfig.setTargetTimesPerDay(2);
        await AppConfig.setPostProcessingAlign(true);

        await ComposerConfig.setBitrate(null); // no overwrite
        await ComposerConfig.setFormat(1); // 1 = mp4
        await ComposerConfig.setFramerate(1); // 1 = 30fps
        await ComposerConfig.setFramerateOverride(null); // no overwrite
        await ComposerConfig.setQuality(2); // 2 = high quality
        await ComposerConfig.setWidthOverride(null); // no overwrite

        Alert.alert("Success 🎉");
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
            alert("No selfies were deleted!")
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

    /* Scene switches */
    goTo = (scene: string) => this.props.navigation.navigate(scene as any);

	render() {
		return (
            <MenuTemplate backButtonPress="Camera">
                <View style={[Styles.padded, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
                    <TitleH1 title="Menu" />
                    {this.state.streak && this.state.streak > 0 && <Text style={Styles.header2}>{this.state.streak} 🔥</Text>}
                </View>
                {/* Goto composer scene */}
                <View style={[Styles.row, Styles.padded]}>
                    <View style={Styles.tile}>
                        <Button emojiSize={64} emoji="🎨" flex active onPress={() => this.goTo("Composer")} text="Create" />
                    </View>
                    <View style={Styles.tile}>
                        <Text style={Styles.header2}>Composer</Text>
                        <Text style={[Styles.paragraph, { paddingHorizontal: 0 }]}>Tweak and render your MeLapse footage</Text>
                    </View>
                </View>

                <View style={[Styles.row, Styles.padded]}>
                    <View style={Styles.tile}>
                        <Button emojiSize={64} emoji="🔍" flex active onPress={() => this.goTo("Review")} text="Review" />
                    </View>
                    <View style={Styles.tile}>
                        <Text style={Styles.header2}>Review</Text>
                        <Text style={[Styles.paragraph, { paddingHorizontal: 0 }]}>See all the selfies you've taken so far</Text>
                    </View>
                </View>

                <View style={[Styles.hr, Styles.hrPadded]} />

                <Text style={[Styles.header2, Styles.hrPadded]}>Preferences</Text>
                <View style={[Styles.padded, { gap: 10 }]}>
                    <Button
                        onPress={() => this.goTo("GeneralPreferences")}
                        flex
                        active
                        text="General"
                        emoji="⚙️"
                    />
                    <Button
                        onPress={() => this.goTo("CameraPreferences")}
                        flex
                        active
                        text="Camera"
                        emoji="📷"
                    />
                </View>

                <View style={[Styles.hr, Styles.hrPadded]} />
                <Banner />
                <View style={[Styles.hr, Styles.hrPadded]} />

                <Text style={[Styles.header2, Styles.hrPadded]}>Other</Text>
                <View style={[Styles.padded, { gap: 10 }]}>
                    <Button
                        onPress={() => this.goTo("Help")}
                        flex
                        active
                        text="Help"
                        emoji="🛟"
                    />
                    <Button
                        onPress={() => this.goTo("Tutorial")}
                        flex
                        active
                        text="Tutorial"
                        emoji="🤔"
                    />
                    <Button
                        onPress={() => this.goTo("ThankYou")}
                        flex
                        active
                        text="Credits"
                        emoji="🙏"
                    />
                </View>

                <View style={[Styles.hr, Styles.hrPadded]} />

                {/* Redo face calibration */}
                <Text style={[Styles.header2, Styles.hrPadded]}>Danger-zone</Text>
                <View style={[Styles.padded, { gap: 10 }]}>
                    <Button
                        color="red"
                        active
                        onPress={() => this.goTo("Calibration")}
                        text="New calibration"
                        emoji="😵"
                    />
                    <Button
                        confirm={{ message: "Are you sure you want to reset your settings?", title: "Reset config" }}
                        color="red"
                        active
                        onPress={this.resetSettings}
                        text="Reset settings"
                        emoji="⚙️"
                    />
                    <Button
                        confirm={{
                            message: "Are you really sure you want to delete all your selfies? This process cannot be undone.",
                            title: "⚠️ Delete images ⚠️"
                        }}
                        color="red"
                        active
                        onPress={this.deleteImages}
                        loading={this.state.deletingImages}
                        text="Delete selfies"
                        emoji="🗑️"
                    />
                </View>
            </MenuTemplate>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Menu {...props} navigation={navigation} />;
}
