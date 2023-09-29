import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
export const OVERLAY_FEATURE_HEIGHT = 10;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#272727",

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
        zIndex: 52
    },

    /* Camera button */
    bottomBar: {
        position: "absolute",
        bottom: 50,

        display: "flex",
        flexDirection: "row",
        gap: 20,

        /// needs to be > 3
        zIndex: 4
    },
    bottomBarTile: {
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
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
    },

    flashRingLightContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",

        zIndex: 51
    },
    flashRingLight: {
        width: "100%",
        height: "100%",
    },

    flashlightButtonContainer: {
        width: 50,
        height: 50,
        bottom: 0,

        display: "flex",
        justifyContent: "flex-end",
            alignItems: "center",

        borderRadius: 25,

        paddingVertical: 10,
    },
    flashlightButtonBgLine: {
        width: 2,
        height: 40,
        backgroundColor: "rgb(235, 235, 235)",

        borderRadius: 2,
        position: "absolute",

        bottom: 0,
        transform: [{ translateY: -25 }],
    },
    flashlightButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderColor: "rgb(235, 235, 235)",
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        position: "absolute",

        borderRadius: 25
    },
    flashlightButtonIcon: {
        pointerEvents: "none",
        color: "#fff",
        fontSize: 30,
        fontFamily: "inter-black",
    },

    calibratedOverlayContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",

        zIndex: 1,
        pointerEvents: "none"
    },
    calibratedFeature: {
        position: "absolute",
        backgroundColor: "#fff",

        height: OVERLAY_FEATURE_HEIGHT,
        borderRadius: OVERLAY_FEATURE_HEIGHT / 2,
        opacity: 0.4,
    },
    
    faceRotationViewContainer: {
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

    },
    alignGrid: {
        width: "100%",
        height: "100%",
        opacity: 0.5,

        objectFit: "contain",
        position: "absolute",
    },


    faceRotationImageContainer: {
        position: "absolute",
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    rotationMaskedView: {
        height: "100%",
        width: "50%",
        position: "absolute",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    rotationMaskElement: {
        height: "100%",
        width: "100%",
        
        position: "absolute",
        objectFit: "contain",
    },
    faceRotationImage: {
        width: "100%",
        height: "100%",

        objectFit: "contain",
        transform: [{ scale: 1.2 }]
    },
    gradientOverlayContainer: {
        width: "100%",
        height: "100%",

        position: "absolute"
    },
    gradientOverlay: {
        width: "100%",
        height: "100%",
    }
})