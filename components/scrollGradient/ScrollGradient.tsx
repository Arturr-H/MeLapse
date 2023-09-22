/* Imports */
import React from "react";
import Styles from "./Styles";
import { Animated, Image, StyleProp, Text, TouchableHighlight, TouchableOpacity, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/* Interfaces */
interface Props {
}
interface State {
}

/* Main */
export default class ScrollGradient extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
        };

        /* Bindings */
	}

	/* Render */
	render() {
		return (
            <View style={Styles.gradientContainer} pointerEvents="none">
                <LinearGradient
                    colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
                    style={[Styles.gradient, Styles.flip]}
                />
                <LinearGradient
                    colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]}
                    style={Styles.gradient}
                />
            </View>
		);
	};
}
