/* Imports */
import React, { RefObject } from "react";
import { Animated, KeyboardAvoidingView, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import SelectInput from "../../components/selectInput/SelectInput";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { LSImage } from "../../functional/Image";
import FramerateScroller from "./FramerateScroller";
import ComposerConfig from "./Config";
import { StitchOptions } from "../compileFootage/LoadingScreen";
import { ScrollView } from "react-native-gesture-handler";
import { Animator } from "../../components/animator/Animator";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined, LoadingScreen: StitchOptions, AdvancedComposer: undefined }, "Preferences" | "LoadingScreen" | "AdvancedComposer">,
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
    framerateIsOverwritten: [boolean, number]
}

class Composer extends React.Component<Props, State> {

    /* Refs */
    animator: RefObject<MultiAnimator> = React.createRef();

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
                framerate: 1
            },

            duration: 5,
            framerateIsOverwritten: [false, 0],
        };

        /* Bindings */
        this.updateFramerateOverwritten = this.updateFramerateOverwritten.bind(this);
        this.openAdvancedSettings = this.openAdvancedSettings.bind(this);
        this.onChangeFramerate = this.onChangeFramerate.bind(this);
        this.loadingScreen = this.loadingScreen.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.goBack = this.goBack.bind(this);
    };
    
    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.animator.current?.fadeIn(200, 50);
        await this.onFocus();

        this.props.navigation.addListener("focus", this.onFocus);
    }
    componentWillUnmount(): void {
        this.props.navigation.removeListener("focus", this.onFocus);
    }
    async onFocus(): Promise<void> {
        this.updateFramerateOverwritten();
        this.fadeIn();
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

    /** Fades in scene (duh) */
    fadeIn(): void {
        this.animator.current?.fadeIn(200, 50);
    }
    
    /** Goes back to preferences scene */
    goBack(): void {
        this.animator.current?.fadeOut(200, 50, () => {
            this.props.navigation.navigate("Preferences");
        });
    }

    /** Yup */
    openAdvancedSettings(): void {
        this.animator.current?.fadeOut(200, 50, () => {
            this.props.navigation.navigate("AdvancedComposer");
        });
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
        this.animator.current?.fadeOut(200, 50, async () => {
            this.props.navigation.navigate("LoadingScreen", {
                fps: this.framerates[await ComposerConfig.getFramerate()],
                quality: this.qualities[await ComposerConfig.getQuality()],
                outputFormat: this.formats[await ComposerConfig.getFormat()],
                bitrateOverride: await ComposerConfig.getBitrate(),
                framerateOverride: await ComposerConfig.getFramerateOverride(),
                widthOverride: await ComposerConfig.getWidthOverride(),
            });
        });
    }

	render() {
		return (
			<SafeAreaView style={[Styles.container]}>
                <KeyboardAvoidingView behavior="padding" style={Styles.keyboardAvoidingView}>
                <View style={{ width: "100%", flex: 1 }}>
                    <ScrollGradient />
                    <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={Styles.containerInner}>
                        <MultiAnimator ref={this.animator}>
                        <Text style={Styles.header}>Composer 🎨</Text>

                        {/* Generate video */}
                        <View style={Styles.row}>
                            <View style={Styles.tile}>
                            
                                <Button
                                    onPress={this.loadingScreen}
                                    active={true}
                                    flex
                                    color="green"
                                    height={120}
                                >
                                    <Text style={Styles.framerateSelectionText}>📀</Text>
                                    <Text style={Styles.paragraphWhite}>Render →</Text>
                                </Button>
                            </View>
                        </View>

                        <View style={Styles.hr} />

                        {/* Framerate viewer */}
                        <View style={Styles.row}>
                            <View style={Styles.tile}>
                                <Text style={Styles.header2}>🎞️ Framerate</Text>
                                <Text style={Styles.paragraph}>Footage frame rate (frames per second)</Text>

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
                                                <Text style={Styles.paragraphWhite}>Your footage will be {this.state.duration}s long with {this.framerates[this.state.config.framerate]} fps.</Text>
                                            </>
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={Styles.hr} />

                        {/* Output type (?) */}
                        <View>
                            <Text style={Styles.header2}>🔧 Output settings</Text>
                            <Text style={Styles.paragraph}>What format should the resulting video be saved as? (Default is GIF)</Text>
                            <SelectInput
                                initial={this.state.config.format}
                                onChange={ComposerConfig.setFormat}
                                buttons={["GIF", "MP4"]}
                            />
                        </View>

                        {/* Quality */}
                        <View>
                            <Text style={Styles.paragraph}>Quality of the output result. Higher quality footage requires more storage.</Text>
                            <SelectInput
                                initial={this.state.config.quality}
                                buttons={["LOW", "MID", "HIGH"]}
                                onChange={ComposerConfig.setQuality}
                            />
                        </View>

                        <View style={Styles.hr} />

                        {/* Open advanced configuration */}
                        <View>
                            <Text style={Styles.header2}>🚧 Advanced</Text>
                            <Text style={Styles.paragraph}>Opens advanced configuration for generating final footage. Not recommended as it can break rendering process if not careful.</Text>
                            <Button
                                color={"blue"}
                                active
                                onPress={this.openAdvancedSettings}
                                text="Advanced settings →"
                            />
                        </View>
                        </MultiAnimator>
                    </View>
                    </ScrollView>
                </View>

                {/* Confirm */}
                <Animator startOpacity={1} style={{ transform: [{ translateY: -12 }], gap: 10 }}>
                    <Button
                        onPress={this.goBack}
                        active={true}
                        color="blue"
                        text="← Back"
                    />
                </Animator>
                </KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Composer {...props} navigation={navigation} />;
}
