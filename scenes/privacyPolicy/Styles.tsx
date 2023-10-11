import { StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";

export default StyleSheet.create({
    ...MenuBundle,

    privacyPolicyContainer: {
        width: "100%",
        flex: 8,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        paddingHorizontal: 20
    },
    scrollContainer: {
        width: "100%",
        height: "100%",

        paddingHorizontal: 20,
    },
    footer: {
        width: "100%",
        flex: 1,

        paddingHorizontal: 40,
    },
    privacyPolicyText: {
        fontSize: 18,
        color: "#000",
        marginBottom: 5,
        fontFamily: "manrope-light",
    },
    bulletText: {
        fontFamily: "manrope-black",
        fontSize: 16,
        marginVertical: 4
    }
});
