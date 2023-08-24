import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        width: "100%",
        height: "100%"
    },
    uiLayer: {
        width: "100%",
        height: "100%",
        position: "absolute",

        display: "flex",
            alignItems: "center",
        flexDirection: "column",
    },
    instructionText: {
        position: "absolute",
        alignSelf: "center",

        bottom: 80,

        fontSize: 20,
        fontWeight: "700",
        fontStyle: "italic",

        opacity: 0.4
    },

    cameraButtonWrapper: {
        position: "absolute",
        bottom: 50,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "column",
        gap: 20,

        zIndex: 2
    },
    cameraButton: {
        width: 98,
        height: 98,
        borderRadius: 49,

        // backgroundColor: "#fff",
        borderColor: "#fff",
        borderWidth: 8,

        padding: 4
    },
    cameraButtonInner: {
        width: "100%",
        height: "100%",

        backgroundColor: "#fff",
        borderRadius: 49
    },

    /* Align helper */

    alignHelperContainer: {
        // width: 82,
        // height: 82,
        // backgroundColor: "blue",
        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    alignHelperXbg: {
        width: "100%",
        height: 10,
        // backgroundColor: "#eeeeee",
        borderRadius: 5,

        position: "absolute",
        overflow: "hidden",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    alignHelperYbg: {
        width: 10,
        height: "100%",
        // backgroundColor: "#eeeeee",
        borderRadius: 5,

        position: "absolute",
        overflow: "hidden",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    alignHelper: {
        // backgroundColor: "#121215",
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    x: { width: "80%", height: "100%" },
    y: { width: "100%", height: "80%" },

    viewShot: {
		width: "100%",
		height: "100%",
		position: "absolute",
		justifyContent: "center",
			alignItems: "center",
		// zIndex: 21,
		// opacity: 0
	},

    menuButton: {
        width: 70,
        height: 70,
        borderRadius: 40,

        backgroundColor: "rgb(255, 255, 255)",
        borderColor: "rgb(235, 235, 235)",
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        marginTop: 20
    },
    menuButtonIcon: {
        color: "#fff",
        fontSize: 40,
        fontFamily: "inter-black",
    }
})