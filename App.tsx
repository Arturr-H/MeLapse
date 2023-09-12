import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

/* Fonts */
import { useFonts } from "expo-font";

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
enableScreens();

/* Scenes */
const Stack = createStackNavigator();

const App = () => {
	let commonConfig = { headerShown: false, animationEnabled: false };

	const [fontsLoaded] = useFonts({
		"inter-extrabold": require("./assets/fonts/Inter-ExtraBold.ttf"),
		"inter-black": require("./assets/fonts/Inter-Black.ttf"),
		"poppins-black": require("./assets/fonts/Poppins-Black.ttf"),
	});

	if (!fontsLoaded) return null;

	/* Render */
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen options={commonConfig} name="Camera"		  component={Camera} initialParams={{ comesFrom: "other" }} />
				<Stack.Screen options={commonConfig} name="LoadingScreen" component={LoadingScreen} />
				<Stack.Screen options={commonConfig} name="Composer"	  component={Composer} />
				<Stack.Screen options={commonConfig} name="Setup" 		  component={Setup} />
				<Stack.Screen options={commonConfig} name="Result" 		  component={Result} />
				<Stack.Screen options={commonConfig} name="Calibration"   component={Calibration} />
				<Stack.Screen options={commonConfig} name="Preferences"   component={Preferences} />
				<Stack.Screen options={commonConfig} name="HowOften" 	  component={HowOften} />
				<Stack.Screen options={commonConfig} name="Preview" 	  component={Preview} initialParams={{}} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
