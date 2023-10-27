/* Imports */
import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { ActivityIndicator, Dimensions, Easing, SafeAreaView, Text, View } from "react-native";
import Styles from "./Styles";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LSImageProp } from "../../functional/Image";
import DenyStamp from "./DenyStamp";
import { StreakOverlay } from "./StreakOverlay";
import StreakHandler from "../../functional/Streak";


/* Constants */
const WIDTH = Dimensions.get("window").width;

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: "other" } }, "Camera">,

    /* Navigation props */
    lsimage: LSImageProp
}
interface State {
    deactivateButtons: boolean,
    lsimage?: LSImageProp,

    confirmButtonY: Animated.Value,
    scrapButtonX: Animated.Value,
    imageX: Animated.Value,

    confirmButtonScale: Animated.Value,
    scrapButtonScale: Animated.Value,
    imageScale: Animated.Value,

    imageOpacity: Animated.Value,
    
    prev: number,
    curr: number,
}

/* Constants */
const ANIM_HIDE_CONFIG = { easing: Easing.in(Easing.exp), duration: 500, useNativeDriver: true };
const ANIM_SHOW_CONFIG = { easing: Easing.out(Easing.exp), duration: 500, useNativeDriver: true };

class Preview extends React.PureComponent<Props, State> {
    denyStamper: RefObject<DenyStamp> = React.createRef();
    streakOverlay: RefObject<StreakOverlay> = React.createRef();
    
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            deactivateButtons: false,

            confirmButtonY: new Animated.Value(200),
            scrapButtonX: new Animated.Value(-200),
            imageX: new Animated.Value(-WIDTH/2 - 50),

            confirmButtonScale: new Animated.Value(0.2),
            scrapButtonScale: new Animated.Value(0.2),
            imageScale: new Animated.Value(0.2),
            
            imageOpacity: new Animated.Value(1),
            prev: 0,
            curr: 0,
        };

        /* Bindings */
        this.introButtons = this.introButtons.bind(this);
        this.outroButtons = this.outroButtons.bind(this);
        this.introImage = this.introImage.bind(this);
        this.saveImage = this.saveImage.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onSave = this.onSave.bind(this);
        this.focus = this.focus.bind(this);
    };

    /* Lifetime */
    componentDidMount(): void {

        this.props.navigation.addListener("focus", this.focus);
        this.focus();
    }
    componentWillUnmount(): void {
    }
    async focus(): Promise<void> {
        this.setState({ lsimage: this.props.lsimage });
        this.introButtons();
        this.introImage();
    }

    /* Delete / save image */
    async onDelete(): Promise<void> {
        this.outroButtons();
        this.deleteImage();
    }
    async onSave(): Promise<void> {
        const sValue = await StreakHandler.tryIncrement();
        if (sValue) {
            this.setState({
                prev: sValue.streakCount - 1,
                curr: sValue.streakCount
            });
            setTimeout(() => this.streakOverlay.current?.animate(this.cameraScene), 400);
        }else {
            setTimeout(this.cameraScene, 600);
        }
        this.outroButtons();
        this.saveImage();
    }

    /** CAMERA SCENE WHOHOO */
    cameraScene = () => this.props.navigation.navigate("Camera", { comesFrom: "other" })

    /* Image animations */
    introImage(): void {
        Animated.timing(this.state.imageX, { ...ANIM_SHOW_CONFIG, toValue: 0, duration: 800 }).start();
        Animated.timing(this.state.imageScale, { ...ANIM_SHOW_CONFIG, toValue: 1, duration: 800 }).start();
        Animated.timing(this.state.imageOpacity, { ...ANIM_SHOW_CONFIG, toValue: 1, duration: 800 }).start();
    }
    saveImage(): void {
        Animated.timing(this.state.imageX, { ...ANIM_HIDE_CONFIG, toValue: WIDTH/2 + 50, duration: 600 }).start();
        Animated.timing(this.state.imageScale, { ...ANIM_HIDE_CONFIG, toValue: 0.2, duration: 600 }).start();
    }
    deleteImage(): void {
        this.denyStamper.current?.intro(() => {
            Animated.timing(this.state.imageOpacity, { toValue: 0, duration: 400, useNativeDriver: true }).start();
        }, () => {
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        });
    }

    /* Button animations */
    introButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...ANIM_SHOW_CONFIG, toValue: 0, delay: 100 }).start();
        Animated.timing(this.state.scrapButtonX, { ...ANIM_SHOW_CONFIG, toValue: 0, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonScale, { ...ANIM_SHOW_CONFIG, toValue: 1, delay: 190 }).start();
        Animated.timing(this.state.confirmButtonScale, { ...ANIM_SHOW_CONFIG, toValue: 1, delay: 40 }).start();
    }
    outroButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...ANIM_HIDE_CONFIG, toValue: 200, delay: 100 }).start();
        Animated.timing(this.state.scrapButtonX, { ...ANIM_HIDE_CONFIG, toValue: -200, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonScale, { ...ANIM_HIDE_CONFIG, toValue: 0.2, delay: 100 }).start();
        Animated.timing(this.state.confirmButtonScale, { ...ANIM_HIDE_CONFIG, toValue: 0.2, delay: 100 }).start();
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                {/* Display new streak */}
                <StreakOverlay
                    ref={this.streakOverlay}
                    curr={this.state.curr}
                    prev={this.state.prev}
                />

                {/* Deny stamp remove animation */}
                <DenyStamp ref={this.denyStamper} />

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

                    {/* Image */}
                    <View style={Styles.imageRow}>
                        <Animated.Image
                            style={[
                                Styles.image,
                                { transform: [
                                    { translateX: this.state.imageX },
                                    { scale: this.state.imageScale }
                                ] },
                                { opacity: this.state.imageOpacity }
                            ]}
                            source={{ uri: this.props.lsimage.path }}
                        />
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

                {/* Time, battery & more */}
                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
    const isFocused = useIsFocused();

    /* Soo dumb but react navigation caches this
        scene and animations don't play their intros
        so I have to do this... */
	return isFocused ? <Preview {...props} lsimage={props.route.params.lsimage} navigation={navigation} /> : null;
}
