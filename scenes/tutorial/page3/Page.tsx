/* Imports */
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import Styles from "../Styles";
import PageStyles from "./PageStyles";
import { CalibratedOverlay } from "../../camera/CalibratedOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";

const W = Dimensions.get("window").width;
const CALIBRATION: any = {
    "leftEyePosition":{"x": W/2 - 50,"y": 357},
    "rightEyePosition":{"x":W/2 + 50,"y":354},
    "leftMouthPosition":{"x":W/2 - 43,"y":458},
    "rightMouthPosition":{"x":W/2 + 43,"y":453},
};

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
                        <Text style={Styles.header2}>← Aligning →</Text>
                        <Text style={Styles.infoText}>
                            Try your best to align your face to the two calibrated indicators.
                            Eyes go in each end of the upper line, and the mouth is placed beneath the lower line.
                        </Text>
                    </View>

                    <View style={PageStyles.faceContainer}>
                        {/* <Image style={PageStyles.face} source={require("./assets/face.png")} /> */}
                    </View>
                </View>
                <View style={Styles.pageFooter}>
                </View>
                <CalibratedOverlay color="#000" calibrated={CALIBRATION} />
            </View>
		);
	}
}
