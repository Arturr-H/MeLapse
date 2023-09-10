import React from "react";
import { Animated, Easing, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
	cameraButtonPadding: number,
	loadingImage: boolean,
	takePic: () => void,

	scale: Animated.Value,
}
interface State {
	size: Animated.Value,
}

export class ShutterButton extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			size: new Animated.Value(1),
		};

		/* Refs */

		/* Bindings */
		this.onPress = this.onPress.bind(this);
	}

	/* On click */
	onPress(): void {
		Animated.timing(this.state.size, {
			toValue: 0.8,
			duration: 100,
			easing: Easing.inOut(Easing.ease),
			useNativeDriver: true
		}).start();
	}

	render() {
		return (
			<Animated.View
				style={[Styles.cameraButton, {
					transform: [{ scale: this.props.scale }],
					padding: this.props.cameraButtonPadding,
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
					onPress={this.props.loadingImage ? () => {} : this.props.takePic}
				/>
			</Animated.View>
		);
	}
}
