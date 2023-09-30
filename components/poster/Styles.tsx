/* Imports */
import { StyleSheet } from "react-native";

/* Main styles */
export default StyleSheet.create({
	rotationWrapper: {
		display: "flex",
        justifyContent: "center",
            alignItems: "center",
		
		position: "relative",
		zIndex: 3,
		
		height: 254*2 - 12,
	},
	posterWrapper: {
		display: "flex",
        justifyContent: "flex-end",
            alignItems: "center",
		width: 180,

		// Double height so that pin becomes center (for rotation)
		height: 254*2 - 12,

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.23,
		shadowRadius: 13.97,
		elevation: 21,

		// backgroundColor: "blue"
	},
	poster: {
		position: "relative",
		width: "100%",
		height: 230,

		padding: 8,
		paddingTop: 0,
		backgroundColor: "#fff",

		display: "flex",
		alignItems: "center",
	},

	image: {
		width: "100%",
		aspectRatio: 1,

		resizeMode: "cover",
	},
	imageMask: {
		width: "100%",
		height: "100%"
	},
	maskedView: {
		backgroundColor: 'transparent',
		width: "100%",
		height: 254,

		position: "absolute"
	},
	posterDate: {
		fontSize: 12,
		fontWeight: "300",
		color: "#999",
		fontFamily: "manrope-light",

		position: "absolute",
		right: 5,
		bottom: 5,
	},

	paperEnding: {
		width: "100%",
		height: 24,
		resizeMode: "cover",
	},
	pin: {
		width: 30,
		height: 30,
		zIndex: 5,
		overflow: "visible",

		position: "absolute",
		transform: [{ translateY: -13 }, { translateX: 6 }],

		shadowColor: "#000",
		shadowOffset: {
			width: 5,
			height: 10,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1.97,
	},
});
