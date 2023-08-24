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
		this.state = {
		};

		/* Refs */

		/* Bindings */
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
	}

	render() {
		return (
			<View style={Styles.alignHelperContainer}>
				<Image
					source={require("../../assets/images/align/face.png")}
				/>
			</View>
		);
	}
}
