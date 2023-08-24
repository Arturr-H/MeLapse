/* Imports */
import React from "react";
import Styles from "./Styles";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import Button from "./Button";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class Navbar extends React.PureComponent<Props, State> {
	
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
            <View style={Styles.navbarWrapper}>
                <BlurView intensity={80} tint="light" style={Styles.navbarInner}>
                    <Button />
                    <Button />
                    <Button />
                </BlurView>
            </View>
		);
	};
}
