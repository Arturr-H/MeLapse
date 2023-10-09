import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        height: "100%",
    
        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    
        zIndex: 10
    },
    modalContainerWrapper: {
        width: "100%",
        height: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    modalContainer: {
        width: "100%",
        height: "100%",
    },

    modal: {
        width: "70%",
        minHeight: "20%",

        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 2,
        borderRadius: 20
    },
    modalHeader: {
        width: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        paddingHorizontal: 20,
        paddingTop: 30
    },
    modalBody: {
        width: "100%",

        display: "flex",
            alignItems: "center",

        paddingHorizontal: 20
    },
    modalFooter: {
        marginTop: 20,
        width: "100%",

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
            alignItems: "center",

        gap: 10,
        padding: 10
    },

    modalButton: {
        flex: 1,
        height: 50,
        minHeight: 50,

        borderWidth: 2,
        borderRadius: 10,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "manrope-black",

        textTransform: "uppercase",
    },

    modalDescritionText: {
        color: "#bbb",
        fontSize: 16,
        fontFamily: "manrope-light",
        textAlign: "center"
    },
    modalHeaderText: {
        color: "#000",
        fontSize: 28,
        fontFamily: "manrope-black",
    },

    modalBackground: {
        width: WIDTH,
        height: HEIGHT,
        position: "absolute",
        backgroundColor: "#00000088",
    }
})