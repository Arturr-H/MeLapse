import { StyleSheet } from "react-native";

export default StyleSheet.create({
    arrowContainer: {
        width: "50%",
        aspectRatio: 1,

        backgroundColor: "#eee",
        borderColor: "#ddd",
        borderWidth: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        marginBottom: 20,
        borderRadius: 20
    },
    arrow: {
        width: "60%",
        objectFit: "contain"
    }
});
