import AsyncStorage from "@react-native-async-storage/async-storage";
import { FaceData, getFaceFeatures } from "../../functional/FaceDetection";

/** Has methods for working with face calibration */
export default class CalibrationData {
    /** May return null if corrupted / has not been set yet */
    static async getCalibration(): Promise<FaceData | null> {
        try {
            return getFaceFeatures(JSON.parse(await AsyncStorage.getItem("faceCalibration") ?? "!"))
        }catch {
            return null
        }
    }

    /** Stringify and save */
    static async setCalibration(faceData: FaceData): Promise<void> {
        await AsyncStorage.setItem("faceCalibration", JSON.stringify(faceData))
    }
}
