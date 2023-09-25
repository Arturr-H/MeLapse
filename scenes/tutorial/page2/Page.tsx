/* Imports */
import React from "react";
import { Image, Text, View } from "react-native";
import Styles from "../Styles";
import PageStyles from "./PageStyles";

/* Interfaces */
interface Props {  }
interface State {  }

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
                        <Text style={Styles.header2}>Neutral face 🧑</Text>
                        <Text style={Styles.infoText}>Make an effort to maintain a neutral facial expression, avoiding actions like smiling or squinting your eyes.</Text>
                    </View>

                    <View style={PageStyles.faceContainer}>
                        <Image style={PageStyles.face} source={require("./assets/face.png")} />
                    </View>
                </View>
                <View style={Styles.pageFooter}>
                </View>
            </View>
		);
	}
}
