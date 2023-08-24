/* Imports */
import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Easing, Image, ImageSourcePropType, SafeAreaView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Styles from "./Styles";
import Poster from "../../components/poster/Poster";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Haptic from "expo-haptics";
import Floater from "../../components/floater/Floater";
import { LSImage, saveImage } from "../../functional/Image";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Result: { lsimage: LSImage }, Camera: undefined }, "Camera", "Result">,

    /* Navigation props */
    lsimage: LSImage
}
interface State {
    confirmButtonY: Animated.Value,
    scrapButtonX: Animated.Value,
}

/* Constants */
const BUTTON_HIDE_CONFIG = { easing: Easing.in(Easing.exp), duration: 500, useNativeDriver: true };
const BUTTON_SHOW_CONFIG = { easing: Easing.out(Easing.exp), duration: 500, useNativeDriver: true };

class Camera extends React.PureComponent<Props, State> {
    poster: RefObject<Poster>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            confirmButtonY: new Animated.Value(200),
            scrapButtonX: new Animated.Value(-200),
        };

        /* Bindings */
        this.onDelete = this.onDelete.bind(this);
        this.onSave = this.onSave.bind(this);

        /* Refs */
        this.poster = React.createRef();
    };

    /* Lifetime */
    componentDidMount(): void {
        Animated.timing(this.state.confirmButtonY, { ...BUTTON_SHOW_CONFIG, toValue: 0 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_SHOW_CONFIG, toValue: 0, delay: 150 }).start();
    }

    /* Delete / save image */
    onDelete(): void {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

        Animated.timing(this.state.confirmButtonY, { ...BUTTON_HIDE_CONFIG, toValue: 200, delay: 150 }).start();
        Animated.timing(this.state.scrapButtonX, { ...BUTTON_HIDE_CONFIG, toValue: -200 }).start();

        this.poster.current?.delete(() => {
            this.props.navigation.navigate("Camera");
        });
    }
    onSave(): void {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

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
                        <Floater loosness={5}><Poster
                            ref={this.poster}
                            date={2112}
                            source={{ uri: this.props.lsimage.path }}
                        /></Floater>
                    </View>
                </View>

                <View style={Styles.buttonRow}>
                    {/* Delete image */}
                    <View style={Styles.row}>
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
                    </View>

                    {/* Save image */}
                    <View style={Styles.row}>
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
  
	return <Camera {...props} lsimage={props.route.params.lsimage} navigation={navigation} />;
}
