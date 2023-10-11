import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

/* Resources */
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import { Image, Platform } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";

/* Scene imports */
import Camera from "./scenes/camera/Camera";
import Preview from "./scenes/preview/Preview";
import Result from "./scenes/result/Result";

import { enableScreens } from "react-native-screens";
import HowOften from "./scenes/setup/HowOften";
import Preferences from "./scenes/preferences/Preferences";
import Calibration from "./scenes/calibration/Calibration";
import Composer from "./scenes/composer/Composer";
import LoadingScreen from "./scenes/compileFootage/LoadingScreen";
import { SplashScene } from "./scenes/splashScene/SplashScene";
import Review from "./scenes/review/Review";
import AdvancedComposer from "./scenes/composer/AdvancedComposer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tutorial from "./scenes/tutorial/Tutorial";
import PrivacyPolicy from "./scenes/privacyPolicy/PrivacyPolicy";
import Statistics from "./scenes/statistics/Statistics";
import Welcome from "./scenes/setup/Welcome";
enableScreens();

/* Notifications */
import * as Device from "expo-device"
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { allowsNotificationsAsync, useLocalNotification } from "./LocalNotification";
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

ExpoSplashScreen.preventAutoHideAsync();

/* Scenes */
const Stack = createStackNavigator();

const App = () => {
	useLocalNotification();
	const [initialRoute, setInitialRoute] = React.useState<"Camera" | "Welcome">("Welcome");
	
	/* Config for scenes (avoiding repetition) */
	let commonConfig = { headerShown: false, animationEnabled: false };
	
	/* Hooks */
	let [resourcesLoaded, setResourcesLoaded] = React.useState(false);
	
	/* Component did mount hehe */
	React.useEffect(() => {
		async function loadAsync() {
			/* Remove later? */
			try {
				const imageAssets = cacheImages([
					require("./assets/images/paper-thing.png"),
					require("./assets/images/pin.png"),
				]);

				await Promise.all(imageAssets);
			} catch (e) {
				console.warn(e);
			} finally {
				setResourcesLoaded(true);
				ExpoSplashScreen.hideAsync();
			};
		};

		/* First screen */
		AsyncStorage.getItem("setupComplete").then((value) => {
			if (value === "true")
			  	setInitialRoute("Camera");
		});

		loadAsync();
	}, []);

	/* Fonts */
	const [fontsLoaded] = useFonts({
		"inter-extrabold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"inter-black": require("./assets/fonts/Inter-Black.ttf"),
		"manrope-black": require("./assets/fonts/Manrope-ExtraBold.ttf"),
		"manrope-light": require("./assets/fonts/Manrope-Light.ttf"),
	});

	if (!fontsLoaded || !resourcesLoaded) return <SplashScene />;

	/* Render */
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName={initialRoute}>
				<Stack.Screen options={commonConfig} name="Camera" component={Camera} initialParams={{ comesFrom: "other" }} />
				<Stack.Screen options={commonConfig} name="Preview" component={Preview} />
				<Stack.Screen options={commonConfig} name="Result" component={Result} />

				{/* Preferences */}
				<Stack.Screen options={commonConfig} name="Preferences" component={Preferences} />
				<Stack.Screen options={commonConfig} name="Statistics" component={Statistics} />
				<Stack.Screen options={commonConfig} name="Review" component={Review} />

				{/* Composer */}
				<Stack.Screen options={commonConfig} name="Composer" component={Composer} />
				<Stack.Screen options={commonConfig} name="AdvancedComposer" component={AdvancedComposer} />
				<Stack.Screen options={commonConfig} name="LoadingScreen" component={LoadingScreen} />

				{/* Setup */}
				<Stack.Screen options={commonConfig} name="Welcome" component={Welcome} />
				<Stack.Screen options={commonConfig} name="HowOften" component={HowOften} initialParams={{ confirmLocation: "Calibration" }} />
				<Stack.Screen options={commonConfig} name="Calibration" component={Calibration} />
				<Stack.Screen options={commonConfig} name="Tutorial" component={Tutorial} />

				{/* Privacy policy */}
				<Stack.Screen options={commonConfig} name="PrivacyPolicy" component={PrivacyPolicy} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

function cacheImages(images: (string | number)[]) {
	return images.map(image => {
		if (typeof image === "string") {
			return Image.prefetch(image);
		} else {
			return Asset.fromModule(image).downloadAsync();
		}
	});
}

export default App;
