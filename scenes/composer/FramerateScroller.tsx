/* Imports */
import React, { RefObject } from "react";
import { Animated, GestureResponderEvent, KeyboardAvoidingView, PanResponder, PanResponderInstance, SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

/* Types */
type FrameAnimation = { scale: Animated.Value, opacity: Animated.Value };

/* Interfaces */
interface Props {
    framerates: number[],
    onSelect: (index: number) => void,
    initial: number,

    /** If framerate is overwritten in advanced settings */
    overwritten?: boolean
}
interface State {
    pan: Animated.ValueXY,
    active: number,

    frameAnimations: FrameAnimation[]
}

export default class FramerateScroller extends React.Component<Props, State> {
    panResponder: PanResponderInstance;
    framerates: number[];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            pan: new Animated.ValueXY(),
            active: 1,

            frameAnimations: [0,0,0].map(_ => ({
                opacity: new Animated.Value(1),
                scale: new Animated.Value(1)
            }))
        };

        this.framerates = this.props.framerates;

        /* Bindings */
        this.onSelect = this.onSelect.bind(this);
        this.activateFrameAnimation = this.activateFrameAnimation.bind(this);

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                /* @ts-ignore */
                this.state.pan.setOffset({ x: Math.max(Math.min(this.state.pan.x._value, 120), -120), y: 0 });
                this.state.pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: this.state.pan.x }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: () => {
                this.state.pan.flattenOffset();
                /* @ts-ignore */
                const x = this.state.pan.x._value;

                if (x < -40)       this.onSelect(2, true);
                else if (x > 40) this.onSelect(0, true);
                else              this.onSelect(1, true);
            },
        });
    };

    /* Lifetime */
    componentDidMount(): void {
        this.onSelect(this.props.initial, false);
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.initial !== this.props.initial) {
            this.onSelect(this.props.initial, false);
        }
    }

    /* On select framerate */
    onSelect(index: number, doCallback: boolean): void {
        this.activateFrameAnimation(index);
        impactAsync(ImpactFeedbackStyle.Medium);

        /* Animate position of numbers */
        let toValue = { x: 0, y: 0 };
        if (index === 0) toValue.x = 80;
        else if (index == 2) toValue.x = -80;
        
        Animated.spring(this.state.pan, { speed: 100, toValue, useNativeDriver: false }).start();

        if (doCallback === true) this.props.onSelect(index);
        this.setState({ active: index });
    }

    /* Animate frame to active */
    activateFrameAnimation(index: number): void {
        for (let i = 0; i < 3; i++) {
            const toValue = i === index ? 1 : 0.7;
            this.animate(this.state.frameAnimations[i].opacity, toValue);
            this.animate(this.state.frameAnimations[i].scale, toValue);
        }
    }

    /* Convenience method */
    animate = (e: Animated.Value, toValue: number) => Animated.timing(e, {
        duration: 100,
        toValue,
        useNativeDriver: false,
    }).start();

    render() {
        if (this.props.overwritten !== true) return (
            <View style={Styles.framerateScrollerWrapper} {...this.panResponder.panHandlers}>
                <Animated.View style={[Styles.framerateScroller, { transform: [{ translateX: this.state.pan.x }] }]}>
                    {this.framerates.map((e, index) => <View key={"framrateselect-" + e} style={Styles.framerateSelectionContainer}>
                        <Animated.Text
                            style={[Styles.framerateSelectionText, {
                                opacity: this.state.frameAnimations[index].opacity,
                                transform: [{ scale: this.state.frameAnimations[index].scale }]
                            }]}
                        >{e}</Animated.Text>
                    </View>)}
                </Animated.View>

                <View style={Styles.framerateViewDotWrapper}>
                    {[0,1,2].map(e => <View key={"nrfm" + e} style={[Styles.framerateViewDot, this.state.active === e && Styles.framerateViewDotActive]} />)}
                </View>
            </View>
		)
        else return (
            <View style={[Styles.framerateScrollerWrapper, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={Styles.paragraphWhite}>Framerate Overwritten {"\n"} (advanced)</Text>
            </View>
        )
	}
}

