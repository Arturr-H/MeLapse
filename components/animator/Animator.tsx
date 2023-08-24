import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, Image, TouchableOpacity, View, ViewStyle } from "react-native";

/* Interfaces */
interface Props {
    children: JSX.Element[] | JSX.Element,

    startOpacity?: number,
    startX?: number,
    startY?: number,

    style?: ViewStyle
}
interface State {
    translateX: Animated.Value,
    translateY: Animated.Value,
    rotation: Animated.Value,
    opacity: Animated.Value,
}

/* Aliases */
const AN = Animated.timing;

export class Animator extends React.PureComponent<Props, State> {
    config: any;
    animations: Animated.CompositeAnimation[];
    animation: Animated.CompositeAnimation | null;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            translateX: new Animated.Value(this.props.startX ?? 0),
            translateY: new Animated.Value(this.props.startY ?? 0),
            rotation: new Animated.Value(0),
            opacity: new Animated.Value(this.props.startOpacity ?? 1),
		};

        this.config = { duration: 1000, useNativeDriver: false, easing: Easing.inOut(Easing.ease) };

		/* Bindings */
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        this.start = this.start.bind(this);
        this.wait = this.wait.bind(this);
        this.exec = this.exec.bind(this);
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
        this.up = this.up.bind(this);
        this.down = this.down.bind(this);

        /* Animations */
        this.animations = [];
        this.animation = null;
	}

    componentDidMount(): void {}

    /* Fade */
    fadeOut(duration?: number): this {
        this.animations.push(AN(this.state.opacity, { toValue: 0, ...this.config, duration }));
        return this
    }
    fadeIn(duration?: number): this {
        this.animations.push(AN(this.state.opacity, { toValue: 1, ...this.config, duration }));
        return this
    }

    /* Move */
    right(toValue: number, duration?: number): this {
        this.animations.push(AN(this.state.translateX, { toValue, ...this.config, duration }));
        return this
    }
    left(toValue: number, duration?: number): this {
        toValue = -toValue;
        this.animations.push(AN(this.state.translateX, { toValue, ...this.config, duration }));
        return this
    }
    down(toValue: number, duration?: number): this {
        this.animations.push(AN(this.state.translateY, { toValue, ...this.config, duration }));
        return this
    }
    up(toValue: number, duration?: number): this {
        toValue = -toValue;
        this.animations.push(AN(this.state.translateY, { toValue, ...this.config, duration }));
        return this
    }

    /* Wait */
    wait(duration: number): this {
        this.animations.push(AN(new Animated.Value(0), { toValue: 0, duration, useNativeDriver: false }));
        return this
    }

    /* Execute multiple animation functions at the same time */
    exec(...args: ((duration?: number) => void)[]): void {
        let animations = [];
        for (let i = 0; i < args.length; i++) {
            const element = args[i];
            animations.push(element);

            element();
        }

        // Animated.parallel(animations).;
    }


    /* Start animation */
    start(): void {
        this.animation = Animated.sequence(this.animations);
        this.animation.start();
        this.animations = [];
    }

    componentWillUnmount(): void { this.animation?.reset() }

	render() {
        let rotate = this.state.rotation.interpolate({ inputRange: [-360, 360], outputRange: ["-360deg", "360deg"] });
		return (
			<Animated.View
                // pointerEvents={"none"}
                style={{
                    opacity: this.state.opacity,
                    transform: [
                        { rotate },
                        { translateX: this.state.translateX },
                        { translateY: this.state.translateY },
                    ],
                    ...this.props.style
                }}
            >
                {this.props.children}
			</Animated.View>
		);
	}
}
