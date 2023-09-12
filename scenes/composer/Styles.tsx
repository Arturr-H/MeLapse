import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    keyboardAvoidingView: {
        flex: 1,
        paddingHorizontal: 30,

        gap: 10,
    },

    header: {
        fontFamily: "inter-extrabold",
        fontSize: 42,

        marginBottom: 10,
    },
    header2: {
        fontFamily: "inter-bold",
        fontSize: 22,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        color: "#d0d0d0",
        marginBottom: 5,
        fontWeight: "300",
    },
    paragraphWhite: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "800",

        paddingHorizontal: 10,
        textAlign: "center"
    },
    italic: {
        fontStyle: "italic",
        color: "#5c5c5c",
        fontWeight: "200"
    },

    row: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 20
    },
    tile: {
        flex: 1,
    },

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
        flex: 1,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
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

    hr: {
        width: "100%",
        height: 2,
        backgroundColor: "#00000010",
        borderRadius: 1,

        marginTop: 15,
        marginBottom: 10
    }
})