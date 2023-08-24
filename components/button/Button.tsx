import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
    text: string,
    onPress: () => void,
    active: boolean
}
interface State {
}

export class Button extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            focus: false,
            value: "",
            chars: 0,
        };

        /* Static */
	}

    /* Lifetime */
    componentDidMount(): void {
    }

	render() {
		return (
            <TouchableHighlight
                underlayColor={"rgb(80, 190, 245)"}
                style={Styles.button}
                onPress={() => {
                    this.props.active && this.props.onPress();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
            >
                <Text style={Styles.buttonText}>{this.props.text}</Text>
            </TouchableHighlight>
        );
	}
}
