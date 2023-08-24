import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, Image, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {}

export class AlignHelper extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {};
	}

	render() {
		return (
			<Image
				style={Styles.alignFace}
				source={require("../../assets/images/align/face.png")}
			/>
		);
	}
}
