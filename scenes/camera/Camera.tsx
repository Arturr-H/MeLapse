import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, Image, SafeAreaView, View } from "react-native";
import Styles from "./Styles";
import { CameraType, Camera as ExpoCamera, FaceDetectionResult, PermissionStatus } from "expo-camera"
import * as Haptic from "expo-haptics";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Floater from "../../components/floater/Floater";
import * as FaceDetector from "expo-face-detector";
import { LSImage, LSImageProp } from "../../functional/Image";
import { FlipType, SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { AlignHelper } from "../calibration/AlignHelper";
import { FaceData, getAlignTransforms, getFaceFeatures, getTransforms } from "../../functional/FaceDetection";
import { DebugDots } from "../../functional/Debug";
import { PictureManipulator } from "./PictureManipulator";
import { Animator } from "../../components/animator/Animator";
import { ProgressView } from "../../components/progressView/ProgressView";
import { MenuButton } from "./MenuButton";
import AppConfig from "../preferences/Config";
import { ShutterButton } from "./ShutterButton";
import { AlignView } from "./AlignView";

/* Constants */
const temp: FaceData = { "middle": {x:0,y:0}, "bottomMouthPosition": {"x": 191.72916668653488, "y": 501.15625312924385}, "bounds": {"origin": {"x": 54.70416218042374, "y": 281.23957923054695}, "size": {"height": 275.31875905394554, "width": 275.31875905394554}}, "deltaEye": {"x": 92.19583636522293, "y": 2.96041676402092}, "deltaMouth": {"x": 76.12500250339508, "y": 2.1145834028720856}, "faceID": 34, "leftCheekPosition": {"x": 129.56041464209557, "y": 445.7541679739952}, "leftEarPosition": {"x": 98.68749696016312, "y": 411.4979168474674}, "leftEyePosition": {"x": 149.01458194851875, "y": 383.5854159295559}, "leftMouthPosition": {"x": 151.97499871253967, "y": 482.9708358645439}, "midEye": {"x": 195.11250013113022, "y": 385.06562431156635}, "midMouth": {"x": 190.0374999642372, "y": 484.02812756597996}, "noseBasePosition": {"x": 194.6895834505558, "y": 431.79791751503944}, "rightCheekPosition": {"x": 256.8583354949951, "y": 449.56041809916496}, "rightEarPosition": {"x": 294.92083674669266, "y": 411.075000166893}, "rightEyePosition": {"x": 239.21041831374168, "y": 386.5854159295559}, "rightMouthPosition": {"x": 228.10000121593475, "y": 485.085419267416}, "rollAngle": 1.6910536289215088, "yawAngle": -0.7525003552436829};

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

	/** This value represents how close the users head is to
	 /* where it needs to be (calibrated). 1 means that it's
	 /* on spot, < 1 means they need to move head further away
	 /* > 1 means they need to move closer. */
	transformScale: number,
	loadingImage: boolean,
	debugTransformCamera: any[],
	transformCamera: boolean,
}

class Camera extends React.PureComponent<Props, State> {
	pictureManipulator : RefObject<PictureManipulator>;
	camera             : RefObject<ExpoCamera>;
	alignHelperAnimator: RefObject<Animator>;
	alignHelper        : RefObject<AlignHelper>;
	debug              : RefObject<DebugDots>;
	debugOutside       : RefObject<DebugDots>;
	menuButton         : RefObject<MenuButton>;

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

			transform: [],
			transformScale: 1,

			loadingImage: false,
			debugTransformCamera: [],
			transformCamera: false,
			anyFaceVisible: false
		};

		/* Refs */
		this.pictureManipulator = React.createRef();
		this.alignHelperAnimator = React.createRef();
		this.debugOutside = React.createRef();
		this.alignHelper = React.createRef();
		this.menuButton = React.createRef();
		this.camera = React.createRef();
		this.debug = React.createRef();

		/* Bindings */
		this.onFacesDetected = this.onFacesDetected.bind(this);
		this.gainedFocus = this.gainedFocus.bind(this);
		this.takePic = this.takePic.bind(this);
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
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
		
		this.alignHelperAnimator.current?.wait(1500).fadeIn().start();
	}

	/** Animates the right intro depending on which scene we previously left */
	animateIntro(): void {
		const backMenuButton = () => {
			this.setState({ cameraButtonScale: new Animated.Value(1), cameraButtonPadding: 4 });
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
				duration: 900,
				easing: Easing.inOut(Easing.exp),
				useNativeDriver: true,
			})]).start(() => this.setState({ cameraButtonPadding: 4 }));
		}

		/* Menu button */
		if (this.props.comesFrom === "preferences") backMenuButton()

		/* Camera button */
		else backCameraButton();
	}

	/* Take pic */
	async takePic(): Promise<void> {
		/* Haptic */
		Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
		this.alignHelperAnimator.current?.fadeOut().start();
		this.setState({ loadingImage: true });

		/* Take camera picture */
		const image = await this.camera.current?.takePictureAsync();

		/* Camera button transition */
		let transition = Animated.timing(this.state.cameraButtonScale, {
			toValue: 24,
			duration: 900,
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
					path = await this.pictureManipulator.current?.takePictureAsync(
						flipped.uri,
						this.state.transform
					) ?? image.uri;
				}else {
					path = flipped.uri;
				}
				
				/* !! Image is not saved here it's saved in preview/Preview.tsx !! */
				let lsimage = new LSImage(path).toLSImageProp();
				
				/* Transition */
				transition.start(() => {
					this.setState({ loadingImage: false });
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
		if (e.faces[0]) {
			/* Some face was detected */
			if (!this.state.anyFaceVisible) this.setState({ anyFaceVisible: true });

			let ffeatures = getFaceFeatures(e.faces[0]);
			let transform = getTransforms(ffeatures, temp);
			let aligntrfm = getAlignTransforms(ffeatures, temp);

			this.alignHelper
				&& this.alignHelper.current?.animateNext(aligntrfm);

			/* Set transforms? */
			let transformScale = transform.find(e => typeof e.scale == "number").scale ?? 1;
			this.setState({ transform, transformScale, debugTransformCamera: this.state.transformCamera ? transform : [] });

			this.debug.current?.setBalls([
				{ balls: [
					ffeatures.leftEyePosition,
					ffeatures.rightEyePosition,
					ffeatures.rightMouthPosition,
					ffeatures.leftMouthPosition,
				], color: "blue" },

				{ balls: [
					ffeatures.midEye,
					ffeatures.midMouth,
				], color: "orange" },

				{ balls: [
					ffeatures.middle,
				], color: "pink" },

				{ balls: [
					ffeatures.leftCheekPosition,
					ffeatures.rightCheekPosition,
				], color: "pink" },
			]);
			
			this.debugOutside.current?.setBalls([
				{ balls: [
					temp.leftEyePosition,
					temp.rightEyePosition,
					temp.rightMouthPosition,
					temp.leftMouthPosition,
				], color: "yellow" },
			]);

		}else {
			/* No face visible */
			this.setState({ anyFaceVisible: false });
		}
	}
	
	/* Render */
	render() {
		return (
			<View style={Styles.container}>
				<DebugDots ref={this.debugOutside} />
				
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
				><DebugDots ref={this.debug} /></ExpoCamera>}

				{/* Loading indicator */}
				{this.state.loadingImage && <ProgressView />}

				{/* UI components */}
				<SafeAreaView style={Styles.uiLayer}>
					{/* Button to open preferences */}
					<MenuButton active={!this.state.loadingImage} ref={this.menuButton} navigation={this.props.navigation} />

					{/* Bottom UI components */}
					<Floater loosness={3} style={Styles.bottomBar}>
						{/* Left */}
						<View style={Styles.bottomBarTile}>
							<AlignView
								/* Only visible when there are any faces on screen */
								visible={this.state.anyFaceVisible}
								scale={this.state.transformScale}
							/>
						</View>

						{/* Middle - Shutter Button */}
						<View style={Styles.bottomBarTile}>
							<ShutterButton
								cameraButtonPadding={this.state.cameraButtonPadding}
								scale={this.state.cameraButtonScale}
								loadingImage={this.state.loadingImage}
								takePic={this.takePic}
							/>
						</View>

						{/* Right */}
						<View style={Styles.bottomBarTile}></View>
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
