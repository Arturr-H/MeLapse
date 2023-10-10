/* Imports */
import React, { RefObject } from "react";
import Styles from "./Styles";
import { Animated, Dimensions, Easing, Image, View } from "react-native";
import { Animator } from "../../components/animator/Animator";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

/* Interfaces */
interface Props {
    side: "back" | "front"
}
interface State {
    opacity: Animated.Value,
    folderY: Animated.Value,
}

/* Constants */
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class GarbageFolder extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            opacity: new Animated.Value(0),
            folderY: new Animated.Value(WIDTH / 3),
        };

        /* Bindings */
        this.intro = this.intro.bind(this);
    };

    /** Animate intro */
    intro(hidePosterCallback?: () => void, callback?: () => void): void {
        let common = { useNativeDriver: true, duration: 1000, easing: Easing.inOut(Easing.exp) };
        Animated.timing(this.state.opacity, { toValue: 1, ...common }).start();
        Animated.timing(this.state.folderY, { toValue: - WIDTH / 2, ...common }).start(hidePosterCallback);

        setTimeout(() => {
            impactAsync(ImpactFeedbackStyle.Medium);
        }, 1400);

        setTimeout(() => {
            Animated.timing(this.state.opacity, { toValue: 0, ...common }).start();
            Animated.timing(this.state.folderY, { toValue: WIDTH / 3, ...common }).start(callback);
        }, 1200);
    }

    render() {
        let opacity = this.state.opacity;
        let transform : any = [
            { translateY: this.state.folderY }
        ];

		return (
            <View
                style={[
                    Styles.garbageFolderContainer,
                    { zIndex: this.props.side === "front" ? 1 : -1 }
                ]}
            >
                <Animated.View style={[Styles.garbageFolder, { transform, opacity }]}>
                    {this.props.side === "back"
                    
                    /* Back */
                    ? <Animated.Image
                        style={Styles.folderImageBack}
                        source={require("../../assets/images/folder/folder-back.png")}
                    />

                    /* Front */
                    : <View style={Styles.folderImageFrontContainer}>
                        <Animated.Image
                            style={Styles.folderImageFront}
                            source={require("../../assets/images/folder/folder-front.png")}
                        />

                        <View style={Styles.folderImageOverlay} />
                    </View>
                    }
                </Animated.View>
            </View>
		);
	}
}
