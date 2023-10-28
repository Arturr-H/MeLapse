/* Imports */
import React, { RefObject } from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import Config from "./Config";
import MenuTemplate from "../../styleBundles/template/MenuTemplate";
import { TitleH2, TitleH3 } from "../../components/text/Title";

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
        this.setState({
            bitrate: await Config.getBitrate() ?? undefined,
            widthOverride: await Config.getWidthOverride() ?? undefined,
            framerateOverride: await Config.getFramerateOverride() ?? undefined,
        })
    }

    /* Scene switches */
    async goBack(): Promise<void> {
        this.props.navigation.navigate("Composer")
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
            <MenuTemplate backButtonPress={"Composer"} title="🚧 Advanced">

                {/* Override bitrate */}
                <View style={Styles.padded}>
                    <TitleH2 title="Overwrites" />
                    <TitleH3 title="Bitrate" info="How many (maximum) bits per second to override default bitrate (which is controlled via quality in composer)" />

                    <TextInput
                        placeholder="Bitrate (M)"
                        active
                        keyboardType="decimal-pad"
                        maxChars={32}
                        ref={this.overrideBitrateInput}
                        initial={this.state.bitrate?.toString()}
                        onChangeText={this.onChangeBitrate}
                    />
                </View>

                {/* Override bitrate */}
                <View style={Styles.padded}>
                    <TitleH3 title="Output size" info="Change width of image (height will scale proportionally keeping aspect ratio)" />

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
                <View style={Styles.padded}>
                    <TitleH3 title="Framerate" info="Set frames per second from anywhere between 1 - 120" />

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
            </MenuTemplate>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <AdvancesComposer {...props} navigation={navigation} />;
}
