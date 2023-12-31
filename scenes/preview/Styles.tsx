import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "../../styleBundles/Colors";

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
    absolute: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        position: "absolute",
        zIndex: 3,
        width: WIDTH
    },
    posterContainer: {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 5
    },

    buttonRow: {
        width: "100%",
        height: "100%",
        flex: 1,

        display: "flex",
        
        flexDirection: "column",
        justifyContent: "space-between",
            alignItems: "center",
    },
    row: {
        width: "100%",
        height: 100,

        display: "flex",
        justifyContent: "center",
        paddingHorizontal: "12%",
    },
    imageRow: {
        width: "100%",
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

            paddingVertical: 40
    },
    image: {
        width: "100%",
        height: "100%",

        objectFit: "contain",
    },
    acceptButton: {
        width: "100%",
        height: 70,
        borderRadius: 20,

        backgroundColor: Colors.blue.default,
        borderColor: Colors.blue.darkened,
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    acceptButtonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",

        transform: [{ skewX: "-8deg" }],
    },


    deleteButton: {
        width: 70,
        height: 70,
        borderRadius: 40,

        backgroundColor: Colors.blue.default,
        borderColor: Colors.blue.darkened,
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        /// Just for design, for some reason you need
        /// to nudge circles a bit to make them look
        /// like they are aligned with other content
        /// even though they are
        transform: [{ translateX: -4 }]
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",
    },

    backgroundContainer: {
        width: "100%",
        backgroundColor: "red",

        position: "absolute",
        zIndex: -4,

        display: "flex",
        flexDirection: "column"
    },
    textContainer: {
        position: "absolute",
        width: WIDTH,
        height: "100%",
        // position: "absolute",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    backgroundTextRow: {
        width: WIDTH*4,

        display: "flex",
        flexDirection: "row",
    },
    backgroundText: {
        fontSize: 45,
        color: "#eee",
        fontFamily: "inter-black",
    },

    denyStampContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        pointerEvents: "none",

        zIndex: 5,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    deniedMarkImage: {
        width: "60%",
        objectFit: "contain",
        position: "absolute",
    },
    deniedStampImage: {
        width: "60%",
        objectFit: "contain",
        position: "absolute",
    },

    garbageFolderContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        pointerEvents: "none",

        zIndex: 5,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    garbageFolder: {
        position: "absolute",
        bottom: -WIDTH / 3,
        opacity: 0,

        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    folderImageFrontContainer: {
        width: "70%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    folderImageFront: {
        width: "100%",
        objectFit: "contain",
        zIndex: 3
    },
    folderImageOverlay: {
        width: "100%",
        height: HEIGHT/16,
        position: "absolute",
        backgroundColor: "#fff",
        zIndex: 1,
    },

    folderImageBack: {
        zIndex: -1,
        width: "70%",
        objectFit: "contain",
        position: "absolute",
    },

    numberContainer: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        position: "absolute",
        height: 220,
    },

    photoTextContainer: {
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        position: "absolute",
        zIndex: 2,
    },
    photoText: {
        fontFamily: "inter-extrabold",
        fontSize: 50,
        width: "100%",
        textAlign: "center",
        position: "absolute",

        backgroundColor: "#fff",
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
        // opacity: 0.42,
        // position: "absolute",
        transform: [{ skewX: "-10deg" }],
        // backgroundColor: "blue"
    },
    fireTextContainer: {
        position: "absolute"
    },
    fireText: {
        fontFamily: "inter-black",
        fontSize: 240,
    },
    newStreakText: {
        position: "absolute",
        bottom: 50,

        fontFamily: "manrope-black",
        fontSize: 32,
        color: "#ddd"
    },
    blurView: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    skewed: {
        transform: [{ skewX: "-10deg" }, { translateX: -50 }],
    },
})