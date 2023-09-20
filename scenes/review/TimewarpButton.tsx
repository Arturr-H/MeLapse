import React from "react";
import { Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";

type Callback = () => void;

/* Interface */
interface Props {
    onTouchStart: (callback: Callback) => void,
    onTouchEnd: (callback: Callback) => void,

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
                onPressIn={() => this.props.onTouchStart(this.props.callback)}
                onPressOut={() => this.props.onTouchEnd(this.props.callback)}
                underlayColor={"rgb(80, 190, 245)"}
                style={Styles.timewarpButton}
                children={<Text style={Styles.timewarpButtonText}>{this.props.direction === "forwards" ? "👉" : "👈"}</Text>}
            />
        )
    }
}
