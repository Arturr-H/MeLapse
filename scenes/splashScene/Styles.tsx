import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
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
        flexDirection: "column",

        width: "100%",
        height: "100%",
    },
})