import AsyncStorage from "@react-native-async-storage/async-storage";

/* Types */
type StorageKey = "targetTimesPerDay" | "username" | "transformCamera" | "postProcessingTransform" | "saveSelfiesToCameraRoll" | "personalizedAds";

/* Enums */
export enum TargetTimesPerDay { Once = 0, Twice = 1, Thrice = 2, NotSet = 3 }

/**
 * This is all the app's configuration which the user
 * defines in the `Preferences.tsx` scene.
 * 
 * ### Usage
 * ```js
 * let config = await new AppConfig().tryLoad();
 * ```
*/
export default class AppConfig {
    private constructor() { throw new Error("AppConfig is not initializable. All methods are static") }

    /** User name */
    static async getUsername(): Promise<string> { return this.tryGet("username", "User") }
    static async setUsername(value: string) { await AsyncStorage.setItem("username", JSON.stringify(value)) }

    /** How many (target) times per day to take selfie */
    static async getTargetTimesPerDay(): Promise<TargetTimesPerDay> { return await this.tryGet("targetTimesPerDay", TargetTimesPerDay.NotSet) as TargetTimesPerDay }
    static async setTargetTimesPerDay(value: number) { await AsyncStorage.setItem("targetTimesPerDay", JSON.stringify(value)) }
    
    /** Transform camera in camera scene */
    static async getTransformCamera(): Promise<boolean> { return this.tryGet("transformCamera", false) }
    static async setTransformCamera(value: boolean) { await AsyncStorage.setItem("transformCamera", JSON.stringify(value)) }

    /** Also save selfie to camera roll */
    static async getSaveSelfiesToCameraRoll(): Promise<boolean> { return this.tryGet("saveSelfiesToCameraRoll", false) }
    static async setSaveSelfiesToCameraRoll(value: boolean) { await AsyncStorage.setItem("saveSelfiesToCameraRoll", JSON.stringify(value)) }

    /** Personalized ads */
    static async getPersonalizedAds(): Promise<boolean> { return this.tryGet("personalizedAds", false) }
    static async setPersonalizedAds(value: boolean) { await AsyncStorage.setItem("personalizedAds", JSON.stringify(value)) }

    private static async tryGet(key: StorageKey, default_: any): Promise<any> {
        try {
            /// "!" will never parse and will end up returning default_ in catch block
            return JSON.parse(await AsyncStorage.getItem(key) ?? "!");
        } catch {
            return default_;
        }
    }
}
