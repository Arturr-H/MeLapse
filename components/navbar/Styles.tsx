import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const PADDING = 10;
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    navbarWrapper: {
        width: WIDTH - PADDING*2,
        height: 80,

        overflow: "hidden",

        position: "absolute",
        bottom: PADDING,
        left: PADDING,
        
        borderRadius: 40
    },
    navbarInner: {
        width: "100%",
        height: "100%",

        display: "flex",
        flexDirection: "row",

        justifyContent: "space-between",
        padding: PADDING / 2
    },

    button: {
        height: "100%",
        aspectRatio: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    icon: {
        width: 35,
        height: 35
    }
})