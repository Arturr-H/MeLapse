import React, { RefObject } from "react";
import { Animated, Dimensions, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Styles, { OVERLAY_FEATURE_HEIGHT } from "./Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Haptics from "expo-haptics";
import { Animator } from "../../components/animator/Animator";
import MaskedView from "@react-native-masked-view/masked-view";
import Floater from "../../components/floater/Floater";
import { FaceData } from "../../functional/FaceDetection";

/* Types */
type Coordinate = { x: number, y: number };
type FeatureData = {
	translate: Coordinate,
	rotate: `${number}deg`,
	width: number
};

/* Interfaces */
interface Props {
	/** The calibrated facial features (static) */
	calibrated: FaceData | null,
}
interface State {
	/** The overlay width, rotation, and position */
	overlay?: {
		eyes: FeatureData,
		mouth: FeatureData,
	}
}

export class CalibratedOverlay extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
		};

		/* Refs */
		/* Bindings */
		this.updateCalib = this.updateCalib.bind(this);
	}

	/* Lifetimme */
	componentDidMount(): void {
		const cal = this.props.calibrated;
		if (cal) this.updateCalib(cal);
	}
	componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
		if (prevProps.calibrated !== this.props.calibrated && this.props.calibrated) {
			this.updateCalib(this.props.calibrated);
		}
	}
	componentWillUnmount(): void {
	}

	/** Updates the calibrated positions */
	updateCalib(calib: FaceData): void {
		this.setState({
			overlay: {
				eyes: this.getOverlayFeatureData(calib.leftEyePosition, calib.rightEyePosition, true),
				mouth: this.getOverlayFeatureData(calib.leftMouthPosition, calib.rightMouthPosition, false),
			}
		})
	}

	/** Gets transform for a specific feature */
	getOverlayFeatureData(left: Coordinate, right: Coordinate, needsDouble: boolean): FeatureData {
		const width = this.hypot(left, right) + OVERLAY_FEATURE_HEIGHT;
		const rotate = this.rotation(left, right)
		const translate = this.translate(left, needsDouble);

		return {
			width,
			rotate,
			translate
		}
	}
	hypot(c1: Coordinate, c2: Coordinate): number {
		return Math.sqrt(Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2));
	}
	rotation(c1: Coordinate, c2: Coordinate): `${number}deg` {
		const deg = -(Math.atan2(c1.x - c2.x, c1.y - c2.y) * 180 / Math.PI) + 90;
		return `${deg}deg`;
	}
	translate(c1: Coordinate, needsDouble: boolean): Coordinate {
		const d = needsDouble ? OVERLAY_FEATURE_HEIGHT : OVERLAY_FEATURE_HEIGHT/2;
		return { x: c1.x - d, y: c1.y - OVERLAY_FEATURE_HEIGHT / 2}
	}

	render() {
		if (!this.props.calibrated || !this.state.overlay) return;

		return (
			<View style={Styles.calibratedOverlayContainer}>
				<View
					style={[Styles.calibratedFeature, {
						width: this.state.overlay.eyes.width + OVERLAY_FEATURE_HEIGHT,
						transform: [
							{ translateX: this.state.overlay.eyes.translate.x },
							{ translateY: this.state.overlay.eyes.translate.y },
							{ rotate: this.state.overlay.eyes.rotate },
						],
					}]}
				/>
				<View
					style={[Styles.calibratedFeature, {
						width: this.state.overlay.mouth.width,
						transform: [
							{ translateX: this.state.overlay.mouth.translate.x },
							{ translateY: this.state.overlay.mouth.translate.y },
							{ rotate: this.state.overlay.mouth.rotate },
						],
					}]}
				/>
			</View>
		);
	}
}
