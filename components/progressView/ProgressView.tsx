import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { ActivityIndicator, Animated, Dimensions, Easing, Image, TouchableOpacity, View } from "react-native";
import { Animator } from "../animator/Animator";
import { BlurView } from "expo-blur";

/* Interfaces */
interface Props {}
interface State {}


export class ProgressView extends React.PureComponent<Props, State> {
    animator: RefObject<Animator>;
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
        };

        this.animator = React.createRef();
	}

    /* Lifetime */
    componentDidMount(): void {
        this.animator.current?.fadeIn(400).start();
    }

	render() {
		return (
            <View style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,

                display: "flex",
                justifyContent: "center",
                    alignItems: "center",

                position: "absolute",
                backgroundColor: "#00000099"
            }}>
                <ActivityIndicator />
            </View>
        );
	}
}
