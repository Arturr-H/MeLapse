import { Dimensions, StyleSheet } from "react-native";
import MenuBundle from "../../styleBundles/MenuBundle";

export default StyleSheet.create({
    ...MenuBundle,
    
    durationViewer: {
        width: "100%",
        height: 200,
        backgroundColor: "#eee",
        borderRadius: 10,

        borderColor: "#e3e3e3",
        borderWidth: 2,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flexDirection: "column"
    },
    durationViewerInner: {
        width: "100%",
    },
    durationViewerInnerCentered: {
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 1,
    },
    durationViewerInnerPadding: {
        padding: 5,
    },
    durationText: {
        fontFamily: "inter-black",
        fontSize: 60,
        color: "#fff",
    },

    framerateScrollerWrapper: {
        flex: 1,
        overflow: "hidden",

        backgroundColor: "rgb(90, 200, 245)",
        borderRadius: 10,

        borderColor: "rgb(80, 190, 245)",
        borderWidth: 2,

        marginTop: 10,
    },
    framerateScroller: {
        flex: 3,

        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    framerateSelectionContainer: {
        height: "100%",
        width: 80,

        display: "flex",
        justifyContent: "center",
            alignItems: "center"
    },
    framerateSelectionText: {
        fontFamily: "inter-black",
        fontSize: 50,
        color: "#fff",
    },

    framerateViewDotWrapper: {
        width: "100%",
        height: 10,
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "flex-start",
        flexDirection: "row",
        gap: 5
    },
    framerateViewDot: {
        width: 5,
        height: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        opacity: 0.5,
    },
    framerateViewDotActive: {
        opacity: 1,
    },

})