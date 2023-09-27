import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, SafeAreaView, View } from "react-native";
import Styles from "./Styles";
import { CameraType, Camera as ExpoCamera, FaceDetectionResult, PermissionStatus } from "expo-camera"
import * as Haptic from "expo-haptics";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Floater from "../../components/floater/Floater";
import * as FaceDetector from "expo-face-detector";
import { LSImage, LSImageProp } from "../../functional/Image";
import { FlipType, manipulateAsync } from "expo-image-manipulator";
import { FaceData, getFaceFeatures, getTransforms } from "../../functional/FaceDetection";
import { DebugDots } from "../../functional/Debug";
import { PictureManipulator } from "./PictureManipulator";
import { ProgressView } from "../../components/progressView/ProgressView";
import { MenuButton } from "./MenuButton";
import AppConfig from "../preferences/Config";
import { ShutterButton } from "./ShutterButton";
import FlashLightButton from "./FlashLightButton";
import CalibrationData from "../calibration/CalibrationData";
import { CalibratedOverlay } from "./CalibratedOverlay";
import { FaceRotationView } from "./FaceRotationView";

/* Interfaces */
interface Props {
	navigation: StackNavigationProp<{ Preview: { lsimage: LSImageProp }, Preferences: undefined }, "Preview", "Preferences">,
	isFocused: boolean,

	/**
	 * Is used to determine which intro animation to play
	 * in the `Camera` scene. If we're going back from preferences
	 * the `MenuButton` needs to scale down, and if we're
	 * coming back from any other scene it has to be the 
	 * camera button.
	*/
	comesFrom: "preferences" | "other"
}
interface State {
	/** User needs to allow app to use camera */
	cameraAllowed: boolean,

	/** Needed for scaling into transition */
	cameraButtonScale: Animated.Value,
	cameraButtonInnerScale: Animated.Value,

	/** Needed when scaling button, because we don't want it to scale with the rim */
	cameraButtonPadding: number,

	/* Animated values */
	yawAngle: Animated.Value,
	rollAngle: Animated.Value,

	transform: any[],

	/** If there are any faces visible on screen */
	anyFaceVisible: boolean,

	/** If the camera button / menu button is animating */
	animating: boolean,
	loadingImage: boolean,
	debugTransformCamera: any[],
	transformCamera: boolean,

	/** Facial features, used for `FaceRotationView` */
	facialFeatures: FaceData | null,

	flashlightOpacity: Animated.Value
}

class Camera extends React.PureComponent<Props, State> {
	pictureManipulator : RefObject<PictureManipulator> = React.createRef();;
	camera             : RefObject<ExpoCamera> = React.createRef();;
	debug              : RefObject<DebugDots> = React.createRef();;
	debugOutside       : RefObject<DebugDots> = React.createRef();;
	menuButton         : RefObject<MenuButton> = React.createRef();;
	faceRotationView   : RefObject<FaceRotationView> = React.createRef();;

	/** Face calibration metadata */
	calibration: FaceData | null = null;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			cameraAllowed: false,
			cameraButtonScale: new Animated.Value(24),
			cameraButtonInnerScale: new Animated.Value(1),
			cameraButtonPadding: 0,

			yawAngle: new Animated.Value(0),
			rollAngle: new Animated.Value(0),
			flashlightOpacity: new Animated.Value(0),

			transform: [],
			facialFeatures: null,

			animating: true,

			loadingImage: false,
			debugTransformCamera: [],
			transformCamera: false,
			anyFaceVisible: false,
		};

		/* Bindings */
		this.setFlashlightBrightness = this.setFlashlightBrightness.bind(this);
		this.setFaceMetadata = this.setFaceMetadata.bind(this);
		this.onFacesDetected = this.onFacesDetected.bind(this);
		this.gainedFocus = this.gainedFocus.bind(this);
		this.takePic = this.takePic.bind(this);
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		// const a = await fs.readdir(DocumentDirectoryPath);
		// for (const b of a) {
		// 	const c = DocumentDirectoryPath + "/" + b;
		// 	fs.unlink(c);
		// }
		// await AsyncStorage.setItem("imagePointers", JSON.stringify([]));

		await this.setFaceMetadata();
		this.animateIntro();
		AppConfig.getTransformCamera().then(e => this.setState({ transformCamera: e }));

		/* Get camera permission */
		const { status } = await ExpoCamera.requestCameraPermissionsAsync();
		this.setState({ cameraAllowed: status === PermissionStatus.GRANTED });
	}

	/* Called via the export default function (navigation handler) */
	gainedFocus(): void {
		AppConfig.getTransformCamera().then(e => this.setState({ transformCamera: e }));
		this.animateIntro();
		this.setState({ anyFaceVisible: true });
	}

	/** Animates the right intro depending on which scene we previously left */
	animateIntro(): void {
		this.setState({ animating: true });

		const backMenuButton = () => {
			this.setState({ cameraButtonScale: new Animated.Value(1), cameraButtonPadding: 4, animating: false });
			this.menuButton.current?.animateBack();
		}
		const backCameraButton = () => {
			this.menuButton.current?.instanSetBack();

			Animated.sequence([
				Animated.timing(this.state.cameraButtonScale, {
					toValue: 24,
					duration: 0,
					useNativeDriver: true,
				}),
				Animated.timing(this.state.cameraButtonScale, {
					toValue: 1,
					duration: 700,
					easing: Easing.inOut(Easing.exp),
					useNativeDriver: true,
				})
			]).start(() => this.setState({ cameraButtonPadding: 4 }));

			setTimeout(() =>
				this.setState({ animating: false })
			, 1000);
		}

		/* Menu button */
		if (this.props.comesFrom === "preferences") backMenuButton()

		/* Camera button */
		else backCameraButton();
	}

	/* Take pic */
	async takePic(): Promise<void> {
		const transform = [...this.state.transform]; // clone transform

		/* Freeze camera */
		this.camera.current?.pausePreview();

		/* Haptic */
		Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
		this.setState({ loadingImage: true });

		/* Take camera picture */
		const image = await this.camera.current?.takePictureAsync();

		/* Camera button transition */
		let transition = Animated.timing(this.state.cameraButtonScale, {
			toValue: 24,
			duration: 700,
			easing: Easing.inOut(Easing.exp),
			useNativeDriver: true,
		});

		if (image) {
			let flipped = await manipulateAsync(
				image.uri,
				[{ flip: FlipType.Horizontal }],
			).then(e => e)
			.catch(_ => null);

			if (flipped) {
				/* Use pic manipulator to (try) take transformed pic */
				let path: string;

				/* If post processing transforms are on */
				const shouldTransform = await AppConfig.getPostProcessingTransform();
				if (shouldTransform && this.state.anyFaceVisible) {
					try {
						path = await this.pictureManipulator.current?.takePictureAsync(
							flipped.uri,
							transform
						) ?? image.uri;
					}catch {
						console.log("[DBG] Image manipulator fail");
						return this.setState({ loadingImage: false, animating: false });
					}
				}else {
					path = flipped.uri;
				}
				
				/* !! Image is not saved here it's saved in preview/Preview.tsx !! */
				let lsimage = new LSImage(path, "this_str_will_be_overwritten").toLSImageProp();
				
				/* Transition */
				this.setState({ animating: true });
				transition.start(() => {
					this.setState({ loadingImage: false, animating: false });
					this.props.navigation.navigate("Preview", { lsimage })
				});
				this.setState({ cameraButtonPadding: 0 });
			}else {
				alert("Can't flip image");
			}
		}

		/* Could not take pic */
		else {
			alert("Camera is not able to take pic");
		}
	}

	/* On detect faces (expo-face-detector) */
	onFacesDetected(e: FaceDetectionResult): void {
		if (e.faces[0] && this.calibration) {
			/* Some face was detected */
			if (!this.state.anyFaceVisible) this.setState({ anyFaceVisible: true });

			/* Set transforms? */
			if (!this.state.loadingImage) {
				let ffeatures = getFaceFeatures(e.faces[0]);
				let transform = getTransforms(ffeatures, this.calibration);
	
				// this.debug.current?.setBalls([{ balls: [ffeatures.leftEyePosition, ffeatures.rightEyePosition, ffeatures.leftMouthPosition, ffeatures.rightMouthPosition], color: "blue" }])

				this.setState({
					transform,
					facialFeatures: ffeatures,
					debugTransformCamera: this.state.transformCamera ? transform : [],
				});
			}

		}else {
			this.faceRotationView.current?.resetFaceRotation();

			/* No face visible */
			this.setState({ anyFaceVisible: false });
		}
	}

	/** Animate flashlight brigthess */
	async setFlashlightBrightness(toValue: number): Promise<void> {
		Animated.timing(this.state.flashlightOpacity, {
			toValue,
			useNativeDriver: true,
			duration: 0
		}).start();
	}

	/** (try) Set the calibrated face metadata.
	 * Moves to calibration scene if calibration
	 * wasn't found */
	async setFaceMetadata(): Promise<void> {
		const calibration = await CalibrationData.getCalibration();

		if (calibration) {
			this.calibration = calibration;

			// this.debugOutside.current?.setBalls([
			// 	{ balls: [
			// 		calibration.leftEyePosition,
			// 		calibration.rightEyePosition,
			// 		calibration.rightMouthPosition,
			// 		calibration.leftMouthPosition,
			// 		calibration.noseBasePosition,
			// 	], color: "yellow" },
			// ]);
		}else {
			alert("Face calibration was not found 😔");
		}
	}
	
	/* Render */
	render() {
		return (
			<View style={Styles.container}>
				<CalibratedOverlay calibrated={this.calibration} />
				{/* <DebugDots ref={this.debugOutside} /> */}
				
				{/* Transforms image and saves it */}
				<PictureManipulator ref={this.pictureManipulator} />

				{/* Camera */}
				{(this.state.cameraAllowed && this.props.isFocused) && <ExpoCamera
					ref={this.camera}
					style={[Styles.container, { transform: this.state.debugTransformCamera }]}
					type={CameraType.front}
					faceDetectorSettings={{
						mode: FaceDetector.FaceDetectorMode.accurate,
						detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
						runClassifications: FaceDetector.FaceDetectorClassifications.all,
						minDetectionInterval: 5,
						tracking: true,
					}}
					onFacesDetected={this.onFacesDetected}
				>
					{/* <DebugDots ref={this.debug} /> */}
					</ExpoCamera>}

				{/* Flashlight */}
				<View pointerEvents="none" style={Styles.flashRingLightContainer}>
					<Animated.Image
						style={[Styles.flashRingLight, { opacity: this.state.flashlightOpacity }]}
						source={require("../../assets/images/flashlight-overlay.png")}
					/>
				</View>

				{/* Loading indicator */}
				{this.state.loadingImage && <ProgressView />}

				{/* UI components */}
				<SafeAreaView style={Styles.uiLayer}>
					{/* Button to open preferences */}
					<MenuButton active={!(this.state.loadingImage || this.state.animating)} ref={this.menuButton} navigation={this.props.navigation} />

					{/* Bottom UI components */}
					<Floater loosness={3} style={Styles.bottomBar}>
						<View style={Styles.bottomBarTile}>
							<FaceRotationView
								ref={this.faceRotationView}
								visible
								faceData={this.state.facialFeatures}
								calibrated={this.calibration}
							/>
						</View>

						{/* Middle - Shutter Button */}
						<View style={[Styles.bottomBarTile, { zIndex: 4 }]}>
							<ShutterButton
								cameraButtonPadding={this.state.cameraButtonPadding}
								scale={this.state.cameraButtonScale}
								active={!(this.state.loadingImage || this.state.animating)}
								takePic={this.takePic}
							/>
						</View>

						{/* Right */}
						<View style={Styles.bottomBarTile}>
							<FlashLightButton onChange={this.setFlashlightBrightness}/>
						</View>
					</Floater>
				</SafeAreaView>

				{/* Time, battery & more */}
				<StatusBar style="light" />
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
	const isFocused = useIsFocused();
	const CameraRef: RefObject<null | Camera> = React.useRef(null);

	{/* Because react native navigation doesn't unmount
		scenes we need a way of detecting which scene is
		currently active (for playing intro animations) */}
	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			CameraRef.current?.gainedFocus();
		});
		return unsubscribe;
	}, [navigation]);
  
	return <Camera
		comesFrom={props.route.params.comesFrom}
		isFocused={isFocused}
		ref={CameraRef}
		{...props}
		navigation={navigation}
	/>;
}
