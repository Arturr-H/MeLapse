

import React, { RefObject } from "react";
import { Animated, Easing, Text, View } from "react-native";

type Ball = { ball: { x: number, y: number }, color?: "blue" | "red" | "yellow" | "orange" | "pink" | "green" | "brown" };
interface State {
    balls: Ball[],
}
interface Props {
}

/** Displays a debug overlay, with dots to mark
 * coordinates.
 * 
 * ## Examples
 * ```
 * 
 * // Text overlay
 * 
 * 
 * // Coordinates
 * this.debugRef.current.setBalls([
 *      { balls: [
 *          { x: 150, y: 200 },
 *          { x: 100, y: 230 },
 *      ], "yellow" }
 * 
 *      { balls: [
 *          { x: 40, y: 32 },
 *      ], "blue" }
 * ])
 * ```
*/
export class DebugDots extends React.PureComponent<Props, State> {
    text: any = { _pad: "", __pad: "", ___pad: "" };
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            balls: [],
        };

        this.setBalls = this.setBalls.bind(this);
    };

    /* Lifetime */
    componentDidUpdate(): void {
    }

    /** Mark coordinates */
    setBalls(bls: {
        balls: { x: number, y: number }[],
        color?: "blue" | "red" | "yellow" | "orange" | "pink" | "green" | "brown"
    }[]): void {
        let balls: Ball[] = [];

        bls.forEach(e => {
            for (let i = 0; i < e.balls.length; i++) {
                const ball = e.balls[i];
                
                balls.push({ ball, color: e.color });
            }
        })

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
                            { translateX: e.ball.x - 2.5 },
                            { translateY: e.ball.y - 2.5 },
                        ],
                        backgroundColor: e.color,
                        borderRadius: 5,
                        zIndex: 2,

                        position: "absolute"
                    }}
                />)}
            </View>
        );
    }
}
