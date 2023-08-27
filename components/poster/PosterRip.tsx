import React from "react";
import { Animated, Image, ImageSourcePropType } from "react-native";
import Styles from "./Styles";
import MaskedView from "@react-native-masked-view/masked-view";
import { PosterInner } from "./PosterInner";
import { LSImage } from "../../functional/Image";


interface RipProps {
    rotate: Animated.AnimatedInterpolation<string | number>,
    x: Animated.Value,
    opacity: Animated.Value,
    pos: "left" | "right",

    lsimage?: LSImage,

    delete?: () => void,
}
export default class PosterRip extends React.PureComponent<RipProps> {
    constructor(props: RipProps) {
        super(props);
    }

    /* Render */
	render() {
		return (
            <Animated.View
                style={[
                    Styles.maskedView,
                    {
                        transform: [
                            { rotate: this.props.rotate },
                            { translateX: this.props.x }
                        ],
                        opacity: this.props.opacity
                    }
                ]}>
                <MaskedView
                    maskElement={
                        this.props.pos === "left"
                            ? <Image style={Styles.imageMask} source={require("../../assets/images/masks/rip-mask-left.png")} />
                            : <Image style={Styles.imageMask} source={require("../../assets/images/masks/rip-mask-right.png")} />
                    }
                    style={this.props.pos === "right" && { right: 0.6 }}
                >
                    <PosterInner lsimage={this.props.lsimage} />
                </MaskedView>
            </Animated.View>
		);
	}
}
