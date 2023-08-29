import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";

/* Interfaces */
interface Props {
	navigation: StackNavigationProp<{
		Preview: { lsimage: any },
		Preferences: undefined
	}, "Preview", "Preferences">,
}
interface State {
	size: Animated.Value,
	opacity: Animated.Value,
	animating: boolean
}

/* Constants */
const HEIGHT = Dimensions.get("window").height;
const DURATION = 1250;
const DEFAULT_ = { easing: Easing.inOut(Easing.exp), useNativeDriver: true };
const BTN_FINAL_HEIGHT = (HEIGHT/Styles.menuButton.height) * 2.5;

export class MenuButton extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			size: new Animated.Value(BTN_FINAL_HEIGHT),
			opacity: new Animated.Value(0),
			animating: false
		};

		/* Refs */

		/* Bindings */
		this.openPreferencesScene = this.openPreferencesScene.bind(this);
		this.instanSetBack = this.instanSetBack.bind(this);
		this.animateBack = this.animateBack.bind(this);
		this.onPress = this.onPress.bind(this);
	}

	async componentDidMount(): Promise<void> {
		this.setState({ animating: false });
	}

	/** Scale down if going back from preferences scene */
	animateBack(): void {
		const OPT = {
			duration: DURATION,
			...DEFAULT_
		};
		Animated.parallel([
			Animated.timing(this.state.size, { ...OPT, toValue: 1 }),
			Animated.timing(this.state.opacity, { ...OPT, toValue: 1 })
		]).start();
	}

	/** Instantly set back size without animation */
	instanSetBack(): void {
		this.setState({ size: new Animated.Value(1) });
	}

	/* On click */
	onPress(): void {
		this.setState({ animating: true });

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
			})
		]).start(this.openPreferencesScene);
	}

	/* Switch scene after anim */
	openPreferencesScene(): void {
		this.props.navigation.navigate("Preferences");
	}

	render() {
		let transform = { transform: [{ scale: this.state.size }]};
		let zIndex = this.state.animating ? 20 : 3;
		let pointerEvents: "none" | "auto" = this.state.animating ? "none" : "auto";
		let opacity = this.state.opacity;

		return (
			<Animated.View style={[Styles.menuButton, { zIndex }, { pointerEvents }]}>
				<TouchableOpacity
					style={[transform, Styles.innerMenuButton]}
					onPress={this.onPress}
				/>
				<Animated.Text
					children={"⚙️"}
					style={[Styles.menuButtonIcon, { opacity }]}
				/>
			</Animated.View>
		);
	}
}
