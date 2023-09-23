import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
            alignItems: "center"
    },
    camera: {
        width: "100%",
        height: "100%",
    },
    absolute: {
        width: "100%",
        height: "100%",
        position: "absolute",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

    },

    middleFace: {
        width: "80%",
        height: "100%",
        objectFit: "contain",

        zIndex: 4,
    },

    maskContainer: {
        backgroundColor: "transparent",
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    maskImage: {
        opacity: 1,
        width: "65%",
        height: "100%",
        objectFit: "contain",
        backgroundColor: "transparent"
    },

    infoTextContainer: {
        position: "absolute",
        bottom: 0,
        height: "20%",
        width: "100%",

        display: "flex",

        paddingHorizontal: 40,
        zIndex: 5
    },
    infoText: {
        fontSize: 18,
        fontWeight: "400",

        color: "#dedede",
        textAlign: "center",

        position: "absolute",
    },

    transitioner: {
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        position: "absolute",
    },

    headTiltContainer: {
        width: "100%",
        height: "40%",

        position: "absolute",
        top: 0,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    headTiltImage: {
        width: 60,
        objectFit: "contain",
        position: "absolute"
    },

    cancelButton: {
        height: 50,

        position: "absolute",

        top: 60,
        left: 20,
        zIndex: 50
    },
    cancelButtonText: {
        fontSize: 24,
        color: "#ddd",
        fontWeight: "600"
    },
})