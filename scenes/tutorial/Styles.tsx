import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
import { Colors } from "../../styleBundles/Colors";
/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    ...MenuBundle,

    pageContainer: {
        width: "100%",
        flex: 8,
    },
    footer: {
        width: "100%",
        flex: 1,

        display: "flex",
        alignItems: "center",
    },

    dotContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 6,
        padding: 6,
        borderRadius: 12,

        backgroundColor: "#eee",
        marginTop: 10
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,

        backgroundColor: "#bbb"
    },
    active: {
        backgroundColor: "#fff"
    },

    scrollView: {
        width: "100%",
        height: "100%"
    },
    page: {
        width: WIDTH,
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "column"
    },
    pageHeader: {
        paddingHorizontal: 40,
        width: "100%",
        flex: 1,

        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "column"
    },
    pageBody: {
        paddingHorizontal: 40,
        width: "100%",
        flex: 5,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "column",
    },
    pageFooter: {
        paddingHorizontal: 40,
        width: "100%",
        flex: 1,
    },

    textContainer: {
        width: "100%",
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    infoText: {
        textAlign: "center",
        fontFamily: "manrope-light",
        width: "100%",
        fontSize: 20,
        color: Colors.text.light
    }
})