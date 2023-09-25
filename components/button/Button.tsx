import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight, ActivityIndicator, Alert } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
    text: string,
    onPress: () => void,
    active: boolean,

    color?: "red" | "blue" | "green",
    flex?: boolean,
    small?: true,

    loading?: boolean,

    /** Display a popup message and OK or cancel */
    confirm?: { message: string, title: string },

    /** When the confirm message was denied */
    onDeny?: () => void
}
interface State {
    loading?: boolean,
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
            loading: false,
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
        this.setState({ loading: this.props.loading });
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.props.loading !== prevProps.loading) {
            this.setState({ loading: this.props.loading });
        }
    }

	render() {
		return (
            <TouchableHighlight
                underlayColor={this.colors[this.props.color ?? "blue"][1]}
                style={[
                    Styles.button,
                    {
                        backgroundColor: this.colors[this.props.color ?? "blue"][0],
                        borderColor: this.colors[this.props.color ?? "blue"][1],
                    },
                    this.props.flex && { flex: 1 },
                    this.props.small && {
                        borderRadius: 5,
                        height: 40,
                        minHeight: 40
                    }
                ]}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    if (this.props.confirm) {
                        Alert.alert(this.props.confirm.title, this.props.confirm.message, [
                            { style: "destructive", onPress: () => {
                                this.props.active && this.props.onPress();
                            }, isPreferred: false, text: "Ok" },
                            { style: "default", isPreferred: true, text: "Cancel", onPress: this.props.onDeny },
                        ])
                    }else {
                        this.props.active && this.props.onPress();
                    }
                }}
            >
                {this.state.loading === true ? <ActivityIndicator color={"white"} /> :
                    <Text style={[
                        Styles.buttonText,
                        this.props.small && { fontSize: 16 }
                    ]}>{this.props.text}</Text>
                }
            </TouchableHighlight>
        );
	}
}
