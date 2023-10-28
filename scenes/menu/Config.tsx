import AsyncStorage from "@react-native-async-storage/async-storage";

/* Types */
type StorageKey =
    "targetTimesPerDay" | "transformCamera"
    | "postProcessingTransform" | "saveSelfiesToCameraRoll"
    | "personalizedAds" | "cameraDirectionFront";

/* Enums */
export enum TargetTimesPerDay { None = 0, Once = 1, Twice = 2, Thrice = 3 }

/**
 * This is all the app's configuration which the user
 * defines in all subscenes of the `Menu.tsx` scene.
 * 
 * ### Usage
 * ```js
 * let config = await new AppConfig().tryLoad();
 * ```
*/
export default class AppConfig {
    private constructor() { throw new Error("AppConfig is not initializable. All methods are static") }

    /** How many (target) times per day to take selfie */
    static async getTargetTimesPerDay(): Promise<TargetTimesPerDay> { return await this.tryGet("targetTimesPerDay", TargetTimesPerDay.None) as TargetTimesPerDay }
    static async setTargetTimesPerDay(value: number) { await AsyncStorage.setItem("targetTimesPerDay", JSON.stringify(value)) }
    
    /** Transform camera in camera scene */
    static async getTransformCamera(): Promise<boolean> { return this.tryGet("transformCamera", true) }
    static async setTransformCamera(value: boolean) { await AsyncStorage.setItem("transformCamera", JSON.stringify(value)) }

    /** Also save selfie to camera roll */
    static async getSaveSelfiesToCameraRoll(): Promise<boolean> { return this.tryGet("saveSelfiesToCameraRoll", false) }
    static async setSaveSelfiesToCameraRoll(value: boolean) { await AsyncStorage.setItem("saveSelfiesToCameraRoll", JSON.stringify(value)) }

    /** Personalized ads */
    static async getPersonalizedAds(): Promise<boolean> { return this.tryGet("personalizedAds", true) }
    static async setPersonalizedAds(value: boolean) { await AsyncStorage.setItem("personalizedAds", JSON.stringify(value)) }

    /** If the camera direction is front (selfie-camera) */
    static async getCameraDirectionFront(): Promise<boolean> { return this.tryGet("cameraDirectionFront", true) }
    static async setCameraDirectionFront(value: boolean) { await AsyncStorage.setItem("cameraDirectionFront", JSON.stringify(value)) }

    private static async tryGet(key: StorageKey, default_: any): Promise<any> {
        try {
            /// "!" will never parse and will end up returning default_ in catch block
            return JSON.parse(await AsyncStorage.getItem(key) ?? "!");
        } catch {
            return default_;
        }
    }
}
