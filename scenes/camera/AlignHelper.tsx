import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, Image, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { AlignTransforms } from "../../functional/FaceDetection";

/* Interfaces */
interface Props {}
interface State {
	// translateX: Animated.Value,
	// translateY: Animated.Value,
	// rotation: Animated.Value,
	// scale: Animated.Value,
	// transforms: any[],
	scale: Animated.Value,
	rotation: Animated.Value,
	translate: Animated.ValueXY,
}

export class AlignHelper extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			scale: new Animated.Value(1),
			rotation: new Animated.Value(0),
			translate: new Animated.ValueXY,
		};

		this.animateNext = this.animateNext.bind(this);
	}

	/* Animate to next position */
	animateNext(transforms: AlignTransforms): void {
		this.spring(this.state.scale, transforms.scale, 100);
		this.spring(this.state.rotation, transforms.rotation, 100);
		this.spring(this.state.translate, transforms.translate, 100);
	}
	spring(
		value: Animated.Value | Animated.ValueXY,
		toValue: number | { x: number, y: number },
		speed?: number
	): void {
		Animated.spring(value, {
			toValue,
			useNativeDriver: true,
			speed: speed ?? 10
		}).start();
	}

	render() {
		let rotate = this.state.rotation.interpolate({
			inputRange: [-360, 360],
			outputRange: ["-360deg", "360deg"]
		});
		return (
			<View style={Styles.alignFaceContainer}>
				{/* Outline / calibrated position */}
				<Image
					style={Styles.alignFace}
					source={require("../../assets/images/align/face-outline.png")}
				/>

				{/* Face position */}
				<Animated.Image
					style={[Styles.alignFace, {
						shadowColor: "#000",
						shadowRadius: 2,
						shadowOffset: { width: 0, height: 0 },
						shadowOpacity: 1,
						transform: [
							{ scale: this.state.scale },
							{ rotate },
							{ translateX: this.state.translate.x },
							{ translateY: this.state.translate.y },
						]
					}]}
					source={require("../../assets/images/align/face-filled.png")}
				/>
			</View>
		);
	}
}
