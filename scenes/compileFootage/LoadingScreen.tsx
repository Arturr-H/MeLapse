/* Imports */
import React, { RefObject } from "react";
import { Animated, Easing, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { generateVideo } from "../../functional/VideoCreator";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { Button } from "../../components/button/Button";
import { StatusBar } from "expo-status-bar";
import { ProgressBar } from "../../components/progressBar/ProgressBar";
import ButtonStyles from "../../components/button/Styles";
import { RewardedAd, RewardedAdEventType } from "react-native-google-mobile-ads";
import AppConfig from "../preferences/Config";
import { REWARDED_UNIT_ID } from "../../components/advertising/Util";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Composer: undefined }, "Composer">,

    params: StitchOptions
}
interface State {
    diskRotation: Animated.Value,
    loading: boolean,
}
export interface StitchOptions {
    fps: number,
    outputFormat: "gif" | "mp4",
    quality: "low" | "mid" | "high",
    bitrateOverride: number | null,

    widthOverride: number | null,
    framerateOverride: number | null,
}

class LoadingScreen extends React.Component<Props, State> {
    /* Refs */
    multianimator: RefObject<MultiAnimator> = React.createRef();
    progressBar: RefObject<ProgressBar> = React.createRef();
    posterHasAnimated: boolean = false;

    /** Should cancel ffmpeg stitching */
    shouldCancel: boolean = false;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            diskRotation: new Animated.Value(0),
            loading: true,
        };

        /* Bindings */
        this.onProgressUpdate = this.onProgressUpdate.bind(this);
        this._generateVideo = this._generateVideo.bind(this);
        this.goBack = this.goBack.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        await this.loadAd();

        Animated.loop(Animated.timing(this.state.diskRotation, {
            toValue: 360,
            easing: Easing.linear,
            useNativeDriver: true,
            duration: 5000
        })).start()
    }

    /** Load reward ad, and try render */
    async loadAd(): Promise<void> {
        const personalized = await AppConfig.getPersonalizedAds() ?? false;
        let hasGenerated = false;

        /* If the ad hasn't loaded after 2 seconds, we start
            to render anyways. Ad can come after it or not */
        const loadTimeout: NodeJS.Timeout = setTimeout(() => {
            if (!hasGenerated) {
                hasGenerated = true;
                this._generateVideo();
            }
        }, 2000);

        /* Try load */
        new Promise<void>((resolve, _) => {
            const rew = RewardedAd.createForAdRequest(REWARDED_UNIT_ID, {
                requestNonPersonalizedAdsOnly: personalized
            });

            /* Show and resolve */
            rew.addAdEventListener(RewardedAdEventType.LOADED, () => {
                clearTimeout(loadTimeout);
                rew.show();
                rew.removeAllListeners();
                resolve();
            });

            rew.load();
        })

        /* On ad load success */
        .then(_ => {
            if (!hasGenerated) {
                hasGenerated = true;
                this._generateVideo();
            };
        });
    }

    /** Generate the timmelapse footage */
    async _generateVideo(): Promise<void> {
        try {
            await generateVideo(async () => {
                this.setState({ loading: false });
            }, this.props.params, this.onProgressUpdate);
        } catch {
            alert("Couldn't generate video");
        }
    }

    /** New progress recieved */
    onProgressUpdate(pgr: number): void {
        this.progressBar.current?.updateProgress(pgr);
    }

    /** Can cancel the ffmpeg gif stitching process
     * and switches back scene */
    goBack(shouldCancel: boolean): void {
        this.shouldCancel = shouldCancel;

        const nav = () => this.props.navigation.navigate("Composer");

        if (shouldCancel === true)
            FFmpegKit.cancel().then(nav);
        else
            nav();
    }

    render() {
        const diskRotation = { transform: [{ rotate: this.state.diskRotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"],
        }) }] };

        return (
            <SafeAreaView style={Styles.container}>
                <View style={Styles.padding}>
                    <View style={Styles.innerContainer}>
                        {this.state.loading ? <View>
                            <Text style={[Styles.loadingText, { textAlign: "center" }]}>Footage is being rendered - don't leave this application</Text>
                        </View> : null}
                    </View>

                    <View style={Styles.loadingContainer}>
                        {this.state.loading ? (
                            <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
                                <ProgressBar ref={this.progressBar} />
                                <Button
                                    flex
                                    active={true}
                                    color="blue"
                                    style={{ overflow: "hidden" }}
                                    onPress={() => this.goBack(true)}
                                >
                                    <Text style={ButtonStyles.buttonText}>Cancel</Text>
                                    <Animated.Text style={[ButtonStyles.buttonText, Styles.disk, diskRotation]}>📀</Animated.Text>
                                </Button>
                            </View>
                        )
                            : (
                                <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
                                    <Text style={Styles.loadingText}>Footage saved to camera roll  🎉</Text>
                                    <Button flex active={true} color="blue" onPress={() => this.goBack(false)} text="← Back" />
                                </View>
                            )}
                    </View>
                </View>

                <StatusBar style="dark" />
            </SafeAreaView>
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <LoadingScreen params={props.route.params} {...props} navigation={navigation} />;
}

