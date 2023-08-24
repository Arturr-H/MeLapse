import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    button: {
        width: "100%",
        height: 50,
        
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,
        borderRadius: 15,

        backgroundColor: "rgb(90, 200, 245)",

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",

        textTransform: "uppercase"
    }
})