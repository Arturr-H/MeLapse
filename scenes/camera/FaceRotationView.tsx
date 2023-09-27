import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import { Animator } from "../../components/animator/Animator";
import MaskedView from "@react-native-masked-view/masked-view";
import Floater from "../../components/floater/Floater";
import { FaceData } from "../../functional/FaceDetection";
import { LinearGradient } from "expo-linear-gradient";

/* Constants */
const ANIMATION_CONFIG = { useNativeDriver: true, duration: 200, easing: Easing.inOut(Easing.exp) };
const GRADIENT_SENSITIVITY = 6; // deg

/* Interfaces */
interface Props {
	/** This will animate fade out or in */
	visible: boolean,

	/** Facial features */
	faceData: FaceData | null,
	calibrated: FaceData | null,
}
interface State {
	rotateX: Animated.Value,
	rotateY: Animated.Value,
	rotateZ: Animated.Value,

	gradient: {
		left: Animated.Value,
		right: Animated.Value,
		top: Animated.Value,
		bottom: Animated.Value,
	}
}

/** Indicates that user should move head to
 * point more straight at the camera */
export class FaceRotationView extends React.PureComponent<Props, State> {
	animator: RefObject<Animator>;
	fadedIn: boolean = false;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			rotateX: new Animated.Value(0),
			rotateY: new Animated.Value(0),
			rotateZ: new Animated.Value(0),

			gradient: {
				left: new Animated.Value(0),
				right: new Animated.Value(0),
				top: new Animated.Value(0),
				bottom: new Animated.Value(0),
			}
		};

		/* Refs */
		this.animator = React.createRef();

		/* Bindings */
		this.animateFaceRotation = this.animateFaceRotation.bind(this);
		this.resetFaceRotation = this.resetFaceRotation.bind(this);
		this.updateGradients = this.updateGradients.bind(this);
		this.fadeOut = this.fadeOut.bind(this);
		this.fadeIn = this.fadeIn.bind(this);
	}

	/* Lifetimme */
	componentDidMount(): void {
		this.fadeIn();
	}
	componentWillUnmount(): void {
	}
	componentDidUpdate(prevProps: Readonly<Props>, _: Readonly<State>, __?: any): void {
		if (prevProps.faceData !== this.props.faceData && this.props.faceData && this.props.calibrated) {
			this.animateFaceRotation(this.props.faceData, this.props.calibrated);
		}
	}

	/** Animate face */
	animateFaceRotation(faceData: FaceData, calibrated: FaceData): void {
		const common:any = { useNativeDriver: true, speed: 500 };

		/* Where nose lies on a scale from 0 - 1
			between eye y and mouth y */
		const noseYDiffCalib = 
				(calibrated.noseBasePosition.y - calibrated.midEye.y) /
				(calibrated.midMouth.y - calibrated.midEye.y);
		const noseYDiffLive = 
				(faceData.noseBasePosition.y - faceData.midEye.y) /
				(faceData.midMouth.y - faceData.midEye.y);

		const clamp = (n:number) => Math.max(Math.min(90, n), -90);
		const rotateX = clamp((noseYDiffCalib - noseYDiffLive) * 180 * 2);
		const rotateY = clamp(faceData.yawAngle*1.5 * 2);

		Animated.spring(this.state.rotateX, { toValue: rotateX, ...common }).start();
		Animated.spring(this.state.rotateY, { toValue: rotateY, ...common }).start();
		this.updateGradients(rotateX, rotateY, common);
	}

	/** Called externally. Reset face rotation
	 * when no faces are detected */
	resetFaceRotation(): void {
		const common:any = { useNativeDriver: true, speed: 1, toValue: 0 };
		
		Animated.spring(this.state.rotateX, common).start();
		Animated.spring(this.state.rotateY, common).start();

		this.updateGradients(0, 0, common);
	}

	/** Update gradients */
	updateGradients(rotateX: number, rotateY: number, common: any): void {
		Animated.spring(this.state.gradient.top, { toValue: rotateX / 75, ...common }).start();
		Animated.spring(this.state.gradient.bottom, { toValue: -rotateX / 75, ...common }).start();
		
		Animated.spring(this.state.gradient.left, { toValue: -rotateY / 75, ...common }).start();
		Animated.spring(this.state.gradient.right, { toValue: rotateY / 75, ...common }).start();
	}

	/* Fade in / out */
	fadeIn(): void { this.fadedIn = true; this.animator.current?.fadeIn(200).start() }
	fadeOut(): void { this.fadedIn = false; this.animator.current?.fadeOut(200).start() }

	/* Interpolate rotation values */
	interp(value: Animated.Value): Animated.AnimatedInterpolation<string> {
		return value.interpolate({
			inputRange: [-360, 360],
			outputRange: ["-360deg", "360deg"]
		});
	}

	render() {
		let rotateX = this.interp(this.state.rotateX);
		let rotateY = this.interp(this.state.rotateY);
		let rotateZ = this.interp(this.state.rotateZ);

		return (
			<Animator startOpacity={0} ref={this.animator} style={Styles.faceRotationViewContainer}>
				{/* Background grid */}
				<Image style={Styles.alignGrid} source={require("../../assets/images/align/grid.png")} />

				{/* Extra 3d effect */}
				<Floater loosness={2} style={Styles.bottomBarTile}>

					{/* Face which is rotating in 3d */}
					<Animated.View
						style={[Styles.faceRotationImageContainer, { transform: [
							{ rotateX }, { rotateY }, { rotateZ }
						] }]}
					>
						<MaskedView
							style={Styles.rotationMaskedView}
							maskElement={<Image
								style={Styles.rotationMaskElement}
								source={require("../../assets/images/masks/face-mask.png")}
							/>}
						>
							<Image
								style={Styles.faceRotationImage}
								source={require("../../assets/images/align/face-filled.png")}
							/>

							{/* Height */}
							<Animated.View style={[Styles.gradientOverlayContainer, { opacity: this.state.gradient.top }]}><LinearGradient style={Styles.gradientOverlay} colors={["#222222ff", "#22222200"]} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} /></Animated.View>
							<Animated.View style={[Styles.gradientOverlayContainer, { opacity: this.state.gradient.bottom }]}><LinearGradient style={Styles.gradientOverlay} colors={["#222222ff", "#22222200"]} locations={[0, 1]} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }} /></Animated.View>

							{/* Width */}
							<Animated.View style={[Styles.gradientOverlayContainer, { opacity: this.state.gradient.left }]}><LinearGradient style={Styles.gradientOverlay} colors={["#555555ff", "#55555500"]} locations={[0, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} /></Animated.View>
							<Animated.View style={[Styles.gradientOverlayContainer, { opacity: this.state.gradient.right }]}><LinearGradient style={Styles.gradientOverlay} colors={["#555555ff", "#55555500"]} locations={[0, 1]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} /></Animated.View>
						</MaskedView>
					</Animated.View>
				</Floater>
			</Animator>
		);
	}
}
