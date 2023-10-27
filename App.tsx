import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

/* Resources */
import { useFonts } from "expo-font";
import * as ExpoSplashScreen from "expo-splash-screen";

/* Scene imports */
import Camera from "./scenes/camera/Camera";
import Preview from "./scenes/preview/Preview";

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
import Statistics from "./scenes/statistics/Statistics";
import Welcome from "./scenes/setup/Welcome";
import OnionSkin from "./scenes/preferences/onionSkin/OnionSkin";
enableScreens();

/* Notifications */
import * as Notifications from "expo-notifications";
import { useLocalNotification } from "./LocalNotification";
import ThankYou from "./scenes/thankYou/ThankYou";
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
	const [initialRoute, setInitialRoute] = React.useState<"Camera" | "Welcome" | null>(null);
	
	/* Config for scenes (avoiding repetition) */
	let commonConfig = {
		headerShown: false,
		animationEnabled: true,
		cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter
	};

	/* Fonts */
	const [fontsLoaded] = useFonts({
		"inter-extrabold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"inter-black": require("./assets/fonts/Inter-Black.ttf"),
		"manrope-black": require("./assets/fonts/Manrope-ExtraBold.ttf"),
		"manrope-light": require("./assets/fonts/Manrope-Light.ttf"),
	});
	
	/* Component did mount hehe */
	React.useEffect(() => {

		/* First screen */
		AsyncStorage.getItem("setupComplete").then((value) => {
			ExpoSplashScreen.hideAsync();

			if (value === "true") {
			  	setInitialRoute("Camera");
			}
		});
	}, []);

	if (!fontsLoaded || initialRoute === null) return <SplashScene />;

	/* Render */
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter}} initialRouteName={initialRoute} >
				<Stack.Screen options={commonConfig} name="Camera" component={Camera} initialParams={{ comesFrom: "other" }} />
				<Stack.Screen options={commonConfig} name="Preview" component={Preview} />

				{/* Preferences */}
				<Stack.Screen options={commonConfig} name="Preferences" component={Preferences} />
				<Stack.Screen options={commonConfig} name="OnionSkinPreferences" component={OnionSkin} />
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
				<Stack.Screen options={commonConfig} name="ThankYou" component={ThankYou} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
