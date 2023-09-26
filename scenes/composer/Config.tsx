import AsyncStorage from "@react-native-async-storage/async-storage";

/* Types */
type StorageKey = "format" | "quality" | "framerate" | "bitrate" | "width" | "framerateOverride";

/**
 * This is all the composer scenes configuration.
 * 
 * ### Usage
 * ```js
 * let config = await new ComposerConfig().tryLoad();
 * ```
*/
export default class ComposerConfig {
    private constructor() { throw new Error("ComposerConfig is not initializable. All methods are static") }

    /** Output format */
    static async getFormat(): Promise<number> { return this.tryGet("format", 0) } // 0 = GIF
    static async setFormat(value: number) { await AsyncStorage.setItem("format", JSON.stringify(value)) }

    /** Output quality */
    static async getQuality(): Promise<number> { return this.tryGet("quality", 1) } // 1 = mid quality
    static async setQuality(value: number) { await AsyncStorage.setItem("quality", JSON.stringify(value)) }

    /** Output framerate.
     * 
     * **NOTICE**: It's not the actual framerate, it's the
     * index of an array which contains diffrent framerates.
     * Therefore these numbers should be likee 0-3 depending
     * on how many diffrent framerates the user can choose from. */
    static async getFramerate(): Promise<number> { return this.tryGet("framerate", 1) } // 1 = 30fps
    static async setFramerate(value: number) { console.log("setting", value); await AsyncStorage.setItem("framerate", JSON.stringify(value)) }

    /** Override bitrate */
    static async getBitrate(): Promise<number | null> { return this.tryGet("bitrate", null) }
    static async setBitrate(value: number | null) { await AsyncStorage.setItem("bitrate", JSON.stringify(value)) }

    /** Override width X */
    static async getWidthOverride(): Promise<number | null> { return this.tryGet("width", null) }
    static async setWidthOverride(value: number | null) { await AsyncStorage.setItem("width", JSON.stringify(value)) }

    /** Override FPS */
    static async getFramerateOverride(): Promise<number | null> { return this.tryGet("framerateOverride", null) }
    static async setFramerateOverride(value: number | null) { await AsyncStorage.setItem("framerateOverride", JSON.stringify(value)) }

    private static async tryGet(key: StorageKey, default_: any): Promise<any> {
        try {
            /// "!" will never parse and will end up returning default_ in catch block
            return JSON.parse(await AsyncStorage.getItem(key) ?? "!");
        } catch {
            return default_;
        }
    }
}
