import React, { RefObject } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Styles from "./Styles";
import { Animator } from "../../components/animator/Animator";

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
export class BigText extends React.PureComponent<Props, State> {
    fontSizeFactors: number[];
    animator: RefObject<Animator> = React.createRef();
    photosTextAnimator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            pos: new Animated.ValueXY(),
            fontSizeFactorIndex: 0,
            visible: false
        };

        this.fontSizeFactors = [1, 0.9, 0.7, 0.5];

        /* Bindings */
        this.animate = this.animate.bind(this);
    };

    /** Called externally */
    animate(): void {
        this.setState({ fontSizeFactorIndex: this.props.curr.toString().length - 1 });
        this.animator.current?.fadeIn(200).start();
        this.photosTextAnimator.current?.fadeIn(200).start();
        Animated.timing(this.state.pos, {
            useNativeDriver: true,
            toValue: { x: 50, y: -250 },
            duration: 500,
            delay: 800,
            easing: Easing.inOut(Easing.exp),
        }).start();
    }

    render() {
        const fontSize = {
            fontSize:
                Styles.numberText.fontSize *
                this.fontSizeFactors[this.state.fontSizeFactorIndex]
        };

        return (
            <React.Fragment>
                <Animator ref={this.photosTextAnimator} startOpacity={0} style={Styles.photoTextContainer}><Text numberOfLines={1} style={Styles.photoText}>PHOTOS</Text></Animator>
                <Animator ref={this.animator} startOpacity={0} style={Styles.numberTextContainer}>
                    <Animated.View style={[Styles.textTransitioner, { transform: this.state.pos.getTranslateTransform() }]}>
                        <Text style={[Styles.numberText, fontSize]}>{this.props.prev}</Text>
                        <Text style={[Styles.numberText, Styles.skewed, fontSize]}>{this.props.curr}</Text>
                    </Animated.View>
                </Animator>
            </React.Fragment>
        );
    }
}