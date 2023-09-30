import React from "react";
import { Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

type Callback = () => void;

/* Interface */
interface Props {
    onTouchStart: (callback: Callback) => void,
    onTouchEnd: () => void,

    callback: Callback,

    direction: "forwards" | "backwards"
}

/** Timewarp button to watch next or previous images  */
export default class TimewarpButton extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <TouchableHighlight
                onPressIn={() => {
                    impactAsync(ImpactFeedbackStyle.Light);
                    this.props.onTouchStart(this.props.callback);
                }}
                onPressOut={() => this.props.onTouchEnd()}
                underlayColor={"rgb(80, 190, 245)"}
                style={Styles.timewarpButton}
                children={<Text style={Styles.timewarpButtonText}>{this.props.direction === "forwards" ? "▶︎" : "◀︎"}</Text>}
            />
        )
    }
}
