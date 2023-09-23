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


    numberContainer: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        position: "absolute",
        height: 220,
    },
    photoText: {
        fontFamily: "inter-extrabold",
        fontSize: 60,
        letterSpacing: 1,

        // transform: [{ skewX: "10deg" }]
    },

    numberTextContainer: {
        width: 500,
        height: 250,

        position: "absolute",
        overflow: "hidden",
    },
    textTransitioner: {
        width: "100%",
        height: "200%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
    },
    numberText: {
        fontFamily: "inter-black",
        fontSize: 250,

        color: "#000",
        opacity: 0.06,
        // position: "absolute",
        transform: [{ skewX: "-10deg" }],
        // backgroundColor: "blue"
    },
    skewed: {
        transform: [{ skewX: "-10deg" }, { translateX: -50 }],
    },


    slideContainer: {
        width: WIDTH*2,
        height: "50%",

        display: "flex",
        justifyContent: "space-around",
            alignItems: "center",

        flexDirection: "row",
        position: "absolute",
        left: 0,

        zIndex: -1,
    },

    buttonContainer: {
        width: 88,
        height: 88,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    button: {
        width: "100%",
        height: "100%",
        borderRadius: 44,
        position: "absolute"
    },
    buttonIcon: {
        width: 16,
        height: 16,
    },

    dateSliderContainer: {
        position: "absolute",
        bottom: 0,

        alignItems: "flex-end",
        paddingBottom: 125,
    },
    dateText: {
        fontFamily: "inter-extrabold",
        fontSize: 34,
        letterSpacing: 1,
        color: "#000",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        textTransform: "uppercase",
        width: WIDTH,
        textAlign: "center"
    }
})