/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import Config from "./Config";
import MultiAnimator from "../../components/animator/MultiAnimator";
import ScrollGradient from "../../components/scrollGradient/ScrollGradient";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Composer: undefined }, "Composer">,
}
export interface State {
    switching: boolean,
    loadingReset: boolean,

    widthOverride?: number,
    framerateOverride?: number,
    bitrate?: number,
}

class AdvancesComposer extends React.Component<Props, State> {
    animatorComponent: RefObject<MultiAnimator> = React.createRef();
    overrideBitrateInput: RefObject<TextInput> = React.createRef();
    widthOverride: RefObject<TextInput> = React.createRef();
    framerateOverride: RefObject<TextInput> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false,
            loadingReset: false,
        };

        /* Bindings */
        this.resetAdvancedConfig = this.resetAdvancedConfig.bind(this);
        this.onChangeBitrate = this.onChangeBitrate.bind(this);
        this.onChangeWidthOverride = this.onChangeWidthOverride.bind(this);
        this.goBack = this.goBack.bind(this);
        
        /* Refs */
    };

    async componentDidMount(): Promise<void> {
        this.fadeIn();
        this.props.navigation.addListener("focus", this.fadeIn);

        this.setState({
            bitrate: await Config.getBitrate() ?? undefined,
            widthOverride: await Config.getWidthOverride() ?? undefined,
            framerateOverride: await Config.getFramerateOverride() ?? undefined,
        })
    }
    componentWillUnmount(): void {
        this.props.navigation.removeListener("focus", this.fadeIn);
    }
    fadeIn = () => {
        this.animatorComponent.current?.fadeOut(0, 0, () => {
            this.animatorComponent.current?.fadeIn(200, 50);
        });
    }
    fadeOut = (callback?: () => void) => {
        this.animatorComponent.current?.fadeOut(200, 50, callback);
    }

    /* Scene switches */
    async goBack(): Promise<void> {
        this.fadeOut(() => 
            this.props.navigation.navigate("Composer")
        );
    }

    /** Bitrate override */
    async onChangeBitrate(input: string): Promise<void> {
        let num = parseFloat(input.replace(",", "."));
        if (!Number.isNaN(num)) {
            await Config.setBitrate(num);
        }else {
            await Config.setBitrate(null);
        };
    }

    /** Override width of output */
    async onChangeWidthOverride(width: null | string): Promise<void> {
        if (width !== null) {
            let num = parseInt(width);
            if (!Number.isNaN(num)) {
                await Config.setWidthOverride(num);
            }else {
                await Config.setWidthOverride(null);
            };
        }
    }

    /** Override FPS */
    async onChangeFramerateOverride(fps: null | string): Promise<void> {
        if (fps !== null) {
            let num = parseInt(fps);
            if (!Number.isNaN(num)) {
                if (num >= 1 && num <= 120) {
                    await Config.setFramerateOverride(num);
                }else {
                    await Config.setFramerateOverride(null);    
                }
            }else {
                await Config.setFramerateOverride(null);
            };
        }
    }

    /** Reset the advanced settings */
    async resetAdvancedConfig(): Promise<void> {
        this.setState({ loadingReset: true });
        this.overrideBitrateInput.current?.setState({ value: "" });
        this.widthOverride.current?.setState({ value: "" });
        this.framerateOverride.current?.setState({ value: "" });

        await Config.setBitrate(null);
        await Config.setWidthOverride(null);
        await Config.setFramerateOverride(null);

        this.setState({ loadingReset: false });
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView style={Styles.keyboardAvoidingView} behavior="padding">
                    <View style={{ width: "100%", flex: 1 }}>
                        <ScrollGradient />
                        <ScrollView contentContainerStyle={Styles.containerInner} showsVerticalScrollIndicator={false}>
                            <MultiAnimator ref={this.animatorComponent}>
                                <View><Text style={Styles.header}>🚧 Advanced Preferences</Text></View>

                                {/* Override bitrate */}
                                <View>
                                    <Text style={Styles.header2}>🎛️ Override bitrate</Text>
                                    <View><Text style={Styles.paragraph}>How many (maximum) bits per second to override default bitrate (which is controlled via quality in preferences)</Text></View>

                                    <TextInput
                                        placeholder="Bitrate (M)"
                                        active
                                        keyboardType="decimal-pad"
                                        maxChars={4}
                                        ref={this.overrideBitrateInput}
                                        initial={this.state.bitrate?.toString()}
                                        onChangeText={this.onChangeBitrate}
                                    />
                                </View>

                                {/* Override bitrate */}
                                <View>
                                    <Text style={Styles.header2}>📐 Override output size</Text>
                                    <View><Text style={Styles.paragraph}>Change width of image (height will scale proportionally keeping aspect ratio)</Text></View>

                                    <TextInput
                                        placeholder="Width (px)"
                                        active
                                        flex
                                        keyboardType="number-pad"
                                        maxChars={4}
                                        ref={this.widthOverride}
                                        initial={this.state.widthOverride?.toString()}
                                        onChangeText={(e) => this.onChangeWidthOverride(e)}
                                    />
                                </View>

                                {/* Override FPS */}
                                <View>
                                    <Text style={Styles.header2}>⏲️ Override framerate</Text>
                                    <View><Text style={Styles.paragraph}>Set frames per second from anywhere between 1 - 120</Text></View>

                                    <TextInput
                                        placeholder="Framerate"
                                        active
                                        flex
                                        keyboardType="number-pad"
                                        maxChars={3}
                                        ref={this.framerateOverride}
                                        initial={this.state.framerateOverride?.toString()}
                                        onChangeText={(e) => this.onChangeFramerateOverride(e)}
                                    />
                                </View>

                                <View style={Styles.hr} />

                                {/* Reset config */}
                                <View>
                                    <Text style={Styles.header2}>🚨 Danger zone</Text>
                                    <Text style={Styles.paragraph}>Reset only all ADVANCED settings to default</Text>
                                    <Button loading={this.state.loadingReset} color="red" active={!this.state.switching} onPress={this.resetAdvancedConfig} text="Reset advanced 🗑️" />
                                </View>
                            </MultiAnimator>
                        </ScrollView>
                    </View>
                    
                    {/* Confirm */}
                    <View style={{ transform: [{ translateY: -12 }] }}>
                        <Button color="blue" active={!this.state.switching} onPress={this.goBack} text="← Back" />
                    </View>
                </KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <AdvancesComposer {...props} navigation={navigation} />;
}
