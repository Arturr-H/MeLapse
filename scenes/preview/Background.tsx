/* Imports */
import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { ActivityIndicator, Dimensions, Easing, Image, ImageSourcePropType, SafeAreaView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptic from "expo-haptics";
import Floater from "../../components/floater/Floater";
import { LSImage, LSImageProp, saveImage } from "../../functional/Image";
import { Animator } from "../../components/animator/Animator";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Constants */
const WIDTH = Dimensions.get("window").width;

/* Interfaces */
interface Props {
}
interface State {
    bgTranslate: Animated.Value
}

export default class Background extends React.PureComponent<Props, State> {
    background: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            bgTranslate: new Animated.Value(-WIDTH),
        };

        /* Bindings */
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
    };

    /** Fades in background. Called externally */
    fadeIn(): void {
        this.background.current?.fadeIn(1000).start();

        Animated.loop(Animated.timing(this.state.bgTranslate, {
            toValue: WIDTH,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true
        })).start();
    }

    /** Fades out background. Called externally */
    fadeOut(): void {
        this.background.current?.fadeOut(1000).start();
    }

	render() {
		return (
            <Floater loosness={2} style={{
                position: "absolute",
                width: WIDTH,
                height: "100%",

                zIndex: -2,
            }}>
                <Animator startOpacity={0} ref={this.background} pointerEvents="none" style={{
                    width: WIDTH,
                    height: "100%",
                    position: "absolute",

                    display: "flex",
                    justifyContent: "center",
                        alignItems: "center",
                }}>
                    <Animated.Text numberOfLines={1} style={{
                        position: "absolute",
                        fontSize: WIDTH * 0.5,
                        width: WIDTH*8,
                        textAlign: "center",

                        transform: [{ translateX: this.state.bgTranslate }],
                        color: "#eee",
                        fontFamily: "inter-black",
                        
                    }}>SAVE{"  "}SAVE{"  "}SAVE</Animated.Text>
                </Animator>
            </Floater>
		);
	}
}
