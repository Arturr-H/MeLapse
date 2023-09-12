/* Imports */
import React, { RefObject } from "react";
import { ActivityIndicator, Animated, Easing, SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { stitchImages } from "../../functional/VideoCreator";
import * as MediaLibrary from "expo-media-library";
import { WIDTH } from "../result/Result";
import QuickCounter from "./QuickCounter";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { FFmpegKit } from "ffmpeg-kit-react-native";


/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Composer: undefined }, "Composer">,
    
    params: LoadingScreenRouteParams
}
interface State {
    amountOfImages: number,
    amountOfImagesTranslateX: Animated.Value,
    
    /** This scene displays a bunch of stats, this
     * value keeps track of which to display */
    statIndex: number
}
export interface LoadingScreenRouteParams {
    fps: number,
    outputFormat: "gif" | "mp4",
    quality: "okay" | "mid" | "high"
}

class LoadingScreen extends React.Component<Props, State> {
    /* Refs */
    multianimator: RefObject<MultiAnimator> = React.createRef();

    /* Other */
    statComponents: JSX.Element[];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            amountOfImages: 0,
            amountOfImagesTranslateX: new Animated.Value(-WIDTH),

            statIndex: 0
        };

        /* The stats */
        this.statComponents = [
            <MultiAnimator ref={this.multianimator}>
                <QuickCounter from={0} to={188} duration={4000} callback={this.nextStat} />
                <Text style={Styles.amountOfImagesText}>Selfies captured</Text>
            </MultiAnimator>,

            <MultiAnimator>
                <QuickCounter from={0} to={188} duration={4000} callback={this.nextStat} />
                <Text style={Styles.amountOfImagesText}>Shits made</Text>
            </MultiAnimator>,
        ];

        /* Bindings */
        this.generateVideo = this.generateVideo.bind(this);
        this.nextStat = this.nextStat.bind(this);
        this.goBack = this.goBack.bind(this);
    };
    
    /* Lifetime */
    async componentDidMount(): Promise<void> {
        console.log(this.props.params);
        // this.bigText.current.
        await this.generateVideo();
        this.setState({ amountOfImages: 10 });
        this.animateAmountOfImages();
        this.multianimator.current?.fadeIn(200, 100, undefined, 1000);
    }

    /** Animate intro for amount of images text */
    animateAmountOfImages(): void {
        Animated.timing(this.state.amountOfImagesTranslateX, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start()
    }

    /** Generate the timmelapse footage */
    async generateVideo(): Promise<void> {
        try {
            await stitchImages(async (e) => {
                await MediaLibrary.saveToLibraryAsync(e);
            });
        }catch {
            alert("Couldn't generate video");
        }
    }

    /** Display the next stat */
    nextStat(): void {
        this.multianimator.current?.fadeOut(800, 100, () => {
            this.setState({ statIndex: this.state.statIndex + 1 }, () => {
                this.multianimator.current?.fadeIn(200, 100, undefined, 1000);
            });
        }, 400)
    }

    /** Cancels the ffmpeg gif stitching process
     * and switches back scene */
    goBack(): void {
        this.multianimator.current?.fadeOut(200, 100, () => {
            FFmpegKit.cancel().then(() => {
                this.props.navigation.navigate("Composer");
            });
        });
    }

	render() {
        const statComponents: (JSX.Element[])[] = [
            [
                <QuickCounter from={0} to={188} duration={4000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>📸 Selfies captured</Text>
            ],

            [
                <QuickCounter from={0} to={431} duration={4000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>⏱️ Days since first selfie</Text>
            ],

            [
                <QuickCounter from={0} to={4} duration={2000} delay={2000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>🔥 Most images taken on one day</Text>
            ],

            [
                <Text style={Styles.thankYou}>Thank you for using {"my app"}</Text>,
                <Text style={Styles.thankYou}>❤️</Text>
            ],
        ];

        /* @ts-ignore WHY DOES TYPESCRIPT COMPLAIN??????? IT LITERALLY RETURNS `JSX.ELEMENT[]` */
        const children: JSX.Element[] = statComponents.map((e: JSX.Element[], index) => {
            if (index === this.state.statIndex) { return e as JSX.Element[] }
            else { return [] as JSX.Element[] }
        });
        
		return (
			<SafeAreaView style={Styles.container}>
                <TouchableOpacity style={Styles.cancelButton} activeOpacity={0.5} onPress={this.goBack}>
                    <Text style={Styles.cancelButtonText}>← Cancel</Text>
                </TouchableOpacity>

                <View style={Styles.padding}>
                    {/* <View style={Styles.emojiView}>
                        <View style={Styles.emojiCorner}>
                            <Text style={Styles.emojiCornerTextTop}>📸</Text>
                        </View>
                        <View style={Styles.emojiCorner}>
                            <Text style={Styles.emojiCornerTextBottom}>📸</Text>
                        </View>

                        <BlurView intensity={40} style={Styles.emojiViewBlur} />
                    </View> */}

                    <View style={Styles.innerContainer}>
                        <MultiAnimator ref={this.multianimator}>
                            {children}
                        </MultiAnimator>
                    </View>

                    <View style={Styles.loadingContainer}>
                        <Text style={Styles.loadingText}>Generating</Text>
                        <ActivityIndicator color={"#ddd"} />
                    </View>
                </View>
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();

    return <LoadingScreen params={props.route.params} {...props} navigation={navigation} />;
}
