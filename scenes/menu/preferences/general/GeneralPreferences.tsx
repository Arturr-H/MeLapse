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
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { LSImage, saveImage } from "../../../../functional/Image";
import { NotificationOptions } from "../../../setup/HowOften";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{
        Preferences: undefined,
    }, "Preferences">,
}
export interface State {
    saveSelfiesToCameraRoll: boolean,
    importingSelfies: boolean,
}

class GeneralPreferences extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            saveSelfiesToCameraRoll: false,
            importingSelfies: false,
        };

        /* Bindings */
        this.importSelfies = this.importSelfies.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.setState({
            importingSelfies: false,
            saveSelfiesToCameraRoll: await AppConfig.getSaveSelfiesToCameraRoll(),
        });
    }

    /** Opens user media lib to select selfies to import */
    async importSelfies(): Promise<void> {
        this.setState({ importingSelfies: true });
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
            this.setState({ importingSelfies: false });
            alert("Selfies imported!")
        })
    }

    /* Scene switches */
    goTo = (scene: string) => this.props.navigation.navigate(scene as any);

	render() {
		return (
            <MenuTemplate title="⚙️ General" backButtonPress="Menu">
                {/* Taking selfies section */}
                <View style={[Styles.padded, { gap: 15 }]}>
                    <TitleH2 title="Taking selfies" />

                    {/* Cameraroll saving */}
                    <View>
                        <TitleH3 title="Cameraroll saving" info="Automatically save each selfie to your camera roll, may be useful for when you want to e.g export all of your images to other editing software (won't apply to previous selfies)" />
                        <SelectInput
                            buttons={["YES", "NO"]}
                            initial={this.state.saveSelfiesToCameraRoll ? 0 : 1}
                            onChange={(idx) => {
                                this.setState({ saveSelfiesToCameraRoll: idx == 0 ? true : false });
                                AppConfig.setSaveSelfiesToCameraRoll(idx == 0 ? true : false);
                            }}
                        />
                    </View>

                    {/* Import selfies */}
                    <View>
                        <TitleH3 title="Import selfies" info="Import past selfies from your camera roll. Face alignments won't be applied ⚠️, )" />
                        <Button
                            color="blue"
                            active
                            onPress={this.importSelfies}
                            text="Import selfies"
                            loading={this.state.importingSelfies}
                        />
                    </View>
                </View>

                <View style={[Styles.hr, Styles.hrPadded]} />

                {/* Notifications */}
                <View style={[Styles.padded, { gap: 15 }]}>
                    <TitleH2 title="Notifications" />

                    {/* Cameraroll saving */}
                    <View>
                        <TitleH3 title="Notifications per day" info="How many notifications would you like to recieve per day?" />
                        <NotificationOptions />
                    </View>
                </View>
            </MenuTemplate>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <GeneralPreferences {...props} navigation={navigation} />;
}
