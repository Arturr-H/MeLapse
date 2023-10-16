import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Linking, SafeAreaView, View } from "react-native";
import Styles from "./Styles";
import { CameraType, Camera as ExpoCamera, FaceDetectionResult, FlashMode, PermissionStatus } from "expo-camera"
import * as Haptic from "expo-haptics";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import * as FaceDetector from "expo-face-detector";
import { LSImage, LSImageProp } from "../../functional/Image";
import { FlipType, manipulateAsync } from "expo-image-manipulator";
import { FaceData, getFaceFeatures, getTransforms } from "../../functional/FaceDetection";
import { PictureManipulator } from "./PictureManipulator";
import { ProgressView } from "../../components/progressView/ProgressView";
import { MenuButton } from "./MenuButton";
import AppConfig from "../preferences/Config";
import { ShutterButton } from "./ShutterButton";
import FlashLightButton from "./FlashLightButton";
import CalibrationData from "../calibration/CalibrationData";
import { CalibratedOverlay } from "./CalibratedOverlay";
import { TiltOverlay } from "./TiltOverlay";
import { OnionSkin } from "./onionSkin/OnionSkin";
import { ModalConstructor } from "../../components/modal/ModalConstructor";

/* Interfaces */
interface Props {
	navigation: StackNavigationProp<{
		Preview: { lsimage: LSImageProp },
		Preferences: undefined,
		Calibration: undefined
	}, "Preview", "Preferences" | "Calibration">,

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
	transform: any[],

	/** If there are any faces visible on screen */
	anyFaceVisible: boolean,

	/** Deactivate buttons when transitioning */
	animating: boolean,
	loadingImage: boolean,
	showActivityIndicator: boolean,
	transformCamera: boolean,
	cameraActive: boolean,

	/** Facial features, used for `FaceRotationView` */
	facialFeatures: FaceData | null,

	/** Flashlight overlay opacity */
	flashlightOpacity: Animated.Value,
	flashlightOn: boolean,

	/** Onion skin image (URI) */
	onionSkinOverlay: string | null,
}

class Camera extends React.PureComponent<Props, State> {
	pictureManipulator : RefObject<PictureManipulator> = React.createRef();;
	camera             : RefObject<ExpoCamera> = React.createRef();;
	menuButton         : RefObject<MenuButton> = React.createRef();;
	flashLightButton   : RefObject<FlashLightButton> = React.createRef();;
	shutterButton      : RefObject<ShutterButton> = React.createRef();;
	onionSkin          : RefObject<OnionSkin> = React.createRef();;
	modal              : RefObject<ModalConstructor> = React.createRef();;

	/** Face calibration metadata */
	calibration: FaceData | null = null;

	/** Loading image can sometimes take a while
	 * (picture manipulator etc...) If it does, 
	 * we display an overlay with an activityindicator */
	stillLoadingImage: boolean = false;
	loadingImageTimeoutCheck?: NodeJS.Timeout;

	hasShowedCameraAccessModal: boolean = false;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			cameraAllowed: false,

			flashlightOpacity: new Animated.Value(0),
			flashlightOn: false,

			transform: [],
			facialFeatures: null,

			animating: true,

			loadingImage: false,
			showActivityIndicator: false,
			transformCamera: false,
			anyFaceVisible: false,
			onionSkinOverlay: null,
			cameraActive: true,
		};

		/* Bindings */
		this.setFlashlightBrightness = this.setFlashlightBrightness.bind(this);
		this.setCameraActive = this.setCameraActive.bind(this);
		this.setFaceMetadata = this.setFaceMetadata.bind(this);
		this.onFacesDetected = this.onFacesDetected.bind(this);
		this.gainedFocus = this.gainedFocus.bind(this);
		this.takePic = this.takePic.bind(this);
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		if (await CalibrationData.getCalibration() === null) {
			alert("Face calibration was not found.");
			this.props.navigation.navigate("Calibration");
		};
		this.gainedFocus();
		this.props.navigation.addListener("focus", this.gainedFocus);
	}
	async componentWillUnmount(): Promise<void> {
		this.props.navigation.removeListener("focus", this.gainedFocus);
	}

	/* Called via the export default function (navigation handler) */
	async gainedFocus(): Promise<void> {
		await this.onionSkin.current?.updateOnionskin();

		/* Get camera permission */
		const { status } = await ExpoCamera.requestCameraPermissionsAsync();
		if (status === PermissionStatus.DENIED && !this.hasShowedCameraAccessModal) {
			this.hasShowedCameraAccessModal = true;
			
			this.modal.current?.constructModal({
				header: "Camera",
				description: "Camera must be enabled to have this app function",

				buttons: [
					{ text: "Okay", color: "blue", onClick: Linking.openSettings },
				]
			})
		}
		this.setState({ cameraAllowed: status === PermissionStatus.GRANTED });

		/* Try get face calibration */
		await this.setFaceMetadata();

		AppConfig.getTransformCamera().then(e => this.setState({ transformCamera: e }));
		this.animateIntro();
		this.setState({
			anyFaceVisible: true,
			animating: false,
			showActivityIndicator: false,
			cameraActive: true
		});

		/* Simulator throws error bc no camera */
		try { this.camera.current?.resumePreview(); }
		catch {}
	}

	/** Animates the right intro depending on which scene we previously left */
	animateIntro(): void {
		this.setState({ animating: true });
		setTimeout(() => this.setState({ animating: false }), 1000);
		this.flashLightButton.current?.setbackMoveAway();

		const backMenuButton = () => {
			this.menuButton.current?.animateBack();
			this.shutterButton.current?.instantSetBack();
		}
		const backCameraButton = () => {
			this.shutterButton.current?.animateBack();
			this.menuButton.current?.instanSetBack();
		}

		/* Menu button */
		if (this.props.comesFrom === "preferences") backMenuButton()

		/* Camera button */
		else {
			backCameraButton();
			this.menuButton.current?.fadeInButton();
		};
	}

	/* Take pic */
	async takePic(): Promise<void> {
		let unableToLoad: boolean = false;

		this.setState({ loadingImage: true, animating: true });
		const transform = [...this.state.transform]; // clone transform
		const anyFaceVisible = this.state.anyFaceVisible;

		/* We show activity indicator if image
			loads for more than 2000 ms */
		this.stillLoadingImage = true;
		this.loadingImageTimeoutCheck = setTimeout(() => {
			if (this.stillLoadingImage && !unableToLoad) this.setState({
				showActivityIndicator: true,
			});
		}, 1000);

		const resetLoading = () => {
			this.setState({
				loadingImage: false,
				showActivityIndicator: false,
			});
		}

		/* Freeze camera */
		try { this.camera.current?.pausePreview(); }
		catch {}

		/* Haptic */
		Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);

		/* Take camera picture */
		const image = await this.camera.current?.takePictureAsync();

		if (image) {
			/* Animate away menu button and flashlight button */
			this.flashLightButton.current?.moveAway();
			this.menuButton.current?.moveAway();

			/* Flip image */
			let flipped = await manipulateAsync(
				image.uri,
				[{ flip: FlipType.Horizontal }],
			).then(e => e)
			.catch(_ => null);

			/* Revert brightness */
			this.flashLightButton.current?.resetBrightness();

			if (flipped) {
				/* Use pic manipulator to (try) take transformed pic */
				let path: string;

				/* Try flip */
				if (anyFaceVisible) {
					try {
						path = await this.pictureManipulator.current?.takePictureAsync(
							flipped.uri,
							transform
						) ?? image.uri;
					}catch (e) {
						console.log("[DBG] Image manipulator fail", e);
						path = flipped.uri;
					}
				}else {
					path = flipped.uri;
				}
				
				/* !! Image is not saved here it's saved in preview/Preview.tsx !! */
				let lsimage = new LSImage().withPath(path).toLSImageProp();
				
				/* Transition */
				this.setState({ animating: true });
				resetLoading();
				this.shutterButton.current?.scaleUp(() => {
					this.setState({ animating: false });
					this.setCameraActive(false);
					this.props.navigation.navigate("Preview", { lsimage });
				});
			}else {
				alert("Can't flip image");
				resetLoading();
			}
		}

		/* Could not take pic */
		else {
			alert("Camera is not able to take pic");
			resetLoading();
			unableToLoad = true;
			this.setState({ animating: false, showActivityIndicator: false });
		}
	}
	setCameraActive(active: boolean): void {
		this.setState({ cameraActive: active });
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
	
				this.setState({
					transform,
					facialFeatures: ffeatures,
				});
			}

		}else {
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
		}else {
			console.log("No face calibration found")
		}
	}
	
	/* Render */
	render() {
		return (
			<View style={Styles.container}>
				<ModalConstructor ref={this.modal} />

				<CalibratedOverlay calibrated={this.calibration} />
				
				{/* Transforms image and saves it */}
				<PictureManipulator ref={this.pictureManipulator} />

				{/* Onion skin image */}
				<OnionSkin ref={this.onionSkin} />

				{/* Camera */}
				{(this.state.cameraAllowed && this.state.cameraActive) && <ExpoCamera
					ref={this.camera}
					style={Styles.container}
					type={CameraType.front}
					flashMode={this.state.flashlightOn ? FlashMode.on : FlashMode.off}
					faceDetectorSettings={{
						mode: FaceDetector.FaceDetectorMode.accurate,
						detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
						runClassifications: FaceDetector.FaceDetectorClassifications.all,
						minDetectionInterval: 5,
						tracking: true,
					}}
					onFacesDetected={this.onFacesDetected}
				/>}

				{/* Flashlight */}
				<View pointerEvents="none" style={Styles.flashRingLightContainer}>
					<Animated.Image
						style={[Styles.flashRingLight, { opacity: this.state.flashlightOpacity }]}
						source={require("../../assets/images/flashlight-overlay.png")}
					/>
				</View>

				{/* Loading indicator */}
				{this.state.showActivityIndicator && <ProgressView />}

				{/* UI components */}
				<SafeAreaView style={Styles.uiLayer}>
					{/* Button to open preferences */}
					<MenuButton
						active={!(this.state.loadingImage || this.state.animating)}
						ref={this.menuButton}
						navigation={this.props.navigation}
						beforeNavigate={() => this.setCameraActive(false)}
						onAnimating={(animating) => this.setState({ animating })}
					/>

					{/* Bottom UI components */}
					<View style={Styles.bottomBar}>
						<View style={Styles.bottomBarTile}>
							{/* Helps user know how to rotate face */}
							{/* <TiltOverlay
								calibration={this.calibration}
								sensitivity={10}
								facialFeatures={this.state.facialFeatures}
								anyFaceVisible={this.state.anyFaceVisible}
							/> */}

						</View>

						{/* Middle - Shutter Button */}
						<View style={[Styles.bottomBarTile, { zIndex: 4 }]}>
							<ShutterButton
								active={!(this.state.loadingImage || this.state.animating)}
								takePic={this.takePic}
								ref={this.shutterButton}
							/>
						</View>

						{/* Right */}
						<View style={Styles.bottomBarTile}>
							<FlashLightButton
								ref={this.flashLightButton}
								onChange={this.setFlashlightBrightness}
								setFlashlightActive={e => this.setState({ flashlightOn: e })}	
							/>
						</View>
					</View>
				</SafeAreaView>

				{/* Time, battery & more */}
				<StatusBar style="light" />
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Camera {...props} navigation={navigation} comesFrom={props.route.params.comesFrom} />;
}
