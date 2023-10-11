import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";
/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    ...MenuBundle,

    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        width: "100%",
        height: "100%",

        paddingHorizontal: 30
    },
    containerInner: {
        justifyContent: "center",
        
        display: "flex",
        flexDirection: "column",
        gap: 10,

        height: "50%",
    },


    column: {
        width: "100%",
        height: "100%",

        display: "flex",
        flexDirection: "column",
        paddingHorizontal: 30
    },
    body: {
        width: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "center",
    },
    footer: {
        width: "100%",
        display: "flex",

        paddingBottom: 20
    },
    gap: {
        display: "flex",
        justifyContent: "center",
        gap: 10
    }
})