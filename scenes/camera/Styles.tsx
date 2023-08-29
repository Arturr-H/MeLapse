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

    alignFaceContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 120,
        width: 90
    },
    alignFace: {
        // opacity: 0.1,
        width: "100%",
        position: "absolute",
        objectFit: "contain"
    },

    /* Camera button */
    cameraButtonWrapper: {
        position: "absolute",
        bottom: 50,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "column",
        gap: 20,

        /// needs to be > 3
        zIndex: 4
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
        borderRadius: 49,

    },

    viewShot: {
		width: "100%",
		height: "100%",
		position: "absolute",
		justifyContent: "center",
			alignItems: "center",
        zIndex: 10,
		// zIndex: 21,
		// opacity: 0
	},

    /* Options / menu button */
    menuButton: {
        width: 50,
        height: 50,
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

        marginTop: 20,
        alignSelf: "flex-start",
        marginLeft: "8%"
    },
    innerMenuButton: {
        backgroundColor: "rgb(255, 255, 255)",
        width: "100%",
        height: "100%",
        position: "absolute",
        borderRadius: 40
    },
    menuButtonIcon: {
        pointerEvents: "none",
        color: "#fff",
        fontSize: 30,
        fontFamily: "inter-black",
    }
})