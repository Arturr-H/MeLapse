/* Imports */
import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { ActivityIndicator, Easing, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptic from "expo-haptics";
import { LSImage, LSImageProp } from "../../functional/Image";
import { Animator } from "../../components/animator/Animator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Background from "./Background";
import DenyStamp from "./DenyStamp";
import GarbageFolder from "./GarbageFolder";
import { BigText } from "./BigText";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: "other" } }, "Camera", "Result">,

    /* Navigation props */
    lsimage: LSImageProp
}
interface State {
    confirmButtonY: Animated.Value,
    scrapButtonX: Animated.Value,
    confirmButtonScale: Animated.Value,
    scrapButtonScale: Animated.Value,

    deactivateButtons: boolean,
    lsimage?: LSImageProp,
    nrOfImages: number
}

/* Constants */
const BUTTON_HIDE_CONFIG = { easing: Easing.in(Easing.exp), duration: 500, useNativeDriver: true };
const BUTTON_SHOW_CONFIG = { easing: Easing.out(Easing.exp), duration: 500, useNativeDriver: true };

class Preview extends React.PureComponent<Props, State> {
    poster: RefObject<Poster> = React.createRef();
    denyStamper: RefObject<DenyStamp> = React.createRef();
    background: RefObject<Background> = React.createRef();
    posterAnimator: RefObject<Animator> = React.createRef();
    bigText: RefObject<BigText> = React.createRef();

    garbageFolderFront: RefObject<GarbageFolder> = React.createRef();
    garbageFolderBack: RefObject<GarbageFolder> = React.createRef();
    
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            confirmButtonY: new Animated.Value(200),
            scrapButtonX: new Animated.Value(-200),
            confirmButtonScale: new Animated.Value(0.2),
            scrapButtonScale: new Animated.Value(0.2),

            deactivateButtons: false,
            nrOfImages: 0
        };

        /* Bindings */
        this.fadeOutPoster = this.fadeOutPoster.bind(this);
        this.outroButtons = this.outroButtons.bind(this);
        this.introButtons = this.introButtons.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onSave = this.onSave.bind(this);
    };

    /* Lifetime */
    componentDidMount(): void {
        this.props.navigation.addListener("focus", this.onFocus);
        this.onFocus();
    }
    componentWillUnmount(): void {
        this.props.navigation.removeListener("focus", this.onFocus);
    }
    async onFocus(): Promise<void> {
        this.introButtons();
        this.setState({ lsimage: this.props.lsimage });
        await LSImage.getImagePointers().then(e => {
            this.setState({ nrOfImages: e?.length ?? 1 });
        })
    }

    /* Delete / save image */
    async onDelete(): Promise<void> {
        this.setState({ deactivateButtons: true });
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

        /* Increase scrapping stats */
        try {
            const count: number = JSON.parse(await AsyncStorage.getItem("scrappedSelfies") ?? "0")
            await AsyncStorage.setItem("scrappedSelfies", (count+1).toString());
        }catch {}

        this.background.current?.fadeOut();
        this.outroButtons();
        const navigate = () => this.props.navigation.navigate("Camera", { comesFrom: "other" });
        
        if (this.poster.current) {
            const anim = Math.floor(Math.random() * 3);

            switch (anim) {
                case 0:
                    this.poster.current?.delete(navigate);
                    break;
                
                case 1:
                    this.garbageFolderBack.current?.intro();
                    this.garbageFolderFront.current?.intro(() => {
                        this.poster.current?.fallDown();
                    }, navigate);
                    break;

                case 2:
                    this.denyStamper.current?.intro(this.fadeOutPoster, navigate);
                    break;

                default: break;
            }
        }else {
            navigate();
        }
    }
    async onSave(): Promise<void> {
        if (this.props.lsimage) {
            this.setState({ deactivateButtons: true });

            /* Save the image to fs */
            try {
                await LSImage.fromLSImageProp(this.props.lsimage).saveAsync();
            }
            catch {}
            
            /* Animations */
            Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
            this.background.current?.fadeOut();
            this.outroButtons();
            this.bigText.current?.animate();

            if (this.poster.current) {
                this.poster.current?.save(() => {
                    setTimeout(() => {
                        this.props.navigation.navigate("Camera", { comesFrom: "other" });
                    }, 1100);
                });
            }
        }else {
            alert("No image found.");
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        }
    }

    /* Button animations */
    introButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_SHOW_CONFIG, toValue: 0, delay: 100 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_SHOW_CONFIG, toValue: 0, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonScale, { ...BUTTON_SHOW_CONFIG, toValue: 1, delay: 190 }).start();
        Animated.timing(this.state.confirmButtonScale, { ...BUTTON_SHOW_CONFIG, toValue: 1, delay: 40 }).start();
    }
    outroButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_HIDE_CONFIG, toValue: 200, delay: 100 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_HIDE_CONFIG, toValue: -200, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonScale, { ...BUTTON_HIDE_CONFIG, toValue: 0.2, delay: 100 }).start();
        Animated.timing(this.state.confirmButtonScale, { ...BUTTON_HIDE_CONFIG, toValue: 0.2, delay: 100 }).start();
    }
    fadeOutPoster(): void {
        this.posterAnimator.current?.fadeOut(400).start();
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                {/* Background */}
                <Background ref={this.background} />

                {/* Deny stamp remove animation */}
                <DenyStamp ref={this.denyStamper} />

                {/* Garbage folder (BACK) remove animation */}
                <GarbageFolder ref={this.garbageFolderBack} side="back" />

                <Animator ref={this.posterAnimator} style={Styles.posterContainer}>
                    <View style={Styles.absolute}>
                        {/* Poster (image preview) */}
                        {this.state.lsimage && <Poster lsimage={this.state.lsimage} ref={this.poster} />}

                        <BigText
                            ref={this.bigText}
                            prev={this.state.nrOfImages - 1}
                            curr={this.state.nrOfImages}
                        />
                    </View>
                </Animator>

                <View style={Styles.buttonRow}>
                    {/* Delete image */}
                    <View style={Styles.row}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Styles.deleteButton, { transform: [
                                { translateX: this.state.scrapButtonX },
                                { scale: this.state.scrapButtonScale }
                            ] }]}
                            onPress={!this.state.deactivateButtons ? this.onDelete : () => {}}
                        >
                            {this.state.deactivateButtons
                                ? <ActivityIndicator color={"white"} />
                                : <Text style={Styles.deleteButtonText}>👎</Text>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* Save image */}
                    <View style={Styles.row}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Styles.acceptButton, { transform: [
                                { translateY: this.state.confirmButtonY },
                                { scale: this.state.confirmButtonScale }
                            ] }]}
                            onPress={!this.state.deactivateButtons ? this.onSave : () => {}}
                        >
                            {this.state.deactivateButtons
                                ? <ActivityIndicator color={"white"} />
                                : <Text style={Styles.acceptButtonText}>SAVE →</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Garbage folder (FRONT) remove animation */}
                <GarbageFolder ref={this.garbageFolderFront} side="front" />

                {/* Time, battery & more */}
                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Preview {...props} lsimage={props.route.params.lsimage} navigation={navigation} />;
}
