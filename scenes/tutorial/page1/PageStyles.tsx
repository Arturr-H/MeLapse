import { StyleSheet } from "react-native";
import { WIDTH } from "../../result/Result";

export default StyleSheet.create({
    shadowHeadContainer: {
        flex: 1.5,
        width: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flexDirection: "row",
        gap: 20
    },

    face: {
        flex: 1,
        overflow: "visible",
        objectFit: "contain",

        shadowColor: "#000",
        shadowRadius: 8,
        shadowOpacity: 0.15,
        shadowOffset: { height: 2, width: 0 },
    },
});
