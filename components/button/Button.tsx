import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight, ActivityIndicator, Alert, StyleProp, ViewStyle } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../../styleBundles/Colors";

/* Constants */
const SCALE_ANIM_CONFIG = {
    duration: 50, useNativeDriver: true,
    easing: Easing.inOut(Easing.ease)
};

/* Interfaces */
interface Props {
    text?: string,
    onPress: () => void,
    active?: boolean,

    color?: "red" | "blue",
    flex?: boolean,
    small?: true,

    loading?: boolean,

    /** Display a popup message and OK or cancel */
    confirm?: { message: string, title: string },

    /** When the confirm message was denied */
    onDeny?: () => void,

    /** Children for placing jsx elements inside instead of str */
    children?: JSX.Element | JSX.Element[],

    /* Override w/h */
    width?: number,
    height?: number,

    /** Add styles */
    style?: StyleProp<ViewStyle>,

    /** Emoji at the left side of the button */
    emoji?: string,
    emojiSize?: number,
}
interface State {
    loading?: boolean,
    scale: Animated.Value
}

export class Button extends React.PureComponent<Props, State> {
    colors: {
        "blue": string[],
        "red": string[],
    };

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            loading: false,
            scale: new Animated.Value(1)
        };

        /* Static */
        this.colors = {
            "blue": [Colors.blue.default, Colors.blue.darkened],
            "red": [Colors.red.default, Colors.red.darkened],
        }

        /* Bindings */
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
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

    /* Touch */
    onTouchStart(): void {
        Animated.timing(this.state.scale, { ...SCALE_ANIM_CONFIG, toValue: 0.95 }).start();
    }
    onTouchEnd(): void {
        Animated.timing(this.state.scale, { ...SCALE_ANIM_CONFIG, toValue: 1 }).start();
    }

	render() {
        const scale = this.state.scale;
        const color = this.colors[this.props.color ?? "blue"];

		return (
            <Animated.View
                style={[
                    this.props.flex && { flex: 1 },
                    { transform: [{ scale }] }
                ]}
            >
                <TouchableHighlight
                    underlayColor={color[1]}
                    style={[
                        this.props.style,
                        Styles.button,
                        {
                            backgroundColor: color[0],
                            borderColor: color[1],
                        },
                        this.props.flex && { flex: 1 },
                        this.props.small && {
                            borderRadius: 5,
                            height: 40,
                            minHeight: 40
                        },
                        this.props.width !== undefined ? { width: this.props.width } : {},
                        this.props.height !== undefined ? { height: this.props.height } : {},
                    ]}
                    onPressIn={this.onTouchStart}
                    onPressOut={this.onTouchEnd}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (this.props.confirm) {
                            Alert.alert(this.props.confirm.title, this.props.confirm.message, [
                                { style: "destructive", onPress: () => {
                                    this.props.active === true && this.props.onPress();
                                }, isPreferred: false, text: "Ok" },
                                { style: "default", isPreferred: true, text: "Cancel", onPress: this.props.onDeny },
                            ])
                        }else {
                            this.props.active === true && this.props.onPress();
                        }
                    }}
                >
                    <React.Fragment>
                        {
                            this.state.loading === true

                            /* Loading */
                            ? <ActivityIndicator color={"white"} />

                            /* Children */
                            : this.props.children ? <>{this.props.children}</>

                            /* Text */
                            : <Text style={[
                                Styles.buttonText,
                                this.props.small && { fontSize: 16 }
                            ]}>{this.props.text}</Text>
                        }

                        {this.props.emoji && <Text
                            style={[
                                Styles.emoji,
                                this.props.emojiSize ? {
                                    fontSize: this.props.emojiSize,
                                    transform: [{ translateX: -this.props.emojiSize / 3 }]
                                } : {}
                            ]}
                            children={this.props.emoji}
                        />}
                    </React.Fragment>
                </TouchableHighlight>
            </Animated.View>
        );
	}
}
