import { Dimensions } from "react-native";
import { withAnchorPoint } from "react-native-anchor-point";

interface Coordinate { x: number, y: number }

/* The detect faces function will return an any object,
    and we want to convert that to this interface */
export interface FaceDetectionResult {
    bounds: {
        origin: Coordinate,
        size: { height: number, width: number }
    },

    /* Cheeks */
    leftCheekPosition: Coordinate,
    rightCheekPosition: Coordinate,

    /* Ears */
    leftEarPosition: Coordinate,
    rightEarPosition: Coordinate,

    /* Eyes */
    leftEyePosition: Coordinate,
    rightEyePosition: Coordinate,
    rightEyeOpenProbability?: number,
    leftEyeOpenProbability?: number,

    /* Mouth */
    leftMouthPosition: Coordinate,
    rightMouthPosition: Coordinate,
    bottomMouthPosition: Coordinate,
    
    /* Nose */
    noseBasePosition: Coordinate,

    /* Probabilities */
    smilingProbability?: number,

    /* Rotation */
    rollAngle: number,
    yawAngle: number,

    /* Misc */
    faceID: number,
}

/* These fields are some extra fields which simplifies the
    process of working with the facial features */
export interface ExtraFaceData {
    deltaEye: Coordinate,
    deltaMouth: Coordinate,

    midEye: Coordinate,
    midMouth: Coordinate,

    middle: Coordinate,
}

export type FaceData = ExtraFaceData & FaceDetectionResult;
export function getFaceFeatures(obj: any): FaceData {
    let res = obj as FaceDetectionResult;
    let data = {
        deltaEye: {
            x: res.rightEyePosition.x - res.leftEyePosition.x,
            y: Math.abs(res.rightEyePosition.y - res.leftEyePosition.y),
        },
        deltaMouth: {
            x: res.rightMouthPosition.x - res.leftMouthPosition.x,
            y: Math.abs(res.rightMouthPosition.y - res.leftMouthPosition.y),
        },
        midEye: {
            x: (res.leftEyePosition.x + res.rightEyePosition.x) / 2,
            y: (res.leftEyePosition.y + res.rightEyePosition.y) / 2,
        },
        midMouth: {
            x: (res.leftMouthPosition.x + res.rightMouthPosition.x) / 2,
            y: (res.leftMouthPosition.y + res.rightMouthPosition.y) / 2,
        },
    };

    let extra: ExtraFaceData = {
        ...data,
        middle: c_div(c_add(data.midEye, data.midMouth), { x: 2, y: 2 })
    };

    return { ...res, ...extra }
}

/// ---------------------------------------------------- ///
/// -------| COMPARISONS TO THE CALIBRATED FACE |------- ///
/// ---------------------------------------------------- ///

/// Every field in this interface is a commparison
/// over the calibrated facial features and the current
/// facial features
interface CalibratedDelta {
    deltaEye: Coordinate,
    deltaMouth: Coordinate,
}
export function getCalibratedDifferences(curr: FaceData, calibrated: FaceData): CalibratedDelta {
    return {
        deltaEye: c_div(curr.deltaEye, calibrated.deltaEye),
        deltaMouth: c_div(curr.deltaMouth, calibrated.deltaMouth),
    }
}

/* Utility functions for `Coordinate` interface */
function c_sub(c1: Coordinate, c2: Coordinate): Coordinate {
    return { x: c1.x - c2.x, y: c1.y - c2.y }
}
function c_add(c1: Coordinate, c2: Coordinate): Coordinate {
    return { x: c1.x + c2.x, y: c1.y + c2.y }
}
function c_div(c1: Coordinate, c2: Coordinate): Coordinate {
    return { x: c1.x / c2.x, y: c1.y / c2.y }
}

/// Taken from my first facelapse prototype
export function getTransforms(faceData: FaceData, calibrated: FaceData) {
    let scale = (
        (
            hypotenuse(calibrated.rightEyePosition, calibrated.rightMouthPosition) /
            antiZero(hypotenuse(faceData.rightEyePosition, faceData.rightMouthPosition))
        ) + (
            hypotenuse(calibrated.leftEyePosition, calibrated.leftMouthPosition) /
            antiZero(hypotenuse(faceData.leftEyePosition, faceData.leftMouthPosition))
        )
    ) / 2;

    let translateX = (
        (((calibrated.leftEyePosition.x + calibrated.rightEyePosition.x) / 2) // mid y ttm
        - ((faceData.leftEyePosition.x + faceData.rightEyePosition.x) / 2)  // mid y stt
        +
        ((calibrated.leftMouthPosition.x + calibrated.rightMouthPosition.x) / 2) 
        - ((faceData.leftMouthPosition.x + faceData.rightMouthPosition.x) / 2))
        / 2
    );
    let translateY = (
        (((calibrated.leftEyePosition.y + calibrated.rightEyePosition.y) / 2) // mid y ttm
        - ((faceData.leftEyePosition.y + faceData.rightEyePosition.y) / 2)  // mid y stt
        +
        ((calibrated.leftMouthPosition.y + calibrated.rightMouthPosition.y) / 2) 
        - ((faceData.leftMouthPosition.y + faceData.rightMouthPosition.y) / 2))
        / 2
    );

    let rot = -faceData.rollAngle * (Math.PI / 180);
        // Math.atan2(calibrated.rightEyePosition.y - calibrated.leftEyePosition.y, calibrated.rightEyePosition.x - calibrated.leftEyePosition.x) -
        // Math.atan2(faceData.rightEyePosition.y - faceData.leftEyePosition.y, faceData.rightEyePosition.x - faceData.leftEyePosition.x);

    let centerY = 
        (((faceData.leftEyePosition.y + faceData.rightEyePosition.y) / 2) +
        ((faceData.leftMouthPosition.y + faceData.rightMouthPosition.y) / 2)) / 2;
    let centerX = 
        (((faceData.rightEyePosition.x + faceData.rightMouthPosition.x) / 2) +
        ((faceData.leftEyePosition.x + faceData.leftMouthPosition.x) / 2)) / 2;
    let rotation = withAnchorPoint(
        { transform: [{ rotate: rot + "rad" }]},
        { 
            x: (centerX) / Dimensions.get("window").width,
            y: (centerY) / Dimensions.get("window").height
        },
        {
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height
        }
    );

    //@ts-ignore
    return [...rotation.transform, { translateX }, { translateY }, { scale }]
}

/* Remove div by 0 */
function antiZero(number: number): number {
    return number === 0 ? 0.0001 : number
}

/* Calculate hypotenuse of two points ({ x: number, y: number }) */
function hypotenuse(p1: { x: number, y: number }, p2: { x: number, y: number }): number {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    return Math.hypot(dy, dx)
}
