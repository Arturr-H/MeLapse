/* Imports */
import React, { RefObject } from "react";
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Camera, CameraType, FaceDetectionResult, FlashMode, PermissionStatus } from "expo-camera";
import MaskedView from "@react-native-masked-view/masked-view";
import { Animator } from "../../components/animator/Animator";
import { FaceData, getFaceFeatures, getTransforms } from "../../functional/FaceDetection";
import { FaceDetectorClassifications, FaceDetectorLandmarks, FaceDetectorMode } from "expo-face-detector";
import { DebugDots } from "../../functional/Debug";
import { Button } from "../../components/button/Button";
import CalibrationData from "./CalibrationData";

/* Constants */
const ROLL_DEG_SENSITIVITY = 5;
const middleFace: FaceData = { "middle": {x:0,y:0},
    "bottomMouthPosition": {"x": 191.72916668653488, "y": 501.15625312924385},
    "bounds": {"origin": {"x": 54.70416218042374, "y": 281.23957923054695},
    "size": {"height": 275.31875905394554, "width": 275.31875905394554}},
    "deltaEye": {"x": 92.19583636522293, "y": 2.96041676402092},
    "deltaMouth": {"x": 76.12500250339508, "y": 2.1145834028720856},
    "faceID": 34,
    "leftCheekPosition": {"x": 129.56041464209557, "y": 445.7541679739952},
    "leftEarPosition": {"x": 98.68749696016312, "y": 411.4979168474674},

    "leftEyePosition": {"x": 149.01458194851875, "y": 383},
    "rightEyePosition": {"x": 239.21041831374168, "y": 383},

    "leftMouthPosition": {"x": 151.97499871253967, "y": 485},
    "rightMouthPosition": {"x": 228.10000121593475, "y": 485},

    "midEye": {"x": 195.11250013113022, "y": 385.06562431156635},
    "midMouth": {"x": 190.0374999642372, "y": 484.02812756597996},
    "noseBasePosition": {"x": 194.6895834505558, "y": 431.79791751503944},
    "rightCheekPosition": {"x": 256.8583354949951, "y": 449.56041809916496},
    "rightEarPosition": {"x": 294.92083674669266, "y": 411.075000166893},
    "rollAngle": 1.6910536289215088,
    "yawAngle": -0.7525003552436829
};

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Tutorial: undefined, Camera: { comesFrom: "other" } }, "Tutorial" | "Camera">,
}
interface State {
    source: string | null,
    cameraAvailable: PermissionStatus,

    /** Y value of the white area which makes whole 
        screen look white (transition into camera scene) */
    cutoutTransitioner: Animated.Value,

    /** Camera transforms to align face in middle */
    transforms: any[],

    /** To control head rolling to far indicators */
    headRoll: Animated.Value,
    rollLeftOpacity: Animated.Value,
    rollRightOpacity: Animated.Value,

    /** Is it either the save button or info text visible? */
    bottomVisible: "info" | "save",

    /** If you press "reset face calibration" in
     * preferences, you should be able to "cancel"
     * the calibration and return to camera scene.
     * But not if there's no face calibration already */
    canGoBack: boolean,
}

class Calibration extends React.PureComponent<Props, State> {
    camera: RefObject<Camera> = React.createRef();

    saveButton: RefObject<Animator> = React.createRef();
    infoText: RefObject<Animator> = React.createRef();
    
    rollRightVisible: boolean = false;
    rollLeftVisible: boolean = false;

    animator: RefObject<Animator> = React.createRef();
    faceCalibration: FaceData | null = null;

    /** We want to show the "save" button on the
     * first go but facedetector tries to hide it */
    firstShow: boolean = false;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            source: null,
            cameraAvailable: PermissionStatus.UNDETERMINED,
            transforms: [],
            headRoll: new Animated.Value(0),
            rollLeftOpacity: new Animated.Value(0),
            rollRightOpacity: new Animated.Value(0),

            cutoutTransitioner: new Animated.Value(-Dimensions.get("window").height),
            bottomVisible: "save",

            canGoBack: false,
        };

        /* Bindings */
        this.updateRollIndicators = this.updateRollIndicators.bind(this);
        this.saveCalibration = this.saveCalibration.bind(this);
        this.onFacesDetected = this.onFacesDetected.bind(this);
        this.toggleBottom = this.toggleBottom.bind(this);
        this.goBack = this.goBack.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        const req = await Camera.requestCameraPermissionsAsync();
        this.setState({ cameraAvailable: req.status });

        const canGoBack = (await CalibrationData.getCalibration()) !== null;
        this.setState({ canGoBack });

        this.props.navigation.addListener("focus", () => {
            this.animator.current?.fadeIn(100).start();
        })
    }

    /** Facedetection callback */
    onFacesDetected(faces: FaceDetectionResult): void {
        const _face = faces.faces[0];

        if (_face) {
            const face = getFaceFeatures(_face);
            let transforms = getTransforms(face, middleFace);
            this.setState({ transforms });

            /* Left eye positiom, right eye pos... */
            const [w, h] = [Dimensions.get("window").width, Dimensions.get("window").height];
            let [lep, rep, lmp, rmp, nose] = [
                face.leftEyePosition, face.rightEyePosition,
                face.leftMouthPosition, face.rightMouthPosition,
                face.noseBasePosition,
            ];

            /* Move to middle x */
            [lep, rep, lmp, rmp, nose].map(e => e.x += (w / 2 - (face.midEye.x + face.midMouth.x) / 2));
            
            /* Move to middle y */
            [lep, rep, lmp, rmp, nose].map(e => e.y += (h / 2 - (face.midEye.y + face.midMouth.y) / 2));

            /* The difference between the width between (∆eye x, ∆mouth x)  and (∆eye1y_mouth1y, ∆eye2y_mouth2y) */
            const heightDiff = (
                ((face.leftMouthPosition.y - face.leftEyePosition.y) +
                (face.rightMouthPosition.y - face.rightEyePosition.y)) / 2
            ) / ((face.deltaEye.x + face.deltaMouth.x) / 2);

            /* Get "width" of facial features */
            const deltaWidth = (face.deltaEye.x + face.deltaMouth.x) / 2;
            const middleFaceDeltaWidth = (middleFace.deltaEye.x + middleFace.deltaMouth.x) / 2;
            
            /* Get how far we need to transform eye and mouth
                positions on x and y axis (whilst keeping aspect ratio) */
            const dx = (middleFaceDeltaWidth - deltaWidth) / 2;
            const dy = dx * heightDiff;

            /* Rotate the points to not care about face roll */
            const rot_rad = -face.rollAngle / 180*Math.PI;
            [lep, rep, lmp, rmp].map(e => {
                const x_new = (e.x - w/2) * Math.cos(rot_rad) - (e.y - h/2) * Math.sin(rot_rad) + w/2;
                const y_new = (e.x - w/2) * Math.sin(rot_rad) + (e.y - h/2) * Math.cos(rot_rad) + h/2;

                e.x = x_new;
                e.y = y_new;
            });
            
            lep.x -= dx;
            rep.x += dx;
            lmp.x -= dx;
            rmp.x += dx;

            lep.y -= dy;
            rep.y -= dy;
            lmp.y += dy;
            rmp.y += dy;
            nose.y += dy;

            this.updateRollIndicators(face.rollAngle, true);

            /* Update face calibration */
            this.faceCalibration = face;
        }else {
            this.updateRollIndicators(0, false);
            this.toggleBottom("info");
            this.setState({ transforms: [] });
        }
    }

    /** Show roll right or left heads (not always) */
    updateRollIndicators(rollDeg: number, tryToggleBottom: boolean): void {
        /* Animate head roll */
        Animated.spring(this.state.headRoll, {
            toValue: rollDeg,
            speed: 100,
            useNativeDriver: true,
        }).start();

        const opt = { duration: 100, useNativeDriver: true }

        if (rollDeg > ROLL_DEG_SENSITIVITY) {
            if (!this.rollLeftVisible) {
                if (tryToggleBottom) this.toggleBottom("info");

                Animated.timing(
                    this.state.rollLeftOpacity,
                    { ...opt, toValue: 1 }
                ).start();
            }
            
            this.rollLeftVisible = true;
        }else if (rollDeg < -ROLL_DEG_SENSITIVITY) {
            if (!this.rollRightVisible) {
                if (tryToggleBottom) this.toggleBottom("info");

                Animated.timing(
                    this.state.rollRightOpacity,
                    { ...opt, toValue: 1 }
                ).start();
            }
            
            this.rollRightVisible = true;
        }else {
            /* Hide */
            if (this.rollLeftVisible) Animated.timing(
                this.state.rollLeftOpacity,
                { ...opt, toValue: 0 }
            ).start();
            if (this.rollRightVisible) Animated.timing(
                this.state.rollRightOpacity,
                { ...opt, toValue: 0 }
            ).start();

            if (((this.rollLeftVisible || this.rollRightVisible) && tryToggleBottom) || this.state.bottomVisible !== "save") this.toggleBottom("save");

            this.rollLeftVisible = false;
            this.rollRightVisible = false;
        }
    }

    /** Saves the calibration and switches scene (transition) */
    saveCalibration(): void {
        const calibration = this.faceCalibration;
        if (!calibration) return alert("Could not find face calibration. Make sure your face is visible in the middle of the screen.");

        /* Save */
        CalibrationData.setCalibration(calibration).then(_ => {
            this.animator.current?.fadeOut(300).start(() => {
                this.props.navigation.navigate("Tutorial");
            });
        });
    }

    /** Either display the info text or save button if calibration looks good */
    toggleBottom(to: "save" | "info"): void {
        this.setState({ bottomVisible: to });

        if (to === "info") {
            this.infoText.current?.fadeIn(140).start();
            this.saveButton.current?.fadeOut(140).start();
        }else {
            this.infoText.current?.fadeOut(140).start();
            this.saveButton.current?.fadeIn(140).start();
        }
    }

    /** Animate the face cutout to transition into camera scene */
    animateCutout(): void {
        Animated.timing(this.state.cutoutTransitioner, {
            toValue: 0,
            useNativeDriver: true,
            duration: 1000
        }).start();
    }

    /** Go back to camera scene */
    goBack(): void {
        if (this.state.canGoBack) {
            this.animator.current?.fadeOut(300).start(() => {
                this.props.navigation.navigate("Camera", { comesFrom: "other" });
            });
        }
    }

	render() {
        const rotation = { transform: [{ rotate: this.state.headRoll.interpolate({
            inputRange: [-360, 360],
            outputRange: ["-360deg", "360deg"]
        }) }] };
        const opacityLeft = { opacity: this.state.rollLeftOpacity };
        const opacityRight = { opacity: this.state.rollRightOpacity };

        if (this.state.cameraAvailable === PermissionStatus.DENIED) return <View style={Styles.container}><Text>Please enable camera to be able to use this app.</Text><Text>If you do that, restart the app 😄</Text></View>;

		return (
            <View style={Styles.mainContainer}>
                <Animator ref={this.animator} style={Styles.container}>
                    {this.state.canGoBack && <TouchableOpacity style={Styles.cancelButton} activeOpacity={0.5} onPress={this.goBack}>
                        <Text style={Styles.cancelButtonText}>← Cancel</Text>
                    </TouchableOpacity>}

                    {/* Face to indicate if user should tilt head to right / left */}
                    <View style={Styles.headerContainer}>
                        <Text style={[Styles.header, { textAlign: "center" }]}>Profile{"\n"}Calibration</Text>
                    </View>

                    <View style={Styles.cameraCutoutContainer}>
                        {/* Outline to smooth transition from mask to camera */}
                        <Image
                            style={Styles.middleFace}
                            source={require("../../assets/images/align/face-outline.png")}
                        />

                        <MaskedView
                            style={Styles.maskedView}
                            maskElement={<View style={Styles.maskContainer}><Image
                                style={Styles.maskImage}
                                source={require("../../assets/images/masks/face-mask.png")}
                            /></View>}
                        >
                            <View style={{ transform: [{ translateX: -5 }, { translateY: -5 }] }}>
                            {this.state.cameraAvailable === PermissionStatus.GRANTED && <Camera
                                type={CameraType.front}
                                style={[Styles.camera, { transform: this.state.transforms }]}
                                ref={this.camera}

                                onFacesDetected={this.onFacesDetected}
                                faceDetectorSettings={{
                                    mode: FaceDetectorMode.accurate,
                                    detectLandmarks: FaceDetectorLandmarks.all,
                                    runClassifications: FaceDetectorClassifications.all,
                                    minDetectionInterval: 5,
                                    tracking: true,
                                }}
                            />}
                            </View>
                        </MaskedView>

                        <View style={Styles.headTiltContainer}>
                            <Animated.Image style={[Styles.headTiltImage, rotation]} source={require("../../assets/images/align/face-filled.png")} />
                            <Animated.Image style={[Styles.headTiltImage, rotation, opacityLeft]} source={require("../../assets/images/tilt/tilt-left.png")} />
                            <Animated.Image style={[Styles.headTiltImage, rotation, opacityRight]} source={require("../../assets/images/tilt/tilt-right.png")} />
                        </View>
                    </View>

                    <View style={Styles.infoTextContainer}>
                        <Animator style={{ width: "100%" }} startOpacity={1} ref={this.infoText}><Text
                            style={Styles.infoText}
                            children={"Make sure your face is pointing straight at the camera, and try to keep your facial expressions neutral."}
                        /></Animator>

                        <Animator style={{ width: "100%" }} startOpacity={0} ref={this.saveButton} pointerEvents={"auto"}>
                            <Button color="blue" onPress={this.saveCalibration} text="Save" active={this.state.bottomVisible === "save"} />
                        </Animator>
                    </View>
                </Animator>
            </View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Calibration {...props} navigation={navigation} />;
}
