import { Animated } from "react-native";

/* Smoothly merge animations which will be called multiple times */
export function spring(anim: Animated.Value | Animated.ValueXY, toValue: number | { x: number, y: number }): void {
    Animated.spring(anim, { toValue, useNativeDriver: true, speed: 100 }).start();
}
