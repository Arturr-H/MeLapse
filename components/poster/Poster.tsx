
/* Imports */
import { Animated, PanResponder, Dimensions, Easing, GestureResponderEvent, ImageSourcePropType, PanResponderInstance } from "react-native";
import React from "react";
import Styles from "./Styles";
import MaskedView from "@react-native-masked-view/masked-view";
import * as Haptics from "expo-haptics";
import PosterRip from "./PosterRip";
import { PosterInner } from "./PosterInner";

/* Constants */
const CENTER_POSTER = -(254*2 - 12) / 4;
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

/* Interfaces */
export interface Props {
    source: ImageSourcePropType,
    date?: number,

    skipPan?: boolean,
    skipIntro?: boolean,
}
interface State {
    /// To explain this, ill need a few lines.
    /// The poster item (without the red pin) is stored
    /// inside a view, which uses the `transform` field
    /// shown below. It also has a wrapper which contains
    /// the poster AND the red pin. We want the red pin
    /// to follow the paper in the intro but not when we 
    /// use the panResponder to drag the poster up/down 
    /// because the pin needs to be static so that the 
    /// poster ripping effect can take place.
    ///
    /// That's why there's a second transform called
    /// `introTransform`. (moves pin and poster).
    transform: Animated.ValueXY,
    introTransform: Animated.ValueXY,

    /// Dangle rotation animation for intro
    rotation: Animated.Value,

    /// Paper ripped in half animation values
    ripOpacity: Animated.Value,
    leftRip: {
        rotation: Animated.Value
        x: Animated.Value
    },
    rightRip: {
        rotation: Animated.Value
        x: Animated.Value
    },

    /// Pin animation (for making it look like the
    /// pin is above the wall or on the wall)
    pinPos: Animated.ValueXY,
    pinShadowPos: Animated.ValueXY,
}

/* Main */
export default class Poster extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            ripOpacity: new Animated.Value(1),
            transform: new Animated.ValueXY({ x: 0, y: 0 }),
            
            pinPos: new Animated.ValueXY({ x: 6, y: -13 }),
            pinShadowPos: new Animated.ValueXY({ x: 0, y: 0 }),

            introTransform: new Animated.ValueXY({ x: -WIDTH/2, y: -HEIGHT/2 }),
            rotation: new Animated.Value(this.props.skipIntro !== true ? 90 : 0),

            leftRip: {
                rotation: new Animated.Value(0),
                x: new Animated.Value(0)
            },
            rightRip: {
                rotation: new Animated.Value(0),
                x: new Animated.Value(0)
            },
        },

        /* Bindings */
        this.animateIntro = this.animateIntro.bind(this);
        this.delete = this.delete.bind(this);
        this.rotate = this.rotate.bind(this);
        this.save = this.save.bind(this);
    }

    /* Lifetime */
    componentDidMount(): void {
        setTimeout(() => {
            if (this.props.skipIntro !== true) this.animateIntro();
        }, 500);
    }

    /* Delete / save poster */
    delete(callback: () => void): void {
        let easing = Easing.in(Easing.ease);
        let duration = 750;
        Animated.timing(this.state.ripOpacity, { toValue: 0, duration, useNativeDriver: false, easing: Easing.in(Easing.exp) }).start();
        Animated.timing(this.state.transform, { toValue: { x: 0, y: -300 }, duration, useNativeDriver: false, easing }).start();
        
        easing = Easing.in(Easing.exp);
        duration = duration * 1.2;
        Animated.timing(this.state.leftRip.rotation, { toValue: -80, duration, useNativeDriver: false, easing }).start();
        Animated.timing(this.state.rightRip.rotation, { toValue: 80, duration, useNativeDriver: false, easing }).start();
        Animated.timing(this.state.leftRip.x, { toValue: -105, duration, useNativeDriver: false, easing }).start();
        Animated.timing(this.state.rightRip.x, { toValue: 105, duration, useNativeDriver: false, easing }).start(callback);
    }
    save(callback: () => void): void {
        Animated.timing(this.state.introTransform.x, {
            toValue: WIDTH,
            duration: 800,
            useNativeDriver: false,
            easing: Easing.bezier(.23,.69,.48,.88)
        }).start();
        Animated.timing(this.state.introTransform.y, {
            toValue: -HEIGHT,
            duration: 800,
            useNativeDriver: false,
            easing: Easing.bezier(.58,.25,.83,.47)
        }).start(callback);
        Animated.timing(this.state.rotation, {
            toValue: 20,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.ease),
        }).start();
    }

    /* Used for external handling */
    rotate(toValue: number, duration: number, easing: (value: number) => number, delay?: number): void {
        let fn = Animated.timing(this.state.rotation, {
            toValue,
            duration,
            easing,
            useNativeDriver: true,
        }).start;

        if (typeof delay === "number") {
            setTimeout(fn, delay);
        }else { fn() };
    }

    /* Animate intro of poster (after snaping pic) */
    animateIntro(): void {
        const A = 500;
        const P = 1.583333;
        const D = 400; //larger this == finish x & y transform faster
        const DELAY_TRS = A*P + A - D;

        Animated.timing(this.state.introTransform.x, {
            toValue: 0,
            duration: DELAY_TRS,
            useNativeDriver: false,
            easing: Easing.bezier(.71,.11,.66,.98)
        }).start();
        Animated.timing(this.state.introTransform.y, {
            toValue: CENTER_POSTER,
            duration: DELAY_TRS,
            useNativeDriver: false,
            easing: Easing.bezier(0,.7,.3,1)
        }).start();

        Animated.sequence([
            Animated.timing(this.state.rotation, {
                toValue: 0,
                duration: A*P,
                useNativeDriver: false,
                easing: Easing.exp,
            }),
            Animated.timing(this.state.rotation, {
                toValue: -30,
                duration: A/6,
                useNativeDriver: false,
                easing: Easing.out(Easing.ease)
            }),
            Animated.timing(this.state.rotation, {
                toValue: 0,
                duration: A*P,
                useNativeDriver: false,
                easing: Easing.elastic(4)
            })
        ]).start();
    }

    /* Render */
	render() {
        let rotate = this.state.rotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"]
        });

        // Right rip rotate
        let rrrotate = this.state.rightRip.rotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"]
        });
        // Left rip rotate
        let lrrotate = this.state.leftRip.rotation.interpolate({
            inputRange: [0, 360],
            outputRange: ["0deg", "360deg"]
        });

		return (
            <Animated.View
                style={[
                    Styles.rotationWrapper,
                    this.props.skipIntro !== true && { transform: [
                        { translateX: this.state.introTransform.x },
                        { translateY: this.state.introTransform.y },
                    ]}
                ]}
            >
                {/* Pin (at the top of the poster) */}
                <Animated.Image
                    alt="Pin"
                    source={require("../../assets/images/pin.png")}
                    style={[
                        Styles.pin,
                        {
                            transform: this.state.pinPos.getTranslateTransform(),
                            opacity: this.state.ripOpacity,
                        },
                    ]}
                />

                <Animated.View
                    style={[
                        Styles.posterWrapper,
                        this.props.skipIntro !== true ? { transform: [
                            { rotate },
                            { translateX: this.state.transform.x },
                            { translateY: this.state.transform.y }
                        ]} : { transform: [{ rotate }] }
                    ]}
                >
                    {
                        this.props.skipPan
                        ?
                            <PosterInner {...this.props} />
                        : <>
                            <PosterRip pos="left" {...this.props} opacity={this.state.ripOpacity} rotate={lrrotate} x={this.state.leftRip.x}  />
                            <PosterRip pos="right" {...this.props} opacity={this.state.ripOpacity} rotate={rrrotate} x={this.state.rightRip.x}  />
                        </>
                    }
                </Animated.View>
            </Animated.View>
		);
	}
}
