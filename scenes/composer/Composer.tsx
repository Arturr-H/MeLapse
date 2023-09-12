/* Imports */
import React, { RefObject } from "react";
import { Animated, Easing, Image, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import SelectInput from "../../components/selectInput/SelectInput";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { LSImage } from "../../functional/Image";
import { stitchImages } from "../../functional/VideoCreator";
import FramerateScroller from "./FramerateScroller";
import { TouchableHighlight } from "react-native-gesture-handler";
import ComposerConfig from "./Config";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined }, "Preferences">,
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
    duration: number
}

class Composer extends React.Component<Props, State> {

    /* Refs */
    animator: RefObject<MultiAnimator> = React.createRef();

    /* Other */
    framerates: number[] = [24, 30, 60];
    rotationsAnimation: Animated.CompositeAnimation | null = null;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            config: {
                format: 0,
                quality: 1,
                framerate: 1
            },

            duration: 5,
        };

        /* Bindings */
        this.onChangeFramerate = this.onChangeFramerate.bind(this);
        this.goBack = this.goBack.bind(this);
    };
    
    /* Lifetime */
    async componentDidMount(): Promise<void> {
        await this.onChangeFramerate(0, true);
        this.animator.current?.fadeIn(300, 50);
        
        this.setState({ config: {
            format: await ComposerConfig.getFormat(),
            quality: await ComposerConfig.getQuality(),
            framerate: await ComposerConfig.getFramerate()
        } });
    }

    /** Goes back to preferences scene */
    goBack(): void {
        this.animator.current?.fadeOut(300, 50, () => {
            this.props.navigation.navigate("Preferences");
        });
    }

    /** When user switches framerate */
    async onChangeFramerate(e: number, dontSave?: boolean): Promise<void> {
        /* Save to composer config */
        dontSave && ComposerConfig.setFramerate(e);

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

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView style={Styles.keyboardAvoidingView} behavior="padding">
                    <MultiAnimator ref={this.animator}>
                    <Text style={Styles.header}>Composer 🎨</Text>

                    {/* Framerate viewer */}
                    <View style={Styles.row}>
                        <View style={Styles.tile}>
                            <Text style={Styles.header2}>🎞️ Framerate</Text>
                            <Text style={Styles.paragraph}>How fast would you like your end video to go?</Text>

                            <FramerateScroller 
                                framerates={this.framerates}
                                initial={this.state.config.framerate}
                                onSelect={this.onChangeFramerate}
                            />
                        </View>
                        <View style={Styles.tile}>
                            <View style={Styles.durationViewer}>
                                <View style={[Styles.durationViewerInner, Styles.durationViewerInnerCentered]}>
                                    <Text style={Styles.durationText}>{this.state.duration}s</Text>
                                    <Text style={Styles.paragraphWhite}>Your footage will be {this.state.duration}s long with {this.framerates[this.state.config.framerate]} fps.</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={Styles.hr} />

                    {/* Output type (?) */}
                    <View>
                        <Text style={Styles.header2}>Output settings</Text>
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
                            buttons={["OKAY", "MID", "HIGH"]}
                            onChange={ComposerConfig.setQuality}
                        />
                    </View>

                    <View style={Styles.hr} />

                    {/* Generate video */}
                    <View>
                        <Text style={Styles.paragraph}>Generates the video</Text>
                        <Button
                            onPress={() => {}}
                            active={true}
                            color="green"
                            text="Generate  🎥"
                        />
                    </View>
                    </MultiAnimator>
                </KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Composer {...props} navigation={navigation} />;
}
