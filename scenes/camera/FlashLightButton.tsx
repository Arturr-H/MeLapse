import React from "react";
import { Animated, Easing, PanResponder, PanResponderInstance, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import * as Haptics from "expo-haptics";
import * as Brightness from "expo-brightness";

/* Interfaces */
interface Props {
	onChange: (value: number) => void
}
interface State {
	scaleY: Animated.Value,
	panY: Animated.Value,

	prevOffsetY: number,

	active: boolean
}

export default class FlashLightButton extends React.PureComponent<Props, State> {
	panResponder: PanResponderInstance;
	startTime: number = 0;
	brightnessPermission: boolean = false;

	/**	There are two diffrent types of ways to change the
		brightness of this flashlight. First one you only
		need to click to toggle it. It cycles between 0 and
		1. You can also drag the flashlight button up to get
		a value between 0 and 1. However if you release the
		button it thinks it's a press therefore we need this */
	changeType: "drag" | "click" = "click";

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			scaleY: new Animated.Value(0),
			panY: new Animated.Value(0),
			prevOffsetY: 0,
			active: false,
		};

		/* Bindings */
		this.onTouchEnd = this.onTouchEnd.bind(this);
		this.onTouchStart = this.onTouchStart.bind(this);

		this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
				this.changeState("changing");
            },
			onPanResponderMove: async (event, gestureState) => {
				const { dy } = gestureState;
				const clampedDy = Math.min(Math.max(dy, -160), 0);

				const isNotMaxed = clampedDy !== -160 && clampedDy !== 0;
				if (Math.round(clampedDy) % 4 == 0 && isNotMaxed) Haptics.selectionAsync();

				const val = clampedDy / -160;
				this.props.onChange(val);
				if (this.changeType !== "drag") this.changeType = "drag";
			
				// Animate the value
				Animated.timing(this.state.panY, {
					toValue: clampedDy,
					useNativeDriver: true,
					duration: 0
				}).start();
			},
            onPanResponderRelease: async (event, gestureState) => {
				const { dy } = gestureState;
				const clampedDy = Math.min(Math.max(dy, -160), 0);

				const val = clampedDy / -160;

				if (val !== 0) 
					this.setState({ active: true });
				else 
					this.setState({ active: false });

				this.props.onChange(val);
				if (this.brightnessPermission) await Brightness.setBrightnessAsync(1);
				this.changeState("static");
            },
        });
	}

	async componentDidMount(): Promise<void> {
		const { status: brightnessStatus } = await Brightness.requestPermissionsAsync();
		if (brightnessStatus === "granted") {
			this.brightnessPermission = true;
		}
	}

	changeState(state: "static" | "changing"): void {
		const conf = {
			duration: 200,
			easing: Easing.inOut(Easing.exp),
			useNativeDriver: true
		};
		if (state === "changing") {
			Animated.timing(this.state.scaleY, {
				toValue: 4,
				...conf
			}).start()
		}else {
			Animated.timing(this.state.scaleY, {
				toValue: 0,
				...conf
			}).start();

			Animated.timing(this.state.panY, {
				toValue: { x: 0, y: 0 },
				...conf
			}).start();
		}
	}

	async onTouchEnd(): Promise<void> {
		if (this.changeType === "click") {
			let active = this.state.active ? false:true;
			this.setState({ active });
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			
			if (active) this.props.onChange(1);
			else this.props.onChange(0);
			if (this.brightnessPermission && active) {
				const { status } = await Brightness.getPermissionsAsync();
				if (status === "granted") {
					await Brightness.setBrightnessAsync(1);
				}
			}
		}
	}
	onTouchStart(): void {
		this.changeType = "click";
	}

	render() {
		let scaleY = { transform: [{ translateY: 20 }, { scaleY: this.state.scaleY }, { translateY: -20 }] };
		let translateY = { transform: [{ translateY: this.state.panY }] };

		return (
			<View onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} {...this.panResponder.panHandlers} style={Styles.flashlightButtonContainer}>
				<View style={{ transform: [{ translateY: -15 }] }}>
					<Animated.View style={[Styles.flashlightButtonBgLine, scaleY]} />
				</View>

				<Animated.View style={[Styles.flashlightButton, translateY]}>
					<Text style={Styles.flashlightButtonIcon}>🔦</Text>
				</Animated.View>
			</View>
		);
	}
}
