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
import Background from "./Background";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Result: { lsimage: LSImageProp }, Camera: { comesFrom: "other" } }, "Camera", "Result">,

    /* Navigation props */
    lsimage: LSImageProp
}
interface State {
    confirmButtonY: Animated.Value,
    scrapButtonX: Animated.Value,

    deactivateButtons: boolean,
    lsimage?: LSImageProp
}

/* Constants */
const BUTTON_HIDE_CONFIG = { easing: Easing.in(Easing.exp), duration: 500, useNativeDriver: true };
const BUTTON_SHOW_CONFIG = { easing: Easing.out(Easing.exp), duration: 500, useNativeDriver: true };
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

class Preview extends React.PureComponent<Props, State> {
    poster: RefObject<Poster> = React.createRef();
    background: RefObject<Background> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            confirmButtonY: new Animated.Value(200),
            scrapButtonX: new Animated.Value(-200),
            deactivateButtons: false,
        };

        /* Bindings */
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
    onFocus(): void {
        this.introButtons();
        this.setState({ lsimage: this.props.lsimage });
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
            this.poster.current?.delete(navigate);
        }else {
            navigate();
        }
    }
    async onSave(): Promise<void> {
        if (this.props.lsimage) {
            this.setState({ deactivateButtons: true });

            /* Save the image to fs */
            await LSImage.fromLSImageProp(this.props.lsimage).saveAsync();

            /* Animations */
            Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
            this.background.current?.fadeOut();
            this.outroButtons();

            if (this.poster.current) {
                this.poster.current?.save(() => {
                    this.props.navigation.navigate("Result", { lsimage: this.props.lsimage });
                });
            }
        }else {
            alert("No image found.");
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        }
    }

    /* Button animations */
    introButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_SHOW_CONFIG, toValue: 0 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_SHOW_CONFIG, toValue: 0, delay: 150 }).start();
    }
    outroButtons(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_HIDE_CONFIG, toValue: 200 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_HIDE_CONFIG, toValue: -200, delay: 150 }).start();
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                {/* Background */}
                <Background ref={this.background} />

                <View style={Styles.posterContainer}>
                    <View style={Styles.absolute}>
                        {/* Poster (image preview) */}
                        {this.state.lsimage && <Floater loosness={3}><Poster lsimage={this.state.lsimage} ref={this.poster} /></Floater>}
                    </View>
                </View>

                <View style={Styles.buttonRow}>
                    {/* Delete image */}
                    <Floater loosness={1} style={Styles.row}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Styles.deleteButton, { transform: [{
                                translateX: this.state.scrapButtonX
                            }] }]}
                            onPress={!this.state.deactivateButtons ? this.onDelete : () => {}}
                        >
                            {this.state.deactivateButtons
                                ? <ActivityIndicator color={"white"} />
                                : <Text style={Styles.deleteButtonText}>👎</Text>
                            }
                        </TouchableOpacity>
                    </Floater>

                    {/* Save image */}
                    <Floater loosness={1} style={Styles.row}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Styles.acceptButton, { transform: [{
                                translateY: this.state.confirmButtonY
                            }] }]}
                            onPress={!this.state.deactivateButtons ? this.onSave : () => {}}
                        >
                            {this.state.deactivateButtons
                                ? <ActivityIndicator color={"white"} />
                                : <Text style={Styles.acceptButtonText}>SAVE →</Text>
                            }
                        </TouchableOpacity>
                    </Floater>
                </View>

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
