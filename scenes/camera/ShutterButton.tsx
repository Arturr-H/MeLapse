import React from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
	active: boolean,
	takePic: () => void,
}
interface State {
	/** Inner size */
	size: Animated.Value,

	/** Needed for scaling into transition */
	cameraButtonScale: Animated.Value,
	cameraButtonY: Animated.Value,

	/** Needed when scaling button, because we don't want it to scale with the rim */
	animating: boolean,
}

export class ShutterButton extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			size: new Animated.Value(1),
			cameraButtonScale: new Animated.Value(1),
			cameraButtonY: new Animated.Value(1),
			animating: false,
		};

		/* Refs */

		/* Bindings */
		this.instantSetBack = this.instantSetBack.bind(this);
		this.animateBack = this.animateBack.bind(this);
		this.scaleUp = this.scaleUp.bind(this);
	}

	/** Instantly scale down to normal value */
	instantSetBack(): void {
		this.setState({ size: new Animated.Value(1) });
	}

	/** Smoothly animate from full scale to normal */
	animateBack(): void {
		const common = { duration: 700, easing: Easing.inOut(Easing.exp), useNativeDriver: true };
		Animated.parallel([
			Animated.timing(this.state.cameraButtonY, {
				toValue: 0,
				delay: 200,
				...common
			}),
			Animated.timing(this.state.cameraButtonScale, {
				toValue: 1,
				...common
			}),
		]).start(() => this.setState({ animating: false }));
	}

	/** Smoothly scale up and do callback */
	scaleUp(callback: () => void): void {
		const common = { duration: 700, easing: Easing.inOut(Easing.exp), useNativeDriver: true };
		this.setState({ animating: true });
		
		Animated.parallel([
			Animated.timing(this.state.cameraButtonY, {
				toValue: -40,
				...common
			}),
			Animated.timing(this.state.cameraButtonScale, {
				toValue: 40,
				delay: 200,
				...common
			}),
		]).start(callback);
	}
	
	render() {
		return (
			<Animated.View
				style={[Styles.cameraButton, {
					transform: [{ scale: this.state.cameraButtonScale }, { translateY: this.state.cameraButtonY }],
					backgroundColor: this.state.animating ? "#fff" : "transparent"
				}]}

				/* Animations */
				onTouchStart={() => Animated.timing(this.state.size, { toValue: 0.9, duration: 100, useNativeDriver: true }).start()}
				onTouchEnd={() => Animated.timing(this.state.size, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
			>
				<TouchableOpacity
					style={[Styles.cameraButtonInner, {
						transform: [{ scale: this.state.size }]
					}]}
					activeOpacity={1}
					onPress={this.props.active ? this.props.takePic : () => {}}
				/>
			</Animated.View>
		);
	}
}
