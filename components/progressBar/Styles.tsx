import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    progressBarShell: {
        width: "100%",
        height: 18,
        
        backgroundColor: "#fff",
        borderColor: "#eee",
        borderWidth: 2,
        borderRadius: 9,

        overflow: "hidden"
    },
    progressBarInner: {
        backgroundColor: "rgb(90, 200, 245)",
        width: "100%",
        height: "100%"
    }
})