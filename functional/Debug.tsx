

import React, { RefObject } from "react";
import { Animated, Easing, Text, View } from "react-native";

type Ball = { x: number, y: number };
interface State {
    balls: Ball[]
}
interface Props {
}

/// This class displays a big number (ex 5) and
/// makes a smooth transition into 6 (next number)
/// to show that another photo has been "secured".
export class Debug extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            balls: []
        };

        this.setBalls = this.setBalls.bind(this);
    };

    /* Lifetime */
    componentDidUpdate(): void {
    }

    setBalls(balls: Ball[]): void {
        this.setState({ balls });
    }

    render() {
        return (
            <View pointerEvents="none" style={{
                width: "100%",
                height: "100%",

                position: "absolute",
                zIndex: 1
            }}>
                {this.state.balls.map((e, index) => <View key={index}
                    style={{
                        width: 5,
                        height: 5,

                        transform: [
                            { translateX: e.x - 2.5 },
                            { translateY: e.y - 2.5 },
                        ],
                        backgroundColor: "yellow",
                        borderRadius: 5,
                        zIndex: 2,

                        position: "absolute"
                    }}
                />)}
            </View>
        );
    }
}
