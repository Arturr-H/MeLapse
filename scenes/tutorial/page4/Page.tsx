/* Imports */
import React, { RefObject } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Styles from "../Styles";
import { Animator } from "../../../components/animator/Animator";
import PageStyles from "./PageStyles";
import { BANNER_UNIT_ID, REWARDED_UNIT_ID } from "../../../components/advertising/Util";

/* Interfaces */
interface Props {}
interface State {
    rotation: Animated.Value
}

export default class extends React.PureComponent<Props, State> {
    animator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            rotation: new Animated.Value(0),
        };
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        Animated.loop(Animated.timing(this.state.rotation, {
            toValue: 360, 
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
        })).start();
    };

	render() {
        let rotation = { transform: [{ rotate: this.state.rotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"]
        }) }] };

		return (
            <Animator ref={this.animator} style={Styles.page}>
                <View style={Styles.pageHeader}>
                </View>
                <View style={Styles.pageBody}>
                    <View style={Styles.textContainer}>
                        <Text style={Styles.header2}>Face rotation 🌀</Text>
                        <Text style={Styles.infoText}>Keep your face pointing straight at the camera. The arrow in the bottom left corner guides you on what direction you should point your face to.</Text>
                    </View>

                    <View style={PageStyles.arrowContainer}>
                        <Animated.Image
                            source={require("../../../assets/images/align/arrow.png")}
                            style={[PageStyles.arrow, rotation]}
                        />
                    </View>
                </View>
                <View style={Styles.pageFooter}>
                </View>
            </Animator>
		);
	}
}
