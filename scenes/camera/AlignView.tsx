import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import { Animator } from "../../components/animator/Animator";
import MaskedView from "@react-native-masked-view/masked-view";
import Floater from "../../components/floater/Floater";

/* Constants */
const ANIMATION_CONFIG = { useNativeDriver: true, duration: 200, easing: Easing.inOut(Easing.exp) };
const CHECK_DELAY = 1000; // ms
/** Further away from 0 = less sensitive (used for
 * determening if tryIndicate() should "fire") */
const SENSITIVITY = 0.1;

/* Interfaces */
interface Props {
	scale: number,

	/** This will animate fade out or in */
	visible: boolean,
}
interface State {
	/** When the user has been to close / too
	 * far away from desired for a bit too long,
	 * we play a little scaling animation on the
	 * align-view-face to indicate that user needs
	 * to move closer / further away. */
	indicationScale: Animated.Value,

	/** x = top red bar, y = bottom red bar */
	animatedScale: Animated.Value,

	/** The interval which regularly checks wether
	 * user needs to move closer / further away */
	indicationIntervalID: null | any
}

export class AlignView extends React.PureComponent<Props, State> {
	animator: RefObject<Animator>;
	faceAnimator: RefObject<Animator>;
	fadedIn: boolean = false;

	hasIndicatedAway: boolean = false;
	hasIndicatedCloser: boolean = false;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			animatedScale: new Animated.Value(1),
			indicationScale: new Animated.Value(1),
			indicationIntervalID: null
		};

		/* Refs */
		this.animator = React.createRef();
		this.faceAnimator = React.createRef();

		/* Bindings */
		this.fadeIn = this.fadeIn.bind(this);
		this.fadeOut = this.fadeOut.bind(this);
		
		this.indicateMoveCloser = this.indicateMoveCloser.bind(this);
		this.indicateMoveAway = this.indicateMoveAway.bind(this);
		this.tryIndicate = this.tryIndicate.bind(this);
	}

	/* Lifetimme */
	componentDidMount(): void {
		this.setState({ indicationIntervalID: setInterval(this.tryIndicate, CHECK_DELAY) })
	}
	componentWillUnmount(): void {
		if (this.state.indicationIntervalID !== null) clearInterval(this.state.indicationIntervalID);
	}
	componentDidUpdate(prevProps: Readonly<Props>, _: Readonly<State>, __?: any): void {
		/* Animate scalings */
		if (prevProps.scale !== this.props.scale) Animated.spring(this.state.animatedScale, {
			toValue: this.props.scale,
			useNativeDriver: true,
			speed: 1000
		}).start();

		/* Fade in / out */
		if (this.props.visible && !this.fadedIn) this.fadeIn();
		else if (prevProps.visible !== this.props.visible) {
			if (this.props.visible) this.fadeIn();
			else this.fadeOut();
		}
	}

	/* Fade in / out */
	fadeIn(): void { this.fadedIn = true; this.animator.current?.fadeIn(200).start() }
	fadeOut(): void { this.fadedIn = false; this.animator.current?.fadeOut(200).start() }

	/* Indicate face move closer / further away */
	indicateMoveCloser(): void {
		this.indicateHaptic();

		Animated.sequence([
			Animated.timing(this.state.indicationScale, { toValue: 1.2, ...ANIMATION_CONFIG }),
			Animated.timing(this.state.indicationScale, { toValue: 1, ...ANIMATION_CONFIG }),
		]).start();
	}
	indicateMoveAway(): void {
		this.indicateHaptic();

		Animated.sequence([
			Animated.timing(this.state.indicationScale, { toValue: 0.8, ...ANIMATION_CONFIG }),
			Animated.timing(this.state.indicationScale, { toValue: 1, ...ANIMATION_CONFIG }),
		]).start();
	}
	indicateHaptic(): void {
		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
	}

	/** Try to indicate the user if they should move their
	 * head closer / further away. If user already is in 
	 * good position, we do not need to alert them.
	 * 
	 * This function will be called every {@link CHECK_DELAY} seconds */
	tryIndicate(): void {
		if (this.props.scale > 1 + SENSITIVITY && !this.hasIndicatedCloser) {
			this.indicateMoveCloser();
			this.hasIndicatedCloser = true;
			this.hasIndicatedAway = false;
		}else if (this.props.scale < 1 - SENSITIVITY  && !this.hasIndicatedAway) {
			this.indicateMoveAway();
			this.hasIndicatedCloser = false;
			this.hasIndicatedAway = true;
		}
	}

	render() {
		return (
			<Animator startOpacity={0} ref={this.animator} style={Styles.bottomBarTile}>
				{/* Background grid */}
				<Image style={Styles.alignGrid} source={require("../../assets/images/align/grid.png")} />

				{/* Extra 3d effect */}
				<Floater loosness={2} style={Styles.bottomBarTile}>
					<Animated.View style={[Styles.bottomBarTile, { transform: [{ scale: this.state.indicationScale }]}]}>
						<MaskedView
							style={Styles.alignFace}
							maskElement={<Image style={Styles.alignFaceMask} source={require("../../assets/images/masks/face-mask.png")} />}
						>
							{/* Background */}
							<View style={{
								width: "100%",
								height: "100%",
								position: "absolute",
								backgroundColor: "#ff5969",
							}} />

							{/* These two bars tell if you should move your
								head closer or further away from the screen */}
							<Animated.Image
								source={require("../../assets/images/align/face-filled.png")}
								style={{
									width: "100%", height: "100%",
									position: "absolute",
									objectFit: "contain"
								}}
							/>
						</MaskedView>
					</Animated.View>
				</Floater>
			</Animator>
		);
	}
}
