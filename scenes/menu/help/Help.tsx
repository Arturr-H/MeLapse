/* Imports */
import React, { RefObject } from "react";
import { Linking, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import MenuTemplate from "../../../styleBundles/template/MenuTemplate";
import SelectInput from "../../../components/selectInput/SelectInput";
import { TitleH2, TitleH3 } from "../../../components/text/Title";
import { Button } from "../../../components/button/Button";
import { NotificationOptions } from "../../setup/HowOften";
import AppConfig from "../Config";
import { ModalConstructor } from "../../../components/modal/ModalConstructor";

/* Interfaces */
export interface Props {
    navigation: any,
}
export interface State {
    personalizedAds: boolean,
}

class Help extends React.Component<Props, State> {
    modalConstructor: RefObject<ModalConstructor> = React.createRef();
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            personalizedAds: false,
        };

        /* Bindings */
        this.warnAboutRestartingApp = this.warnAboutRestartingApp.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.setState({
            personalizedAds: await AppConfig.getPersonalizedAds(),
        });
    }

    /** When settings personalized ads to enabled */
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

    /* Scene switches */
    goTo = (scene: string) => this.props.navigation.navigate(scene as any);

	render() {
		return (
            <React.Fragment>
            <ModalConstructor ref={this.modalConstructor} />
            <MenuTemplate title="🛟 Help" backButtonPress="Menu">
                {/* Advertisements section */}
                <View style={[Styles.padded, { gap: 15 }]}>
                    <TitleH2 title="General" />

                    {/* Cameraroll saving */}
                    <View>
                        <TitleH3 title="Personalized ads" info="Allow Google Ads to display ads which may appear more relevant to you. Switching this option requires a restart." />
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

                    {/* Cameraroll saving */}
                    <View>
                        <TitleH3 title="Privacy policy" info="Opens MeLapse's privacy policy (link)" />
                        <Button
                            active
                            text="Open"
                            onPress={() => {
                                Linking.openURL("https://arturr-h.github.io/MeLapse-Pages/index.html");
                            }}
                        />
                    </View>
                </View>
            </MenuTemplate>
            </React.Fragment>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Help {...props} navigation={navigation} />;
}
