/* Imports */
import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, ImageSourcePropType, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { BigText } from "./BigText";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LSImage, LSImageProp } from "../../functional/Image";
import * as Haptics from "expo-haptics";

/* Constants */
export const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

/* Aliases */
export const AV = Animated.Value;
type A = Animated.Value;

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: "other" } }, "Camera">,

    /* Navigation props */
    lsimage: LSImageProp
}
export interface State {
    bigTextX: A,
    photoTextX: A,

    textContainerY: A,
    fontSizeFactor: A,

    posterSliderX: A,
    dateSliderX: A,
    
    skipTransformX: A,

    number: number,
    previous?: LSImageProp,

    /** If user now has saved first image */
    isFirst: boolean
}

class Result extends React.PureComponent<Props, State> {
    prevPoster: RefObject<Poster>;
    currentPoster: RefObject<Poster>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            bigTextX: new AV(-WIDTH),
            photoTextX: new AV(-WIDTH),

            textContainerY: new AV(-WIDTH/3),
            fontSizeFactor: new AV(1),

            posterSliderX: new AV(WIDTH),
            dateSliderX: new AV(WIDTH),
            skipTransformX: new AV(0),

            number: -1,
            isFirst: false
        };

        /* Bindings */
        this.skipAnimation = this.skipAnimation.bind(this);
        this.intro = this.intro.bind(this);
        this.outro = this.outro.bind(this);
        this.anim = this.anim.bind(this);

        /* Refs */
        this.prevPoster = React.createRef();
        this.currentPoster = React.createRef();
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        await this.getStats().then(e => {
            if (e) {
                console.log(e);
                this.setState({
                    number: e.length,
                    previous: e.previous,
                    isFirst: e.length <= 1
                }, () => {
                    this.intro();
                });
            }else {
                this.intro();
            }
        });
    };

    /* Intros / Outros */
    intro(): void {
        this.anim(this.state.posterSliderX, 0, 300, Easing.inOut(Easing.exp), 100);
        this.anim(this.state.photoTextX, 0, 800, Easing.out(Easing.exp), 200);
        this.anim(this.state.bigTextX, 0, 1100, Easing.out(Easing.exp));
        this.anim(this.state.textContainerY, - (HEIGHT / 3), 900, Easing.inOut(Easing.exp), 1250);
        this.anim(this.state.fontSizeFactor, 0.7, 900, Easing.inOut(Easing.exp), 1250);
        
        const FLOAT_DELAY = 200;

        if (!this.state.isFirst) {
            this.anim(this.state.posterSliderX, 0, 1900, Easing.inOut(Easing.exp), 800, () => {
                this.anim(this.state.posterSliderX, -WIDTH, 1900, Easing.inOut(Easing.exp))
            });
            this.anim(this.state.dateSliderX, 0, 1900 - FLOAT_DELAY, Easing.inOut(Easing.exp), 800 + FLOAT_DELAY, () => {
                this.anim(this.state.dateSliderX, -WIDTH, 1900 - FLOAT_DELAY, Easing.inOut(Easing.exp), 0, () => {
                    this.outro();
                })
            });

            this.prevPoster.current?.rotate(-30, 1200, Easing.inOut(Easing.ease), 3100);
            this.currentPoster.current?.rotate(-30, 1200, Easing.inOut(Easing.ease), 3100);
            this.prevPoster.current?.rotate(0, 1000, Easing.inOut(Easing.ease), 3400);
            this.currentPoster.current?.rotate(0, 1000, Easing.inOut(Easing.ease), 3400);
        }else {
            this.anim(this.state.posterSliderX, -WIDTH, 1900, Easing.inOut(Easing.exp), 1000)
            this.anim(this.state.dateSliderX, -WIDTH, 1900 - FLOAT_DELAY, Easing.inOut(Easing.exp), 1000, () => {
                this.outro();
            });

            this.prevPoster.current?.rotate(0, 1000, Easing.inOut(Easing.ease), 4400);
            this.currentPoster.current?.rotate(0, 1000, Easing.inOut(Easing.ease), 4400);
        }
    }
    outro(): void {
        // this.anim(this.state.posterSliderX, 0, 300, Easing.inOut(Easing.exp), 100);
        this.anim(this.state.photoTextX, -WIDTH*1.4, 900, Easing.in(Easing.exp));
        this.anim(this.state.bigTextX, -WIDTH*1.4, 800, Easing.in(Easing.exp), 200);

        const FLOAT_DELAY = 200;
        this.anim(this.state.posterSliderX, -WIDTH*2, 1900, Easing.inOut(Easing.exp), 200, () => {
            /* SWITCH SCENE */
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        });
        this.anim(this.state.dateSliderX, -WIDTH*2, 1900 - FLOAT_DELAY, Easing.inOut(Easing.exp), 200 + FLOAT_DELAY);
    }

    /* Get transform X */
    getTransformX(v: Animated.Value): any { return { transform: [{ translateX: v }] } }
    getTransformY(v: Animated.Value): any { return { transform: [{ translateY: v }] } }

    /* Animation utility function */
    anim(
        anim: Animated.Value,
        to: number,
        duration?: number,
        easing?: (value: number) => number,
        delay?: number,
        callback?: () => void,
        useNativeDriver?: boolean
    ): void {
        const animationConfig = {
            duration: duration ?? 400,
            toValue: to,
            delay,
            easing,
            useNativeDriver: useNativeDriver ?? true,
        };
      
        if (useNativeDriver && (easing || delay)) {
            // Native driver does not support custom easing or delay
            animationConfig.easing = undefined;
            animationConfig.delay = undefined;
            animationConfig.useNativeDriver = false;
        }
      
        Animated.timing(anim, animationConfig).start(callback);
    }

    /* Get number of pics taken and previous pic */
    async getStats(): Promise<{ length: number, previous?: LSImageProp } | null> {
        const pics = await AsyncStorage.getItem("imagePointers");
        if (pics) {
            const parsed = JSON.parse(pics);
            const length = parsed.length;
            return {
                length,
                previous: parsed[length - 2]
            };
        }else {
            return null
        }
    }

    /* Returns a string saying how long ago a
        date (unix time) was, like "5 days ago" */
    getTimeAgo(input: number | undefined): string {
        return getTimeAgo(input)
    }

    /* Skips result animation */
    skipAnimation(): void {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        this.anim(this.state.skipTransformX, WIDTH*2, 500, Easing.exp, 0, () => {
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        });
    }

	render() {
		return (
            <View style={Styles.container}>
                <Animated.View
                    style={[Styles.container, {
                        transform: [{ translateX: this.state.skipTransformX }]
                    }]}
                    onTouchStart={this.skipAnimation}
                >

                    {/* Title text */}
                    <Animated.View style={[Styles.numberContainer, this.getTransformY(this.state.textContainerY)]}>
                        <BigText
                            prev={this.state.number - 1}
                            curr={this.state.number}
                            fontSizeFactor={this.state.fontSizeFactor}
                            translateX={this.state.bigTextX}
                        />
                        <Animated.Text style={[
                            Styles.photoText,
                            { transform: [
                                { scale: this.state.fontSizeFactor },
                                { translateX: this.state.photoTextX }
                            ] }
                        ]}>PHOTOS</Animated.Text>
                    </Animated.View>

                    {/* Previous and current photo */}
                    <Animated.View
                        style={[
                            Styles.slideContainer,
                            { transform: [
                                { translateX: this.state.posterSliderX }
                            ] }
                        ]}
                    >
                        <Poster
                            ref={this.prevPoster}
                            lsimage={this.state.previous}
                            skipIntro={true}
                            skipPan={true}
                            visible={!this.state.isFirst}
                        />
                        <Poster
                            ref={this.currentPoster}
                            lsimage={this.props.lsimage}
                            skipIntro={true}
                            skipPan={true}
                        />
                    </Animated.View>

                    {/* "3d" effect for last photo and current photo */}
                    <Animated.View
                        style={[
                            Styles.slideContainer,
                            Styles.dateSliderContainer,
                            { transform: [
                                { translateX: this.state.dateSliderX }
                            ] }
                        ]}
                    >
                        <Text style={Styles.dateText}>{this.getTimeAgo(this.state.previous?.date)}</Text>
                        <Text style={Styles.dateText}>Just now</Text>
                    </Animated.View>
                </Animated.View>
            </View>
		);
	}
}

/** Returns a string saying how long ago a
    date (unix time) was, like "5 days ago" */
export function getTimeAgo(input: number | undefined): string {
    if (input) {
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
        const elapsedTime = currentTime - input / 1000;
    
        const intervals = [
            { label: "year", seconds: 31536000 },
            { label: "month", seconds: 2592000 },
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ];
    
        for (const interval of intervals) {
            const count = Math.floor(elapsedTime / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
            }
        }
    
        return "just now";
    }else {
        return ""
    }
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Result {...props} lsimage={props.route.params.lsimage} navigation={navigation} />;
}
