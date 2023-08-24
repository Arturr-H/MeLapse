import React, { RefObject } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";

/* Interfaces */
interface Props {}
interface State {}

export class MenuButton extends React.PureComponent<Props, State> {
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
			<View style={Styles.menuButton}>
				<Text
                    style={Styles.menuButtonIcon}
				>⚙️</Text>
			</View>
		);
	}
}
