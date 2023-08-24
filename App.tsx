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
				<Stack.Screen options={commonConfig} name="Setup" component={Setup} />
				<Stack.Screen options={commonConfig} name="HowOften" component={HowOften} />
				<Stack.Screen options={commonConfig} name="Camera" component={Camera} />
				<Stack.Screen options={commonConfig} name="Preview" component={Preview} initialParams={{}} />
				<Stack.Screen options={commonConfig} name="Result" component={Result} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
