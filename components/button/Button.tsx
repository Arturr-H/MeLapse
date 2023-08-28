import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
    text: string,
    onPress: () => void,
    active: boolean,

    color?: "red" | "blue" | "green",
    flex?: boolean
}
interface State {
}

export class Button extends React.PureComponent<Props, State> {
    colors: {
        "blue": string[],
        "red": string[],
        "green": string[]
    };

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            focus: false,
            value: "",
            chars: 0,
        };

        /* Static */
        this.colors = {
            "blue": ["rgb(90, 200, 245)", "rgb(80, 190, 245)"],
            "red": ["rgb(255, 45, 85)", "rgb(235, 25, 75)"],
            "green": ["rgb(59, 199, 89)", "rgb(49, 189, 79)"]
        }
	}

    /* Lifetime */
    componentDidMount(): void {
    }

	render() {
		return (
            <TouchableHighlight
                underlayColor={this.colors[this.props.color ?? "blue"][1]}
                style={[Styles.button, {
                    backgroundColor: this.colors[this.props.color ?? "blue"][0],
                    borderColor: this.colors[this.props.color ?? "blue"][1]
                }, this.props.flex && { flex: 1 }]}
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
