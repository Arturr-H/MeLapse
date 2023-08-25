/* Imports */
import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Dimensions, Easing, Image, ImageSourcePropType, SafeAreaView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptic from "expo-haptics";
import Floater from "../../components/floater/Floater";
import { LSImage, saveImage } from "../../functional/Image";
import { Animator } from "../../components/animator/Animator";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Result: { lsimage: LSImage }, Camera: undefined }, "Camera", "Result">,

    /* Navigation props */
    lsimage: LSImage
}
interface State {
    confirmButtonY: Animated.Value,
    scrapButtonX: Animated.Value,
    bgTranslateY: Animated.Value,
}

/* Constants */
const BUTTON_HIDE_CONFIG = { easing: Easing.in(Easing.exp), duration: 500, useNativeDriver: true };
const BUTTON_SHOW_CONFIG = { easing: Easing.out(Easing.exp), duration: 500, useNativeDriver: true };
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

class Camera extends React.PureComponent<Props, State> {
    poster: RefObject<Poster>;
    background: RefObject<Animator>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            confirmButtonY: new Animated.Value(200),
            scrapButtonX: new Animated.Value(-200),
            bgTranslateY: new Animated.Value(-HEIGHT)
        };

        /* Bindings */
        this.onDelete = this.onDelete.bind(this);
        this.onSave = this.onSave.bind(this);

        /* Refs */
        this.background = React.createRef();
        this.poster = React.createRef();
    };

    /* Lifetime */
    componentDidMount(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_SHOW_CONFIG, toValue: 0 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_SHOW_CONFIG, toValue: 0, delay: 150 }).start();
        this.background.current?.fadeIn(1000).start();

        Animated.loop(Animated.timing(this.state.bgTranslateY, {
            toValue: 0,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true
        })).start();
    }

    /* Delete / save image */
    onDelete(): void {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

        Animated.timing(this.state.confirmButtonY, { ...BUTTON_HIDE_CONFIG, toValue: 200, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_HIDE_CONFIG, toValue: -200 }).start();
        this.background.current?.fadeOut(500).start();

        this.poster.current?.delete(() => {
            this.props.navigation.navigate("Camera");
        });
    }
    onSave(): void {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

        this.background.current?.fadeOut(500).start();
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_HIDE_CONFIG, toValue: 200 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_HIDE_CONFIG, toValue: -200, delay: 150 }).start();

        this.poster.current?.save(() => {
			saveImage(this.props.lsimage.path).then(() => {
                this.props.navigation.navigate("Result", { lsimage: this.props.lsimage });
            });
        });
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <View style={Styles.posterContainer}>
                    <View style={Styles.absolute}>
                        {/* Poster (image preview) */}
                        <Floater loosness={3}><Poster
                            ref={this.poster}
                            date={new Date().getTime()}
                            source={{ uri: this.props.lsimage.path }}
                        /></Floater>
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
                            onPress={this.onDelete}
                        >
                            <Text style={Styles.deleteButtonText}>
                                👎
                            </Text>
                        </TouchableOpacity>
                    </Floater>

                    {/* Save image */}
                    <Floater loosness={1} style={Styles.row}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[Styles.acceptButton, { transform: [{
                                translateY: this.state.confirmButtonY
                            }] }]}
                            onPress={this.onSave}
                        >
                            <Text style={Styles.acceptButtonText}>
                                Yea 👍
                            </Text>
                        </TouchableOpacity>
                    </Floater>
                </View>

                {/* Background */}
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

                            transform: [{ rotate: "90deg" }, { translateX: this.state.bgTranslateY }],
                            color: "#eee",
                            fontFamily: "inter-black",
                            
                        }}>SAVE?{"  "}SAVE?{"  "}SAVE?</Animated.Text>
                    </Animator>
                </Floater>

                {/* Time, battery & more */}
                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Camera {...props} lsimage={props.route.params.lsimage} navigation={navigation} />;
}
