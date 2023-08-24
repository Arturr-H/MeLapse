/* Imports */
import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, ImageSourcePropType, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { BigText } from "./BigText";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LSImage } from "../../functional/Image";

/* Constants */
export const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

/* Aliases */
export const AV = Animated.Value;
type A = Animated.Value;

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: undefined }, "Camera">,

    /* Navigation props */
    lsimage: LSImage
}
export interface State {
    bigTextX: A,
    photoTextX: A,

    textContainerY: A,
    fontSizeFactor: A,

    posterSliderX: A,
    dateSliderX: A,

    number: number;
    previous?: LSImage;
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

            number: -1,
        };

        /* Bindings */
        this.anim = this.anim.bind(this);
        this.intro = this.intro.bind(this);
        this.outro = this.outro.bind(this);

        /* Refs */
        this.prevPoster = React.createRef();
        this.currentPoster = React.createRef();
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.intro();
        await this.getStats().then(e => {
            if (e) {
                this.setState({ number: e.length, previous: e.previous });
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
    }
    outro(): void {
        // this.anim(this.state.posterSliderX, 0, 300, Easing.inOut(Easing.exp), 100);
        this.anim(this.state.photoTextX, -WIDTH*1.4, 900, Easing.in(Easing.exp));
        this.anim(this.state.bigTextX, -WIDTH*1.4, 800, Easing.in(Easing.exp), 200);

        const FLOAT_DELAY = 200;
        this.anim(this.state.posterSliderX, -WIDTH*2, 1900, Easing.inOut(Easing.exp), 200, () => {
            /* SWITCH SCENE */
            this.props.navigation.navigate("Camera");
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
    async getStats(): Promise<{ length: number, previous?: LSImage } | null> {
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

	render() {
		return (
			<View style={Styles.container}>

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
                        date={this.state.previous?.date ?? "-"}
                        source={{ uri: this.state.previous?.path }}
                        skipIntro={true}
                        skipPan={true}
                    />
                    <Poster
                        ref={this.currentPoster}
                        date={this.props.lsimage.date}
                        source={{ uri: this.props.lsimage.path }}
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
                    <Text style={Styles.dateText}>Yesterday</Text>
                    <Text style={Styles.dateText}>Just now</Text>
                </Animated.View>
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Result {...props} lsimage={props.route.params.lsimage} navigation={navigation} />;
}
