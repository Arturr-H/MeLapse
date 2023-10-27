import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
import { Colors } from "../../styleBundles/Colors";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    ...MenuBundle,

    mainContainer: {
        flex: 1,
        display: "flex",

        justifyContent: "center",
            alignItems: "center",

        paddingVertical: 40,
        backgroundColor: "#fff",
        width: "100%",
        height: "100%"
    },
    headerContainer: {
        width: "100%",
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: "10%"
    },
    container: {
        backgroundColor: "#fff",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
            alignItems: "center",

        width: "100%",
        height: "100%"
    },
    camera: {
        width: "100%",
        height: "100%",

        backgroundColor: "blue",
    },

    cameraCutoutContainer: {
        flex: 3,
        width: "100%",
        
        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    maskedView: {
        position: "absolute",
        width: "100%",
        height: HEIGHT,
    },

    middleFace: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        position: "absolute",

        zIndex: 5,
    },
    maskContainer: {
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
            
    },
    maskImage: {
        width: "100%",
        height: "41%",
        objectFit: "contain",
        opacity: 1
    },

    infoTextContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 40,

        zIndex: 5,
        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    infoText: {
        fontSize: 18,
        width: "100%",
        fontFamily: "manrope-light",

        color: Colors.text.light,
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
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 1,
        width: "100%",

        position: "absolute",
        bottom: 60,
        zIndex: 6
    },
    headTiltImage: {
        width: 60,
        objectFit: "contain",
        position: "absolute"
    },

    cancelButton: {
        height: 50,

        position: "absolute",

        top: 10,
        left: 20,
        zIndex: 50
    },
    cancelButtonText: {
        fontSize: 24,
        color: "#ddd",
        fontWeight: "600"
    },
})