/* Imports */
import React from "react";
import { Animated, Easing, Image, SafeAreaView, Text, View } from "react-native";
import Styles from "../Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import PageStyles from "./PageStyles";
import MaskedView from "@react-native-masked-view/masked-view";
import { WIDTH } from "../../result/Result";

/* Interfaces */
interface Props {  }
interface State {
}

export default class extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
        };

        /* Bindings */
    };

    /** Called externally from this component, 
     * triggered when scrollview reaches this item */
    setFocused(): void {
        console.log("Yea focus");
    }

    /* Lifetime */
    async componentDidMount(): Promise<void> {
    };

	render() {
		return (
            <View style={Styles.page}>
                <View style={Styles.pageHeader}>
                </View>
                <View style={Styles.pageBody}>
                    <View style={Styles.textContainer}>
                        <Text style={Styles.header2}>Taking selfies 📸</Text>
                        <Text style={Styles.infoText}>Strive to maintain consistent lighting in every selfie you take. As the shadows on your face increase, the final video quality may degrade and appear messy.</Text>
                    </View>
                    <View style={PageStyles.shadowHeadContainer}>
                        <Image style={PageStyles.face} source={require("./assets/shadow.png")} />
                        <Image style={PageStyles.face} source={require("./assets/no-shadow.png")} />
                    </View>
                </View>
                <View style={Styles.pageFooter}>
                </View>
            </View>
		);
	}
}
