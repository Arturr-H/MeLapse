import { StyleSheet } from "react-native";
import MenuBundle from "../../../../styleBundles/MenuBundle";

export default StyleSheet.create({
    ...MenuBundle,

    scrollViewContainer: {
        width: "100%",
        flex: 1,
    },

    composeButtonEmoji: {
        fontFamily: "inter-black",
        fontSize: 50,
        color: "#fff",
    },
    composeButtonText: {
        fontSize: 18,
        color: "#fff",

        paddingHorizontal: 10,
        textAlign: "center",
        fontFamily: "manrope-black",
    },
})