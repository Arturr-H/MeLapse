/* Imports */
import React from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import MenuTemplate from "../../../../styleBundles/template/MenuTemplate";
import SelectInput from "../../../../components/selectInput/SelectInput";
import SliderInput from "../../../../components/sliderInput/SliderInput";
import { OnionSkin } from "../../../camera/onionSkin/OnionSkin";
import { TitleCentered, TitleH1, TitleH2, TitleH3 } from "../../../../components/text/Title";
import AppConfig from "../../Config";
import { Button } from "../../../../components/button/Button";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Preferences: undefined,
    }, "Preferences">,
}
export interface State {
    alwaysUseLatestSelfie: boolean,
    onionSkinVisible: boolean,
    onionSkinOpacity: number,
    transformCamera: boolean,
    cameraDirectionFront: boolean
}

class CameraPreferences extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            onionSkinVisible: false,
            alwaysUseLatestSelfie: false,
            onionSkinOpacity: 0.45,
            transformCamera: true,
            cameraDirectionFront: false
        };

        /* Bindings */
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.setState({
            transformCamera: await AppConfig.getTransformCamera(),
            cameraDirectionFront: await AppConfig.getCameraDirectionFront(),
            
            onionSkinVisible: await OnionSkin.getOnionSkinVisibility(),
            onionSkinOpacity: await OnionSkin.getOnionSkinOpacity(),
            alwaysUseLatestSelfie: await OnionSkin.getAlwaysUseLatestSelfie(),
        });
    }

    /* Scene switches */
    goTo = (scene: string) => this.props.navigation.navigate(scene as any);

	render() {
		return (
            <MenuTemplate title="⚙️ Camera" backButtonPress="Menu">
                <View style={[Styles.padded, { gap: 15 }]}>
                    {/* LIVE TRANSFORM */}
                    <View>
                    <TitleH2 title="General" />
                    <TitleH3 title="Live-transform camera" info="Transform the camera to the center in camera view. Only visual - transformations will be applied nonetheless." />
                    <SelectInput
                        buttons={["TRANSFORM", "STATIC"]}
                        initial={this.state.transformCamera ? 0 : 1}
                        onChange={(idx) => {
                            const condition = idx == 0 ? true : false;
                            this.setState({ transformCamera: condition });
                            AppConfig.setTransformCamera(condition);
                        }}
                    />

                    {/* CAMERA MODE */}
                    </View>
                    <View>
                    <TitleH3 title="Camera direction" info="Front camera is the one you use to take selfies, and the back camera is the one on the back of your phone." />
                    <SelectInput
                        buttons={["FRONT", "BACK"]}
                        initial={this.state.cameraDirectionFront ? 0 : 1}
                        onChange={(idx) => {
                            const condition = idx == 0 ? true : false;
                            this.setState({ cameraDirectionFront: condition });
                            AppConfig.setCameraDirectionFront(condition);
                        }}
                    />
                    </View>
                </View>

                <View style={[Styles.hr, Styles.hrPadded]}/>

                {/* Onionskin */}
                <View style={[Styles.padded, { gap: 15 }]}>

                    <View>
                    <TitleH2 title="Selfie overlay" />
                    <TitleH3 title="Enabled" info="Have a thin layer above the camera scene of a past selfie to help you align your face better." />
                    <SelectInput
                        buttons={["ENABLED", "DISABLED"]}
                        initial={this.state.onionSkinVisible ? 0 : 1}
                        onChange={(idx) => {
                            this.setState({ onionSkinVisible: idx == 0 ? true : false });
                            OnionSkin.setOnionSkinVisibility(idx == 0 ? true : false);
                        }}
                    />
                    </View>

                    <View>
                    <TitleH3 title="Use latest selfie" info="Automatically use the latest selfie you've captured as the overlay image. If you select custom, you can choose which one of your selfies you'd like to use as an overlay in the review images section (Menu > review)" />
                    <SelectInput
                        buttons={["LATEST", "CUSTOM"]}
                        initial={this.state.alwaysUseLatestSelfie ? 0 : 1}
                        onChange={(idx) => {
                            this.setState({ alwaysUseLatestSelfie: idx == 0 ? true : false });
                            OnionSkin.setAlwaysUseLatestSelfie(idx == 0 ? true : false);
                        }}
                    />
                    </View>

                    <View>
                    <TitleH3 title="Opacity" info="How transparent the overlay image will be. Higher opacity makes it more visible." />
                    <SliderInput
                        onChange={(nr) => {
                            this.setState({ onionSkinOpacity: nr });
                            OnionSkin.setOnionSkinOpacity(nr);
                        }}
                        initial={this.state.onionSkinOpacity}
                    />
                    </View>
                </View>
            </MenuTemplate>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <CameraPreferences {...props} navigation={navigation} />;
}
