import React, { RefObject } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Styles from "./Styles";
import { Animator } from "../../components/animator/Animator";
import { BlurView } from "expo-blur";

interface State {
    pos: Animated.ValueXY,
    fontSizeFactorIndex: number,
    visible: boolean
}
interface Props {
    prev: number,
    curr: number,
}

/// This class displays a big number (ex 5) and
/// makes a smooth transition into 6 (next number)
/// to show that another photo has been "secured".
export class StreakOverlay extends React.PureComponent<Props, State> {
    fontSizeFactors: number[];
    animator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            pos: new Animated.ValueXY(),
            fontSizeFactorIndex: 0,
            visible: false
        };

        this.fontSizeFactors = [1, 0.9, 0.7, 0.5, 0.4, 0.37, 0.35, 0.32, 0.3, 0.3];

        /* Bindings */
        this.animate = this.animate.bind(this);
    };

    /** Called externally */
    animate(callback?: () => void): void {
        this.setState({ fontSizeFactorIndex: this.props.curr.toString().length - 1 });
        this.animator.current?.fadeIn(200).start();
        Animated.timing(this.state.pos, {
            useNativeDriver: true,
            toValue: { x: 50, y: -250 },
            duration: 500,
            delay: 800,
            easing: Easing.inOut(Easing.exp),
        }).start(() => {
            setTimeout(() => {
                this.animator.current?.fadeOut(200).start(callback);
            }, 600);
        });
    }

    render() {
        const fontSize = {
            fontSize:
                Styles.numberText.fontSize *
                this.fontSizeFactors[this.state.fontSizeFactorIndex]
        };

        return (
            <Animator
                pointerEvents={"none"}
                style={{ ...Styles.absolute, height: "100%", zIndex: -1 }}
                ref={this.animator}
                startOpacity={0}
            >
                {/* Fire emoji background */}
                <View style={Styles.fireTextContainer}>
                    <Text style={[Styles.fireText, fontSize]}>🔥</Text>
                    <BlurView style={Styles.blurView} intensity={10} />
                </View>

                {/* Number increase */}
                <View style={Styles.numberTextContainer}>
                    <Animated.View style={[Styles.textTransitioner, { transform: this.state.pos.getTranslateTransform() }]}>
                        <Text style={[Styles.numberText, fontSize]}>{this.props.prev}</Text>
                        <Text style={[Styles.numberText, Styles.skewed, fontSize]}>{this.props.curr}</Text>
                    </Animated.View>
                </View>

                <Text style={Styles.newStreakText}>New streak!</Text>
            </Animator>
        );
    }
}