import React, { RefObject } from "react";
import { Animated, Image, View } from "react-native";
import Styles from "./Styles";
import { FaceData } from "../../functional/FaceDetection";
import { Animator } from "../../components/animator/Animator";

/* Interfaces */
interface Props {
    facialFeatures: FaceData | null,
    calibration: FaceData | null,
    sensitivity: number,
    anyFaceVisible: boolean
}
interface State {
    rotation: Animated.Value
}

export class TiltOverlay extends React.PureComponent<Props, State> {
    isFadedOut: boolean = true;

    /* Refs */
    animator: RefObject<Animator> = React.createRef();

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            rotation: new Animated.Value(0)
		};

		/* Bindings */
        this.getPitchAngle = this.getPitchAngle.bind(this);
        this.snapArrow = this.snapArrow.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
	}

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        /* Sumn changed */
        if (
            this.props.facialFeatures // current
            && prevProps.facialFeatures // previous
            && this.props.calibration // calibration exists
        ) {
            this.snapArrow(prevProps);
        }

        /* Change arrow visibility */
        if (this.props.anyFaceVisible !== prevProps.anyFaceVisible) {
            if (this.props.anyFaceVisible) this.fadeIn();
            else this.fadeOut();
        }
    }

    /** Snap to rotation */
    snapArrow(prevProps: Props): void {
        const SENSITIVITY = this.props.sensitivity;
        const SENSITIVITY_OUT = this.props.sensitivity / 2;
        const YAW = this.props.facialFeatures!.yawAngle * 3;
        const PITCH = this.getPitchAngle(this.props.facialFeatures);
        
        const PREV_YAW = prevProps.facialFeatures!.yawAngle * 3;
        const PREV_PITCH = this.getPitchAngle(prevProps.facialFeatures);;

        const CLAMP = (n: number, sens: number) => {
            if (n < sens && n > -sens)
                return 0;
            else
                return n;
        }


        /** Yaw and pitch */
        const animateArrow = (): void => {
            let [z, o] = [CLAMP(YAW, SENSITIVITY), CLAMP(PITCH, SENSITIVITY)];
            let [p_z, p_o] = [CLAMP(PREV_YAW, SENSITIVITY), CLAMP(PREV_PITCH, SENSITIVITY)];
            const currentRotation = (Math.atan2(z, o) * 180 / Math.PI) - 90;
            const prevRotation = (Math.atan2(p_z, p_o) * 180 / Math.PI) - 90;

            const shouldFadeIn = z !== 0 || o !== 0;
            if (shouldFadeIn) this.fadeIn();

            /* Rotate */
            const delta = currentRotation - prevRotation;
            const bigDelta = delta > 180;

            Animated.spring(this.state.rotation, {
                /* @ts-ignore */
                toValue: currentRotation,
                useNativeDriver: true,
                speed: bigDelta ? 1000000 : 100,
                bounciness: 0
            }).start();
        }

        const YAW_CHANGED = YAW > SENSITIVITY || YAW < -SENSITIVITY;
        const PITCH_CHANGED = PITCH > SENSITIVITY || PITCH < -SENSITIVITY;

        /* Fade out */
        if (CLAMP(YAW, SENSITIVITY_OUT) === 0 && CLAMP(PITCH, SENSITIVITY_OUT) === 0)
            this.fadeOut();

        animateArrow();
    }

    /* Fade in / out */
    fadeIn(): void {
        if (this.isFadedOut) {
            this.isFadedOut = false;
            this.animator.current?.fadeIn(50).start();
        }
    }
    fadeOut(): void {
        if (!this.isFadedOut) {
            this.animator.current?.fadeOut(50).start();
            this.isFadedOut = true;
        }
    }

    /** Gets the pitch angle of users face.
     * Pitch isn't a field in the `FaceDetectionResult`
     * interface returned by google vision ML, so I made
     * this "algoritm" to determine pitch angle */
    getPitchAngle(faceData: FaceData | null): number {
        const calibrated = this.props.calibration;
        if (!calibrated || !faceData) return 0;

		/* Where nose lies on a scale from 0 - 1
			between eye y and mouth y */
		const noseYDiffCalib = 
                (calibrated.noseBasePosition.y - calibrated.midEye.y) /
                (calibrated.midMouth.y - calibrated.midEye.y);
        const noseYDiffLive = 
                (faceData.noseBasePosition.y - faceData.midEye.y) /
                (faceData.midMouth.y - faceData.midEye.y);

        const rotateX = (noseYDiffCalib - noseYDiffLive) * 180;
        return rotateX;
    }

	render() {
        let rotation = { transform: [{ rotate: this.state.rotation.interpolate({
            inputRange: [-360, 360],
            outputRange: ["-360deg", "360deg"],
        }) }] };

		return (
            <Animator ref={this.animator} startOpacity={0} style={Styles.tiltOverlayContainer}>
                <Animated.Image
                    style={[Styles.tiltOverlayArrow, rotation]}
                    source={require("../../assets/images/align/arrow.png")}
                />
            </Animator>
		);
	}
}
