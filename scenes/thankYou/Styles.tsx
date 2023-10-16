import { StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";

export default StyleSheet.create({
    ...MenuBundle,

    body: {
        width: "100%",
        flex: 8,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        paddingHorizontal: 20
    },
    footer: {
        width: "100%",
        flex: 1,

        paddingHorizontal: 40,
    },
    text: {
        fontSize: 18,
        color: "#ddd",
        marginBottom: 5,
        fontFamily: "manrope-light",
    },
    bulletText: {
        fontFamily: "manrope-black",
        fontSize: 16,
        marginVertical: 4
    }
});
