import { ActivityIndicator, View } from "react-native";
import React from "react";
import Styles from "./Styles";

export class SplashScene extends React.PureComponent {
    constructor(props: {}) {
        super(props);
    }

    /* Render */
    render() {
        return (
            <View style={Styles.container}>
                <ActivityIndicator />
            </View>
        );
    }
}
