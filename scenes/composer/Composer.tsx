/* Imports */
import React, { RefObject } from "react";
import { Animated, KeyboardAvoidingView, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import { LSImage } from "../../functional/Image";
import FramerateScroller from "./FramerateScroller";
import ComposerConfig from "./Config";
import { StitchOptions } from "../compileFootage/LoadingScreen";
import { ScrollView } from "react-native-gesture-handler";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";
import { QUALITY_OPTION_BITRATE } from "../../functional/VideoCreator";
import * as Ads from "../../components/advertising/Ad";
import { ModalConstructor } from "../../components/modal/ModalConstructor";
import { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";
import AppConfig from "../menu/Config";

/* @ts-ignore */
import { REWARDED } from "@env"
import { env } from "../../env.pubilc";
import { getRewardedId } from "../../LocalNotification";
import MenuTemplate from "../../styleBundles/template/MenuTemplate";
import { TitleH3 } from "../../components/text/Title";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{
        Preferences: undefined,
        LoadingScreen: StitchOptions,
        AdvancedComposer: undefined
    }, "Preferences" | "LoadingScreen" | "AdvancedComposer">,
}
interface State {
    config: {
        format: number,
        quality: number,
        framerate: number
    },

    /** When choosing the footage FPS, we have
     * a small display saying how many seconds
     * the footage will last for (calculated
     * via the number of photos taken / fps) */
    duration: number,

    /** If user has overwritten framerate in
     * advanced settings, we don't display the
     * regular 24, 30, 60 fps. Instead we display
     * a message saying it's overwritten. First 
     * value determines wheter if it's overwritten
     * or not second is the fps why do I write this
     * no one including me will ever read this */
    framerateIsOverwritten: [boolean, number],

    /** Rewarded ad for loading scene */
    rewardedAd?: Promise<RewardedAd>
}

class Composer extends React.Component<Props, State> {

    /* Refs */
    modalConstructor: RefObject<ModalConstructor> = React.createRef();

    /* Other */
    framerates: number[] = [24, 30, 60];
    formats: ("gif" | "mp4")[] = ["gif", "mp4"];
    rotationsAnimation: Animated.CompositeAnimation | null = null;
    qualities: ("low" | "mid" | "high")[] = ["low", "mid", "high"];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            config: {
                format: 1,
                quality: 1,
                framerate: 1,
            },

            duration: 0,
            framerateIsOverwritten: [false, 0],
        };

        /* Bindings */
        this.updateFramerateOverwritten = this.updateFramerateOverwritten.bind(this);
        this.openAdvancedSettings = this.openAdvancedSettings.bind(this);
        this.onChangeFramerate = this.onChangeFramerate.bind(this);
        this.loadingScreen = this.loadingScreen.bind(this);
        this.loadRewarded = this.loadRewarded.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.goBack = this.goBack.bind(this);
    };
    
    async componentDidMount(): Promise<void> {
        this.onFocus();
        this.setState({ rewardedAd: this.loadRewarded() });
    };
    async onFocus(): Promise<void> {
        this.updateFramerateOverwritten();
        const [format, quality, framerate] = [
            await ComposerConfig.getFormat(),
            await ComposerConfig.getQuality(),
            await ComposerConfig.getFramerate()
        ];

        await this.onChangeFramerate(framerate);

        this.setState({ config: {
            format,
            quality,
            framerate
        } });
    }
    async updateFramerateOverwritten(): Promise<void> {
        const fover = await ComposerConfig.getFramerateOverride();
        this.setState({
            framerateIsOverwritten: [fover !== null, fover ?? 0]
        })
    }

    /** Loads the rewarded ads for `LoadingScreen` */
    async loadRewarded(): Promise<RewardedAd> {
        const personalized = await AppConfig.getPersonalizedAds() ?? false;

        /* Try load */
        return new Promise<RewardedAd>((resolve, _) => {
            console.log("[Dbg] Loading rewarded ad");
            const rew = RewardedAd.createForAdRequest(getRewardedId(), {
                requestNonPersonalizedAdsOnly: personalized,
            });

            /* resolve */
            rew.addAdEventListener(RewardedAdEventType.LOADED, () => {
                console.log("[Dbg] Rewarded ad loaded");
                rew.removeAllListeners();
                resolve(rew);
            });

            rew.load();
        })
    }

    /** Goes back to preferences scene */
    goBack(): void {
        this.props.navigation.navigate("Preferences");
    }

    /** Yup */
    openAdvancedSettings(): void {
        this.props.navigation.navigate("AdvancedComposer");
    }

    /** When user switches framerate */
    async onChangeFramerate(e: number): Promise<void> {
        /* Save to composer config */
        ComposerConfig.setFramerate(e);

        /* How many images the user has taken so far */
        const amountOfImages = ((await LSImage.getImagePointers())?.length ?? 0);

        /* How long output footage will be in seconds */
        const duration_full = amountOfImages / this.framerates[e];
        const duration_int = Math.floor(duration_full);
        const duration_float = Math.floor((duration_full) * 10) / 10;
        const duration = duration_full > 1 ? duration_int: duration_float;

        /* Update state */
        this.setState({
            config: { ...this.state.config, framerate: e, },
            duration
        })
    }

    /** Generate the timelapse footage */
    async loadingScreen(): Promise<void> {
        const launchLoadingScreen = async () => {
            this.props.navigation.navigate("LoadingScreen", {
                fps: this.framerates[await ComposerConfig.getFramerate()],
                quality: this.qualities[await ComposerConfig.getQuality()],
                outputFormat: this.formats[await ComposerConfig.getFormat()],
                bitrateOverride: await ComposerConfig.getBitrate(),
                framerateOverride: await ComposerConfig.getFramerateOverride(),
                widthOverride: await ComposerConfig.getWidthOverride(),

                rewardedAd: this.state.rewardedAd
            });
        }

        /* First check if user has taken more than 5 selfies */
        const ptrs = await LSImage.getImagePointers();
        if (ptrs !== null && ptrs.length >= 5) {
            /* Launch modal */
            this.modalConstructor.current?.constructModal({
                buttons: [
                    { text: "Render", color: "blue", onClick: launchLoadingScreen },
                    { text: "Cancel", color: "red", onClick: "close" },
                ],
                header: "Render video",
                description: "Rendering your final video (which may require some time) will display an advertisement and proceed to render the video while the advertisement is playing.",
            })
        }else {
            this.modalConstructor.current?.constructModal({
                buttons: [
                    { text: "Okay", color: "blue", onClick: "close" },
                ],
                header: "Not enough",
                description: "Rendering your final video requires at least 5 selfies.",
            })
        }
    }

	render() {
		return (
            <React.Fragment>
                <ModalConstructor ref={this.modalConstructor} />
                <MenuTemplate title="Composer 🎨" backButtonPress={"Menu"}>

                    {/* Generate video */}
                    <View style={[Styles.row, Styles.padded]}>
                        <View style={Styles.tile}>
                        
                            <Button
                                onPress={this.loadingScreen}
                                active={true}
                                flex
                                height={120}
                            >
                                <Text style={Styles.framerateSelectionText}>📀</Text>
                                <Text style={Styles.paragraphWhite}>Render →</Text>
                            </Button>
                        </View>
                    </View>

                    <Ads.Banner allocatedHeight={140} />

                    <View style={[Styles.hr, Styles.hrPadded]} />

                    {/* Framerate viewer */}
                    <Text style={[Styles.header2, Styles.padded]}>🔧 Output settings</Text>
                    <View style={[Styles.row, Styles.padded]}>
                        <View style={Styles.tile}>
                            <TitleH3 title="Framerate" info="Footage frame rate (frames per second). Can be overwritten to a more specific value in the advanced composer section." />
                            <FramerateScroller 
                                framerates={this.framerates}
                                initial={this.state.config.framerate}
                                onSelect={this.onChangeFramerate}
                                overwritten={this.state.framerateIsOverwritten[0]}
                            />
                        </View>
                        <View style={Styles.tile}>
                            <View style={Styles.durationViewer}>
                                <View style={[Styles.durationViewerInner, Styles.durationViewerInnerCentered]}>

                                    {/* If framerate is overwritten */}
                                    {this.state.framerateIsOverwritten[0]
                                        ? <>
                                            <Text style={Styles.durationText}>{this.state.framerateIsOverwritten[1]}</Text>
                                            <Text style={Styles.paragraphWhite}>FPS</Text>
                                        </>
                                        : <>
                                            <Text style={Styles.durationText}>{this.state.duration}s</Text>
                                            <Text style={Styles.paragraphWhite}>Duration of your footage</Text>
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={[Styles.hr, Styles.hrPadded]} />

                    {/* Output type (?) */}
                    <View style={Styles.padded}>
                        <TitleH3 title="Format" info="Change the output format of your rendered footage (Default and recommended is MP4)." />
                        <SelectInput
                            initial={this.state.config.format}
                            onChange={ComposerConfig.setFormat}
                            buttons={["GIF", "MP4"]}
                        />
                    </View>

                    {/* Quality */}
                    <View style={Styles.padded}>
                        <TitleH3 title="Quality" info="Change the quality of the rendered footage. Higher quality footage requires more storage but looks better." />
                        <SelectInput
                            initial={this.state.config.quality}
                            buttons={[
                                { main: "LOW", lower: `${QUALITY_OPTION_BITRATE["LOW"]} MB/s` },
                                { main: "MID", lower: `${QUALITY_OPTION_BITRATE["MID"]} MB/s` },
                                { main: "HIGH", lower: `${QUALITY_OPTION_BITRATE["HIGH"]} MB/s` },
                            ]}
                            onChange={ComposerConfig.setQuality}
                        />
                    </View>


                    {/* Open advanced configuration */}
                    <View style={Styles.padded}>
                        <TitleH3 title="Advanced" info="Open the advanced composer preferences page. Not recommended unless you really know what your'e doing - some incorrect values might break your footage." />
                        <Button
                            color={"blue"}
                            active
                            onPress={this.openAdvancedSettings}
                            text="Advanced settings →"
                        />
                    </View>
                </MenuTemplate>
            </React.Fragment>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Composer {...props} navigation={navigation} />;
}
