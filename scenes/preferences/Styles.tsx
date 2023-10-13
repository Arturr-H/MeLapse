import { StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";

export default StyleSheet.create({
    ...MenuBundle,

    buttonText: {
        color: "#000",
        fontSize: 20,
        fontFamily: "inter-black",
    },
    buttonTextActive: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",
    },


    scrollViewContainer: {
        width: "100%",
        flex: 1,
    }
})