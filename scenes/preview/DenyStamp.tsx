/* Imports */
import React, { RefObject } from "react";
import Styles from "./Styles";
import { Animated, Dimensions, Easing, Image, View } from "react-native";
import { Animator } from "../../components/animator/Animator";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

/* Interfaces */
interface Props {
}
interface State {
    stampRotate: Animated.Value,

    stampTranslateX: Animated.Value,
    stampTranslateY: Animated.Value,

    stamperTranslateX: Animated.Value,
    stamperTranslateY: Animated.Value,

    stampScale: Animated.Value,
    stampMarkOpacity: Animated.Value,
}

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class DenyStamp extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            stampRotate: new Animated.Value(0),
            stampTranslateX: new Animated.Value(-WIDTH),
            stamperTranslateX: new Animated.Value(0),
            stamperTranslateY: new Animated.Value(0),
            stampTranslateY: new Animated.Value(-HEIGHT),
            stampScale: new Animated.Value(1),
            stampMarkOpacity: new Animated.Value(0),
        };

        /* Bindings */
        this.intro = this.intro.bind(this);
    };

    /** Interpolate value to deg string */
    interp(v: Animated.Value): Animated.AnimatedInterpolation<string> {
        return v.interpolate({
            inputRange: [-360, 360],
            outputRange: ["-360deg", "360deg"],
        })
    }

    /** Animate intro */
    intro(hidePosterCallback: () => void, callback: () => void): void {
        let common: any;

        /* Move to center */
        common = { useNativeDriver: true, duration: 1000, easing: Easing.inOut(Easing.exp) };
        Animated.timing(this.state.stampRotate, { toValue: -65, ...common, duration: 801, easing: Easing.out(Easing.ease), delay: 100 }).start();
        Animated.timing(this.state.stampTranslateX, { toValue: 0, ...common }).start();
        Animated.timing(this.state.stampTranslateY, { toValue: 0, ...common }).start();

        /* Stamp down then up and show stamp mark */
        common = { useNativeDriver: true, duration: 200, easing: Easing.inOut(Easing.exp) };
        setTimeout(() => impactAsync(ImpactFeedbackStyle.Medium), 1200);
        Animated.timing(this.state.stampScale, { toValue: 0.9, ...common, delay: 1000 }).start(() => {
            setTimeout(() => impactAsync(ImpactFeedbackStyle.Medium), 200);
            Animated.timing(this.state.stampScale, { toValue: 1, ...common, duration: 100 }).start();
            Animated.timing(this.state.stampMarkOpacity, { toValue: 1, duration: 0, useNativeDriver: true }).start();
            setTimeout(() => {
                hidePosterCallback();
                Animated.timing(this.state.stampMarkOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start();
            }, 800);
        });
        

        /* Move away stamper */
        common = { useNativeDriver: true, duration: 1000, easing: Easing.inOut(Easing.exp) };
        Animated.timing(this.state.stamperTranslateX, { toValue: WIDTH*2, ...common, delay: 1500 }).start();
        Animated.timing(this.state.stamperTranslateY, { toValue: HEIGHT*6, ...common, delay: 1500 }).start(callback);
    }

    render() {
        let transform = [
            { translateX: this.state.stampTranslateX },
            { translateY: this.state.stampTranslateY },
            { rotate: this.interp(this.state.stampRotate) },
            { scale: this.state.stampScale }
        ];

		return (
            <Animated.View style={[Styles.denyStampContainer, { transform }]}>
                {/* Deny mark */}
                <Animated.Image
                    style={[Styles.deniedMarkImage, { opacity: this.state.stampMarkOpacity }]}
                    source={require("../../assets/images/denied/denied.png")}
                />

                {/* Deny stamper */}
                <Animated.Image
                    style={[Styles.deniedStampImage, { transform: [
                        { translateX: this.state.stamperTranslateX },
                        { translateY: this.state.stamperTranslateY },
                    ]}]}
                    source={require("../../assets/images/denied/denied-stamp.png")}
                />
            </Animated.View>
		);
	}
}
