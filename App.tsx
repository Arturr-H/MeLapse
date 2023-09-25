import React from "react";
import { NavigationContainer, NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

/* Resources */
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import { Image } from "react-native";
import * as ExpoSplashScreen from "expo-splash-screen";

/* Scene imports */
import Camera from "./scenes/camera/Camera";
import Preview from "./scenes/preview/Preview";
import Result from "./scenes/result/Result";

import { enableScreens } from "react-native-screens";
import Setup from "./scenes/setup/Name";
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
enableScreens();

ExpoSplashScreen.preventAutoHideAsync();

/* Scenes */
const Stack = createStackNavigator();

const App = () => {
	const [initialRoute, setInitialRoute] = React.useState<"Camera" | "Setup">("Setup");

	/* Config for scenes (avoiding repetition) */
	let commonConfig = { headerShown: false, animationEnabled: false };

	/* Hooks */
	let [resourcesLoaded, setResourcesLoaded] = React.useState(false);

	/* Component did mount hehe */
	React.useEffect(() => {
		async function loadResourcesAsync() {
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
			}
		};

		AsyncStorage.getItem("setupComplete").then((value) => {
			if (value === "true")
			  	setInitialRoute("Camera");
		});

		loadResourcesAsync();
	}, []);

	/* Fonts */
	const [fontsLoaded] = useFonts({
		"inter-extrabold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"inter-black": require("./assets/fonts/Inter-Black.ttf"),
		"poppins-black": require("./assets/fonts/Poppins-Black.ttf"),
	});

	if (!fontsLoaded || !resourcesLoaded) return <SplashScene />;

	/* Render */
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName={initialRoute}>
				<Stack.Screen options={commonConfig} name="Camera" component={Camera} initialParams={{ comesFrom: "other" }} />
				<Stack.Screen options={commonConfig} name="Preview" component={Preview} initialParams={{}} />
				<Stack.Screen options={commonConfig} name="Result" component={Result} />

				{/* Preferences */}
				<Stack.Screen options={commonConfig} name="Preferences" component={Preferences} />
				<Stack.Screen options={commonConfig} name="Review" component={Review} />

				{/* Composer */}
				<Stack.Screen options={commonConfig} name="Composer" component={Composer} />
				<Stack.Screen options={commonConfig} name="AdvancedComposer" component={AdvancedComposer} />
				<Stack.Screen options={commonConfig} name="LoadingScreen" component={LoadingScreen} />

				{/* Setup */}
				<Stack.Screen options={commonConfig} name="Setup" component={Setup} />
				<Stack.Screen options={commonConfig} name="HowOften" component={HowOften} />
				<Stack.Screen options={commonConfig} name="Calibration" component={Calibration} />
				<Stack.Screen options={commonConfig} name="Tutorial" component={Tutorial} />
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
