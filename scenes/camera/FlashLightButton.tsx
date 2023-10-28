import React from "react";
import { Animated, Dimensions, Easing, PanResponder, PanResponderInstance, Text, View } from "react-native";
import Styles from "./Styles";
import * as Haptics from "expo-haptics";
import * as Brightness from "expo-brightness";

/* Constants */
const DURATION = 800;
const DEFAULT_ = { easing: Easing.inOut(Easing.exp), useNativeDriver: true };

/* Interfaces */
interface Props {
	onChange: (value: number) => void,
	setFlashlightActive: (to: boolean) => void
}
interface State {
	scaleY: Animated.Value,
	panY: Animated.Value,
	x: Animated.Value,

	prevOffsetY: number,

	active: boolean
}

export default class FlashLightButton extends React.PureComponent<Props, State> {
	panResponder: PanResponderInstance;
	startTime: number = 0;
	brightnessPermission: boolean = false;

	/** What the user has set as brightness, so
	 * we can revert changes after taking pic
	 * with flashlight (value between 0 - 1) */
	userPreviousBrightness: number = 0;

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
			x: new Animated.Value(0),
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

				if (val !== 0) {
					this.setState({ active: true });
					if (this.brightnessPermission) await Brightness.setBrightnessAsync(0);
				}else {
					this.setState({ active: false });
					if (this.brightnessPermission) await Brightness.setBrightnessAsync(1);
				}

				this.props.onChange(val);
				this.changeState("static");
            },
        });
	}

	async componentDidMount(): Promise<void> {
		const { status: brightnessStatus } = await Brightness.requestPermissionsAsync();
		if (brightnessStatus === "granted") {
			this.userPreviousBrightness = await Brightness.getBrightnessAsync();
			this.brightnessPermission = true;

			Brightness.addBrightnessListener(e => {
				this.userPreviousBrightness = e.brightness;
			})
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
			this.props.setFlashlightActive(active);
			this.setState({ active });
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			
			if (active) this.props.onChange(1);
			else this.props.onChange(0);
			if (this.brightnessPermission && active) {
				await Brightness.setBrightnessAsync(1);
			}else {
				await Brightness.setBrightnessAsync(this.userPreviousBrightness);
			}
		}
	}
	onTouchStart(): void {
		this.changeType = "click";
	}

	/** Called externally. Resets the phone brightness */
	async resetBrightness(): Promise<void> {
		await Brightness.setSystemBrightnessAsync(this.userPreviousBrightness);
	}

	/** Moves away out of screen */
	moveAway(): void {
		Animated.timing(this.state.x, {
			...DEFAULT_,
			duration: DURATION,
			toValue: Dimensions.get("window").width / 3
		}).start();
	}
	setbackMoveAway(): void {
		this.setState({ x: new Animated.Value(0) });
	}

	render() {
		let scaleY = { transform: [{ translateY: 20 }, { scaleY: this.state.scaleY }, { translateY: -20 }] };
		let translateY = { transform: [{ translateY: this.state.panY }] };
		let x = [{ translateX: this.state.x }];

		return (
			<Animated.View
				{...this.panResponder.panHandlers}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				style={[
					Styles.flashlightButtonContainer,
					{ transform: x }
				]}
			>
				<View style={{ transform: [{ translateY: -15 }] }}>
					<Animated.View style={[Styles.flashlightButtonBgLine, scaleY]} />
				</View>

				<Animated.View style={[Styles.flashlightButton, translateY]}>
					<Text style={Styles.flashlightButtonIcon}>🔦</Text>
				</Animated.View>
			</Animated.View>
		);
	}
}
