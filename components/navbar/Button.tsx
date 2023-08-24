/* Imports */
import React from "react";
import Styles from "./Styles";
import { Image, TouchableHighlight, TouchableOpacity, View } from "react-native";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class Button extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {};
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Render */
	render() {
		return (
			<TouchableOpacity style={Styles.button}>
				<Image
					style={Styles.icon}
					source={{ uri: "https://cdn-icons-png.flaticon.com/512/7133/7133312.png" }}
				/>
			</TouchableOpacity>
		);
	};
}
