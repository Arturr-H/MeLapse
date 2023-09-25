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

    let midEye = {
        x: (res.leftEyePosition.x + res.rightEyePosition.x) / 2,
        y: (res.leftEyePosition.y + res.rightEyePosition.y) / 2
    };
    let midMouth = {
        x: (res.leftMouthPosition.x + res.rightMouthPosition.x) / 2,
        y: (res.leftMouthPosition.y + res.rightMouthPosition.y) / 2,
    };

    let data = {
        deltaEye: {
            x: res.rightEyePosition.x - res.leftEyePosition.x,
            y: Math.abs(res.rightEyePosition.y - res.leftEyePosition.y),
        },
        deltaMouth: {
            x: res.rightMouthPosition.x - res.leftMouthPosition.x,
            y: Math.abs(res.rightMouthPosition.y - res.leftMouthPosition.y),
        },
        midEye,
        midMouth,
        middle: c_div(c_add(midEye, midMouth), { x: 2, y: 2 })
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

/// Rewritten 4 times...
export function getTransforms(faceData: FaceData, calibrated: FaceData) {
    let scale = (
        hypotenuse(calibrated.midMouth, calibrated.midEye)
        / hypotenuse(faceData.midMouth, faceData.midEye)
    );

    let translateX = (
        ((calibrated.leftEyePosition.x - faceData.leftEyePosition.x) + (calibrated.rightEyePosition.x - faceData.rightEyePosition.x)) / 2
    );
    let translateY = (
        ((calibrated.leftEyePosition.y - faceData.leftEyePosition.y) + (calibrated.rightEyePosition.y - faceData.rightEyePosition.y)) / 2
    );

    const c_mp_y = (calibrated.leftMouthPosition.y + calibrated.rightMouthPosition.y) / 2;
    const c_ep_y = (calibrated.leftEyePosition.y + calibrated.rightEyePosition.y) / 2;
    const f_mp_y = (faceData.leftMouthPosition.y + faceData.rightMouthPosition.y) / 2
    const f_ep_y = (faceData.leftEyePosition.y + faceData.rightEyePosition.y) / 2;

    const centerAdd = 
        ((c_mp_y - c_ep_y) - (f_mp_y - f_ep_y)) / 2;
    translateY += centerAdd;

    let rot = (
        Math.atan2(calibrated.rightEyePosition.y - calibrated.leftEyePosition.y, calibrated.rightEyePosition.x - calibrated.leftEyePosition.x) -
        Math.atan2(faceData.rightEyePosition.y - faceData.leftEyePosition.y, faceData.rightEyePosition.x - faceData.leftEyePosition.x)
    );
    let centerY = (faceData.midEye.y + faceData.midMouth.y) / 2;
    let centerX = (faceData.midEye.x + faceData.midMouth.x) / 2;
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

    const rotDeg = (rot * (180 / Math.PI)) / 45;
    const rotAddXMax = (faceData.deltaEye.x + faceData.deltaMouth.x) / 2;
    const rotAdd = rotAddXMax * rotDeg;
    
    translateX -= rotAdd / 2;

    return [
        { scale },
        { translateX },
        { translateY },
        
        //@ts-ignore
        ...rotation.transform,
    ]
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


/// Get transforms for the aligning face
export interface AlignTransforms {
    translate: Coordinate,
    scale: number,
    rotation: number,
};
export function getAlignTransforms(faceData: FaceData, calibrated: FaceData): AlignTransforms {
    let scale = 
        (faceData.deltaEye.x / calibrated.deltaEye.x +
        faceData.deltaMouth.x / calibrated.deltaMouth.x) / 2;

    let rotation = (
        Math.atan2(calibrated.rightEyePosition.y - calibrated.leftEyePosition.y, calibrated.rightEyePosition.x - calibrated.leftEyePosition.x) -
        Math.atan2(faceData.rightEyePosition.y - faceData.leftEyePosition.y, faceData.rightEyePosition.x - faceData.leftEyePosition.x)
    );

    let translate = {
        x: -(faceData.midEye.x - calibrated.midEye.x) / 5,
        y: -(faceData.midEye.y - calibrated.midEye.y) / 5
    };

    return { scale, rotation, translate };

}
