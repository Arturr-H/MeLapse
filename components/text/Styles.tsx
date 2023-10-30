import { StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
import { Colors } from "../../styleBundles/Colors";

export default StyleSheet.create({
    ...MenuBundle,

    titleContainer: {
        display: "flex",
        flexDirection: "row",

        justifyContent: "space-between",
        alignItems: "center"
    },
    questionMarkButtonTouchable: {
        width: 28,
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        transform: [{ translateX: 6 }]
    },
    questionMarkButton: {
        fontSize: 20,
        fontFamily: "manrope-black",
        color: Colors.text.light,
        opacity: 0.7
    },
    headerCentered: {
        textAlign: "center",

        fontFamily: "manrope-black",
        fontSize: 24,
    },

    h2: {
        fontFamily: "manrope-black",
        fontSize: 24,
        marginBottom: 5,

        color: "#000"
    },
    h3: {
        fontFamily: "manrope-black",
        fontSize: 16,
        marginBottom: 5,

        color: Colors.text.light
    },
})