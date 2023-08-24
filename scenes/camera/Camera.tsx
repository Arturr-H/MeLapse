import { StatusBar } from "expo-status-bar";
import React, { RefObject } from "react";
import { Animated, Easing, SafeAreaView, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { CameraCapturedPicture, CameraType, Camera as ExpoCamera, FaceDetectionResult, PermissionStatus } from "expo-camera"
import * as Haptic from "expo-haptics";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Floater from "../../components/floater/Floater";
import * as FaceDetector from "expo-face-detector";
import { LSImage } from "../../functional/Image";
import { FlipType, SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { AlignHelper } from "./AlignHelper";
import { FaceData, getCalibratedDifferences, getFaceFeatures, getTransforms } from "../../functional/FaceDetection";
import { Debug } from "../../functional/Debug";
import { spring } from "../../functional/AnimUtils";
import { PictureManipulator } from "./PictureManipulator";
import { Animator } from "../../components/animator/Animator";
import { ProgressView } from "../../components/progressView/ProgressView";
import { MenuButton } from "./MenuButton";

/* Constants */
const temp: FaceData = { "middle": {x:0,y:0}, "bottomMouthPosition": {"x": 191.72916668653488, "y": 501.15625312924385}, "bounds": {"origin": {"x": 54.70416218042374, "y": 281.23957923054695}, "size": {"height": 275.31875905394554, "width": 275.31875905394554}}, "deltaEye": {"x": 92.19583636522293, "y": 2.96041676402092}, "deltaMouth": {"x": 76.12500250339508, "y": 2.1145834028720856}, "faceID": 34, "leftCheekPosition": {"x": 129.56041464209557, "y": 445.7541679739952}, "leftEarPosition": {"x": 98.68749696016312, "y": 411.4979168474674}, "leftEyePosition": {"x": 149.01458194851875, "y": 383.5854159295559}, "leftMouthPosition": {"x": 151.97499871253967, "y": 482.9708358645439}, "midEye": {"x": 195.11250013113022, "y": 385.06562431156635}, "midMouth": {"x": 190.0374999642372, "y": 484.02812756597996}, "noseBasePosition": {"x": 194.6895834505558, "y": 431.79791751503944}, "rightCheekPosition": {"x": 256.8583354949951, "y": 449.56041809916496}, "rightEarPosition": {"x": 294.92083674669266, "y": 411.075000166893}, "rightEyePosition": {"x": 241.21041831374168, "y": 386.5458326935768}, "rightMouthPosition": {"x": 228.10000121593475, "y": 485.085419267416}, "rollAngle": 1.6910536289215088, "yawAngle": -0.7525003552436829};

/* Interfaces */
interface Props {
	navigation: StackNavigationProp<
		{ Preview: { lsimage: LSImage } }, "Preview">,

	isFocused: boolean,
}
interface State {
	/// User needs to allow app to use camera
	cameraAllowed: boolean,

	/// Needed for scaling into transition
	cameraButtonScale: Animated.Value,

	/// Needed when scaling button, because we don't want it to scale with the rim
	cameraButtonPadding: number,

	/// Animated values
	yawAngle: Animated.Value,
	rollAngle: Animated.Value,

	transform: any[],
	cameraImage: CameraCapturedPicture | null,
	loadingImage: boolean,
}

class Camera extends React.PureComponent<Props, State> {
	pictureManipulator: RefObject<PictureManipulator>;
	camera: RefObject<ExpoCamera>;
	alignHelper: RefObject<Animator>;
	debug: RefObject<Debug>;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			cameraAllowed: false,
			cameraButtonScale: new Animated.Value(24),
			cameraButtonPadding: 4,

			yawAngle: new Animated.Value(0),
			rollAngle: new Animated.Value(0),
			transform: [],
			cameraImage: null,
			loadingImage: false,
		};

		/* Refs */
		this.pictureManipulator = React.createRef();
		this.alignHelper = React.createRef();
		this.camera = React.createRef();
		this.debug = React.createRef();

		/* Bindings */
		this.handleFacesDetected = this.handleFacesDetected.bind(this);
		this.takePic = this.takePic.bind(this);
	}

	/* Lifetime */
	async componentDidMount(): Promise<void> {
		/* Get camera permission */
		const { status } = await ExpoCamera.requestCameraPermissionsAsync();
		this.setState({ cameraAllowed: status === PermissionStatus.GRANTED });

		Animated.timing(this.state.cameraButtonScale, {
			toValue: 1,
			duration: 1250,
			easing: Easing.inOut(Easing.exp),
			useNativeDriver: true,
		}).start();
	}

	/* Called via the export default function (navigation handler) */
	gainedFocus(): void {
		/* Animate transition */
		Animated.timing(this.state.cameraButtonScale, {
			toValue: 1,
			duration: 1250,
			easing: Easing.inOut(Easing.exp),
			useNativeDriver: true,
		}).start(() => {
			this.setState({ cameraButtonPadding: 4 });
		});

		this.alignHelper.current?.wait(1500).fadeIn().start();
	}

	/* Handle face detection */
	handleFacesDetected(faces: FaceDetectionResult): void {
		const face_ = faces.faces[0];

		/* (change later to multiple faces) */
		if (face_) {
			const face = getFaceFeatures(face_);
			// console.log("\n\n", "\n\n", "\n\n", face, "\n\n", this.temp);
			const diff = getCalibratedDifferences(face, temp);

			spring(this.state.yawAngle, face.yawAngle);
			spring(this.state.rollAngle, face.rollAngle);

			this.setState({ transform: getTransforms(face, temp) })

			this.debug && this.debug.current?.setBalls([
				// face.leftEarPosition, 
				// face.rightEarPosition,
				// face.leftEyePosition, 
				// face.rightEyePosition,
				// face.leftMouthPosition, 
				// face.rightMouthPosition,
				
				// face.bottomMouthPosition,
				// face.midEye,
				// face.midMouth,
				// face.noseBasePosition,

				// temp.leftEyePosition, 
				// temp.rightEyePosition,
				// temp.leftMouthPosition, 
				// temp.rightMouthPosition,
				// face.middle
			]);
		}
	}

	/* Take pic */
	async takePic(): Promise<void> {
		/* Haptic */
		Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
		this.alignHelper.current?.fadeOut().start();
		this.setState({ loadingImage: true });

		/* Take camera picture */
		const image = await this.camera.current?.takePictureAsync();
		if (image) {
			this.setState({ cameraImage: image });

			/* !! Image is not saved here it's saved in preview/Preview.tsx !! */
			/* Flip image */
			const flipped = await manipulateAsync(
				image.uri,
				[{ flip: FlipType.Horizontal }],
				{ compress: 1, format: SaveFormat.JPEG }
			);
			let lsimage: LSImage = {
				path: image.uri,
				filename: "unknown",
				date: new Date().getTime()
			};

			/* Animate transition */
			Animated.timing(this.state.cameraButtonScale, {
				toValue: 24,
				duration: 1250,
				easing: Easing.inOut(Easing.exp),
				useNativeDriver: true,
			}).start(() => {
				this.setState({ loadingImage: false });
				this.props.navigation.navigate("Preview", { lsimage })
			});
			this.setState({ cameraButtonPadding: 0 });
		}
	}
	
	render() {
		let scale = this.state.cameraButtonScale;

		return (
			<View style={Styles.container}>
				<Debug ref={this.debug} />
				{/* <PictureManipulator
					transform={this.state.transform}
					image={this.state.cameraImage}
					ref={this.pictureManipulator} 
				/> */}

				{/* Camera */}
				{(this.state.cameraAllowed && this.props.isFocused) && <ExpoCamera
					ref={this.camera}
					style={[Styles.container, { transform: [] }]}
					type={CameraType.front}
					faceDetectorSettings={{
						mode: FaceDetector.FaceDetectorMode.accurate,
						detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
						runClassifications: FaceDetector.FaceDetectorClassifications.all,
						minDetectionInterval: 5,
						tracking: true,
					}}
					onFacesDetected={this.handleFacesDetected}
				/>}

				{/* Face in the middle of the screen */}
				<Animator ref={this.alignHelper} style={{ position: "absolute" }}>
					<AlignHelper />
				</Animator>

				{/* Loading indicator */}
				{this.state.loadingImage && <ProgressView />}

				{/* UI components */}
				<SafeAreaView style={Styles.uiLayer}>

					{/* Camera button */}
					<Floater loosness={5} style={Styles.cameraButtonWrapper}>
						<Animated.View
							style={[Styles.cameraButton, {
								transform: [{ scale }],
								padding: this.state.cameraButtonPadding,
							}]}
						>
							<TouchableOpacity
								style={Styles.cameraButtonInner}
								activeOpacity={1}
								onPress={this.takePic}
							/>
						</Animated.View>
					</Floater>

					<View style={{ width: "100%", paddingHorizontal: "12%", }}>
						<MenuButton />
					</View>
				</SafeAreaView>


				{/* Time, battery & more */}
				<StatusBar style="dark" />
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
  
	return <Camera isFocused={isFocused} ref={CameraRef} {...props} navigation={navigation} />;
}
