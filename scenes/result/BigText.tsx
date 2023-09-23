import React, { RefObject } from "react";
import { Animated, Easing, Text } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { AV, WIDTH } from "./Result";

interface State {
    pos: Animated.ValueXY,
    fontSizeFactorIndex: number
}
interface Props {
    prev: number,
    curr: number,

    translateX: Animated.Value,
    fontSizeFactor: Animated.Value,
}

/// This class displays a big number (ex 5) and
/// makes a smooth transition into 6 (next number)
/// to show that another photo has been "secured".
export class BigText extends React.PureComponent<Props, State> {
    fontSizeFactors: number[];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            pos: new Animated.ValueXY(),
            fontSizeFactorIndex: 0
        };

        this.fontSizeFactors = [1, 0.9, 0.7, 0.6];
        /* Bindings */

    };

    /* Lifetime */
    componentDidUpdate(): void {
        this.setState({ fontSizeFactorIndex: this.props.curr.toString().length - 1 });

        Animated.timing(this.state.pos, {
            useNativeDriver: true,
            toValue: { x: 50, y: -250 },
            duration: 500,
            easing: Easing.inOut(Easing.exp),
            delay: 1000
        }).start();
    }

    render() {
        const fontSize = {
            fontSize:
                Styles.numberText.fontSize *
                this.fontSizeFactors[this.state.fontSizeFactorIndex]
        };

        return (
            <Animated.View style={[
                Styles.numberTextContainer,
                {
                    transform: [
                        { scale: this.props.fontSizeFactor },
                        { translateX: this.props.translateX }
                    ]
                }
            ]}>
                <Animated.View style={[Styles.textTransitioner, { transform: this.state.pos.getTranslateTransform() }]}>
                    <Text style={[Styles.numberText, fontSize]}>{this.props.prev}</Text>
                    <Text style={[Styles.numberText, Styles.skewed, fontSize]}>{this.props.curr}</Text>
                </Animated.View>
            </Animated.View>
        );
    }
}
