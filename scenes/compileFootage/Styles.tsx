import { StyleSheet } from "react-native";
import { WIDTH } from "../result/Result";

const EMOJI_MOVE = WIDTH / 2.5;

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    padding: {
        paddingHorizontal: 40,
        display: "flex",
        justifyContent: "center",
            alignItems: "center",

        flex: 1,
    },
    innerContainer: {
        width: "100%",
    },
    thankYou: {
        fontFamily: "inter-black",
        fontSize: 40,
        textAlign: "center"
    },

    amountOfImagesCount: {
        fontFamily: "inter-black",
        fontSize: 80
    },
    amountOfImagesText: {
        fontSize: 24,
        fontWeight: "400",
        color: "#ddd"
    },

    emojiView: {
        width: "100%",
        height: "100%",
        position: "absolute",

        display: "flex",
        justifyContent: "space-between",
            alignItems: "center",
        flexDirection: "column",

        gap: 10,
        opacity: 0.5
    },
    emojiViewBlur: {
        width: "100%",
        height: "100%",
        zIndex: 10,
        position: "absolute",
    },
    emojiCorner: {
        flex: 1,
        width: "100%",

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
    },
    emojiCornerTextTop: {
        fontSize: WIDTH / 1,
        position: "absolute",

        transform: [{ translateX: -EMOJI_MOVE }, { translateY: -EMOJI_MOVE*0.4 }, { rotate: "-35deg" }, { scaleY: -1 }]
    },
    emojiCornerTextBottom: {
        fontSize: WIDTH / 1,
        position: "absolute",

        transform: [{ translateX: EMOJI_MOVE }, { translateY: EMOJI_MOVE*0.4 }, { rotate: "-35deg" }, { scaleX: -1 }]
    },

    loadingContainer: {
        width: "100%",
        position: "absolute",
        bottom: 20,

        display: "flex",
        justifyContent: "center",
            alignItems: "center",
        flexDirection: "row",
        gap: 10,
    },
    loadingText: {
        fontSize: 24,
        color: "#ddd",
        fontWeight: "500"
    },

    cancelButton: {
        height: 50,

        position: "absolute",

        top: 60,
        left: 20,
        zIndex: 50
    },
    cancelButtonText: {
        fontSize: 24,
        color: "#ddd",
        fontWeight: "600"
    }
});
