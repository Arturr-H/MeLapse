/* Imports */
import React from "react";
import { Animated, Dimensions, PanResponder, PanResponderInstance, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { Colors } from "../../styleBundles/Colors";

const WIDTH = Dimensions.get("window").width;

/* Interfaces */
interface Props {
    /** `number`: value between 0 and 1 */
    onChange?: (idx: number) => void,

    /** Index of which button is initially activated (0-1) */
    initial?: number
}
interface State {
    number: number,
    scaleX: Animated.Value,
    progressInnerWidth?: number
    progressInnerHeight?: number
}

/** The input */
export default class SliderInput extends React.PureComponent<Props, State> {
    panResponder: PanResponderInstance;
    num: number = 0.1;

    constructor(props: Props) {
        super(props);

        this.state = {
            number: this.props.initial ?? 0,
            scaleX: new Animated.Value(this.props.initial ?? 0),
        }

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (e) => {
                const WIDTH_WINDOW = (WIDTH / 1.4);
                const WIDTH_WINDOW_REMOVAL = WIDTH - WIDTH_WINDOW;
                const VALUE = ((e.nativeEvent.pageX) / WIDTH_WINDOW) - (WIDTH_WINDOW_REMOVAL / WIDTH) / 2;
                const CLAMPED = Math.max(Math.min(VALUE, 1), 0);

                this.num = CLAMPED;
                this.setState({ number: CLAMPED })
                Animated.timing(this.state.scaleX, { toValue: CLAMPED, useNativeDriver: true, duration: 0 }).start();
            },
            onPanResponderRelease: () => {
                this.props.onChange && this.props.onChange(this.num);
            },
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.initial !== this.props.initial) {
            const init = this.props.initial ?? 0;
            this.setState({ number: init, scaleX: new Animated.Value(init) });
        }
    }

    render(): React.ReactNode {
        const width = this.state.progressInnerWidth ?? 0;
        const height = 30;
        const inner = ((width - height*1.55)) + height;
        const half = inner/2;
        const scaleX = this.state.scaleX;

        return (
            <View style={Styles.inputWrapper}>
                <View style={Styles.sliderInput} {...this.panResponder.panHandlers}>
                    <View style={Styles.sliderInputFillWrapper}>
                        <Animated.View
                            onLayout={(e) => this.setState({
                                progressInnerWidth: e.nativeEvent.layout.width,
                                progressInnerHeight: e.nativeEvent.layout.height
                            })}
                            style={[
                                Styles.sliderInputFill,
                                { transform: [
                                    { translateX: Animated.subtract(
                                        Animated.multiply(
                                            scaleX, half * 2
                                        ),
                                        inner + height/3
                                    ) },
                                ] },
                                width ? { width } : {}
                            ]}
                        >
                            <View style={Styles.sliderInputIndicator}></View>
                        </Animated.View>
                    </View>

                </View>
                <View style={Styles.valueContainer}>
                    <Text style={Styles.valueText}>{Math.round(this.state.number*100)}%</Text>
                </View>
            </View>
        )
    }
}
