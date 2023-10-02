import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";

/* Interfaces */
interface Props {
	navigation: StackNavigationProp<{
		Preview: { lsimage: any },
		Preferences: undefined
	}, "Preview", "Preferences">,
	active: boolean,

	onAnimating: (is: boolean) => void
}
interface State {
	size: Animated.Value,
	opacity: Animated.Value,
	rotate: Animated.Value,
	animating: boolean
}

/* Constants */
const HEIGHT = Dimensions.get("window").height;
const DURATION = 800;
const DEFAULT_ = { easing: Easing.inOut(Easing.exp), useNativeDriver: true };
const BTN_FINAL_HEIGHT = (HEIGHT/Styles.menuButton.height) * 2.5;

export class MenuButton extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			size: new Animated.Value(BTN_FINAL_HEIGHT),
			opacity: new Animated.Value(0),
			animating: false,
			rotate: new Animated.Value(0),
		};

		/* Refs */

		/* Bindings */
		this.openPreferencesScene = this.openPreferencesScene.bind(this);
		this.instanSetBack = this.instanSetBack.bind(this);
		this.animateBack = this.animateBack.bind(this);
		this.onPress = this.onPress.bind(this);
	}

	async componentDidMount(): Promise<void> {
		this.isAnimating(false);
		Animated.timing(this.state.opacity, { duration: 750, toValue: 1, useNativeDriver: false }).start();
	}

	/** Scale down if going back from preferences scene */
	animateBack(): void {
		const OPT = {
			duration: DURATION,
			...DEFAULT_
		};
		Animated.parallel([
			Animated.timing(this.state.size, { ...OPT, toValue: 1 }),
			Animated.timing(this.state.opacity, { ...OPT, toValue: 1 }),
			Animated.timing(this.state.rotate, { ...OPT, toValue: 0 })
		]).start(() => 
			this.isAnimating(false)
		);
	}

	/** Instantly set back size without animation */
	instanSetBack(): void {
		this.isAnimating(false);
		this.setState({
			size: new Animated.Value(1),
			rotate: new Animated.Value(0)
		});
	}

	/* On click */
	onPress(): void {
		if(this.props.active) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
			this.isAnimating(true)
			
			/* Animate opacity and scale */
			Animated.parallel([
				Animated.timing(this.state.size, {
					toValue: BTN_FINAL_HEIGHT,
					duration: DURATION,
					...DEFAULT_
				}),
				Animated.timing(this.state.opacity, {
					toValue: 0,
					duration: DURATION,
					...DEFAULT_
				}),
				Animated.timing(this.state.rotate, {
					toValue: 180,
					duration: DURATION,
					...DEFAULT_
				}),
				
			]).start(this.openPreferencesScene);
		}
	}

	isAnimating(is: boolean): void {
		this.setState({ animating: is });
		this.props.onAnimating(is);
	}

	/* Switch scene after anim */
	openPreferencesScene(): void {
		this.props.navigation.navigate("Preferences");
	}

	render() {
		let transform = { transform: [{ scale: this.state.size }]};
		let zIndex = this.state.animating ? 60 : 3;
		let pointerEvents: "none" | "auto" = this.state.animating ? "none" : "auto";
		let opacity = this.state.opacity;
		let rotate = this.state.rotate.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] });

		return (
			<Animated.View style={[Styles.menuButton, { zIndex }, { pointerEvents }]}>
				<TouchableOpacity
					style={[transform, Styles.innerMenuButton]}
					onPress={this.onPress}
				/>
				<Animated.Text
					children={"⚙️"}
					style={[Styles.menuButtonIcon, { opacity, transform: [{ rotate }] }]}
				/>
			</Animated.View>
		);
	}
}
