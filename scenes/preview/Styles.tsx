import { Dimensions, StyleSheet } from "react-native";

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
            alignItems: "center"
    },
    absolute: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        position: "absolute",
        zIndex: 3,
    },
    posterContainer: {
        position: "absolute",
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 5
    },

    buttonRow: {
        width: "100%",
        height: "100%",
        flex: 1,

        display: "flex",
        
        flexDirection: "column",
        justifyContent: "space-between",
            alignItems: "center",
    },
    row: {
        width: "100%",
        height: 100,

        display: "flex",
        justifyContent: "center",
        paddingHorizontal: "12%"
    },
    acceptButton: {
        width: "100%",
        height: 70,
        borderRadius: 20,

        backgroundColor: "rgb(90, 200, 245)",
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    acceptButtonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",

        transform: [{ skewX: "-8deg" }],
    },


    deleteButton: {
        width: 70,
        height: 70,
        borderRadius: 40,

        backgroundColor: "rgb(90, 200, 245)",
        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        /// Just for design, for some reason you need
        /// to nudge circles a bit to make them look
        /// like they are aligned with other content
        /// even though they are
        transform: [{ translateX: -4 }]
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 20,
        fontFamily: "inter-black",
    },

    backgroundContainer: {
        width: "100%",
        backgroundColor: "red",

        position: "absolute",
        zIndex: -4,

        display: "flex",
        flexDirection: "column"
    },
    textContainer: {
        position: "absolute",
        width: WIDTH,
        height: "100%",
        // position: "absolute",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    backgroundTextRow: {
        width: WIDTH*4,

        display: "flex",
        flexDirection: "row",
    },
    backgroundText: {
        fontSize: 45,
        color: "#eee",
        fontFamily: "inter-black",
    },

    denyStampContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        pointerEvents: "none",

        zIndex: 5,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    deniedMarkImage: {
        width: "60%",
        objectFit: "contain",
        position: "absolute",
    },
    deniedStampImage: {
        width: "60%",
        objectFit: "contain",
        position: "absolute",
    },

    garbageFolderContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        pointerEvents: "none",

        zIndex: 5,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    garbageFolder: {
        position: "absolute",
        bottom: -WIDTH / 3,
        opacity: 0,

        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },

    folderImageFrontContainer: {
        width: "70%",
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    folderImageFront: {
        width: "100%",
        objectFit: "contain",
        zIndex: 3
    },
    folderImageOverlay: {
        width: "100%",
        height: HEIGHT/16,
        position: "absolute",
        backgroundColor: "#fff",
        zIndex: 1,
    },

    folderImageBack: {
        zIndex: -1,
        width: "70%",
        objectFit: "contain",
        position: "absolute",
    },
})