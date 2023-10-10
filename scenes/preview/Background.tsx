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
import { LSImage, LSImageProp, saveImage } from "../../functional/Image";
import { Animator } from "../../components/animator/Animator";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Constants */
const WIDTH = Dimensions.get("window").width;

/* Interfaces */
interface Props {
}
interface State {
    bgTranslate: Animated.Value,
    textAnimationSpeed: Animated.Value,
    textWidth?: number
}

export default class Background extends React.PureComponent<Props, State> {
    background: RefObject<Animator> = React.createRef();
    isFadedIn: boolean = false;
    textOffsets: number[] = [-25, 13, 62, -11, 2, -41, 42];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            bgTranslate: new Animated.Value(0),
            textAnimationSpeed: new Animated.Value(1),
        };

        /* Bindings */
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
    };

    onLayout(textWidth: number): void {
        this.setState({ textWidth });
        if (!this.isFadedIn) {
            this.fadeIn(textWidth);
        }
    }

    /** Fades in background */
    fadeIn(textWidth: number): void {
        this.background.current?.fadeIn(1000).start();
        
        Animated.loop(Animated.timing(this.state.bgTranslate, {
            toValue: textWidth,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true
        })).start();
    }

    /** Fades out background. Called externally */
    fadeOut(): void {
        Animated.timing(this.state.textAnimationSpeed, {
            toValue: 5,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
            duration: 1000
        }).start();
        this.background.current?.fadeOut(1000).start();
    }

	render() {
		return (
            <Animator startOpacity={0} ref={this.background} pointerEvents="none" style={Styles.textContainer}>
                {[0.25,0.5,0.8,1,0.8,0.5,0.25].map((opacity, i) => 
                    <Animated.Text
                        key={"bgtxtrow" + i}
                        numberOfLines={1}
                        style={[Styles.backgroundTextRow, {
                            transform: [{ translateX: 
                                Animated.add(
                                    Animated.multiply(
                                        this.state.bgTranslate,
                                        Animated.multiply(
                                            1 + Math.abs(2 - i + 1),
                                            this.state.textAnimationSpeed
                                        )
                                    ),
                                    this.textOffsets[i]
                                ),
                            }],
                            opacity
                        }]}
                    >
                        {[0,0,0,0,0,0,0,0,0,0,0].map((_,i_) =>
                            <View key={"bgtxt" + i_}>
                                <Text
                                    style={[
                                        Styles.backgroundText,
                                        this.state.textWidth ? { width: this.state.textWidth } : {}
                                    ]}
                                    onLayout={e => {
                                        if (i_ === 0 && e.nativeEvent.layout.width !== 0)
                                            this.onLayout(e.nativeEvent.layout.width)
                                    }}
                                    children="SAVE  "
                                />
                            </View>
                        )}
                    </Animated.Text>
                )}
            </Animator>
		);
	}
}
