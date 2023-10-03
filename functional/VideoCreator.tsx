/* Imports */
import { FFmpegKit } from "ffmpeg-kit-react-native";
import fs, { DocumentDirectoryPath, readdir } from "react-native-fs";
import { StitchOptions } from "../scenes/compileFootage/LoadingScreen";

type StitchCallback = (uri: string) => void;
type ProgressCallback = (progress: number) => void;

/** What quality option gives us what bitrate */
export const QUALITY_OPTION_BITRATE = {
    "LOW": 1,
    "MID": 6,
    "HIGH": 64
}

/**
 * input: Takes a list of image paths which are located
 * on the users file system.
 */
export async function stitchImages(
    callback: StitchCallback,
    options: StitchOptions,
    progressCallback: ProgressCallback
): Promise<void> {
    const widthOverride = options.widthOverride !== null
        ? `scale=${options.widthOverride}:-1`
        : null;

    const scales = {
        okay: widthOverride ?? "scale=640:-1",
        mid: widthOverride ?? "scale=1080:-1",
        high: widthOverride ?? "scale=1440:-1",
    }
    const scaling =
        options.quality === "low" ? `-vf "${scales.okay}:flags=lanczos"`
        : options.quality === "mid" ? `-vf "${scales.mid}:flags=lanczos"`
        : `-vf "${scales.high}:flags=lanczos"`;

    /* Path */
    const picDirPath = fs.DocumentDirectoryPath;
    const ext = "jpg";
    const overwrite = "-y";

    /* Bitrate */
    const quality_bitrate = 
        options.quality === "low"
            ? QUALITY_OPTION_BITRATE["LOW"]
        : options.quality === "mid"
            ? QUALITY_OPTION_BITRATE["MID"]
            : QUALITY_OPTION_BITRATE["HIGH"];

    const bitrate_ext = options.bitrateOverride !== null
                    ? options.bitrateOverride : quality_bitrate;
    const bitrate = `-b:v ${bitrate_ext}M`;

    /* Format and framerate */
    const framerateOverride = options.framerateOverride;
    const framerate = `-framerate ${framerateOverride ?? options.fps}`;
    const r = `-r ${framerateOverride ?? options.fps}`;
    const output = options.outputFormat === "gif" ? `${picDirPath}/output_all.gif` : `${picDirPath}/output_all.mp4`;
    
    const search = `-pattern_type glob -i '${picDirPath}/*.${ext}'`;

    /* Commmands */
    const cmd_gif = `-loglevel error ${framerate} ${search} ${r} ${overwrite} ${scaling} ${bitrate} '${output}'`;
    const cmd_mp4 = `-loglevel error ${framerate} ${search} ${r} ${overwrite} ${scaling} ${bitrate} -c:v h264 -pix_fmt yuv420p '${output}'`;
    const cmd = options.outputFormat === "gif" ? cmd_gif : cmd_mp4;

    /* Get amount of images in folder */
    const amountOfImages = (await readdir(DocumentDirectoryPath)).filter(e => e.endsWith(".jpg")).length;

    try {
        await FFmpegKit.executeAsync(cmd, (_) => {
            callback(output);
        }, undefined, (e) => {
            progressCallback(e.getVideoFrameNumber() / amountOfImages);
        });
    }
    catch (e) {
        console.log(e);
        alert("Couldn't stitch video. Check advanced settings which often break the video creating process");
        throw new Error("errror stitching")
    };
}
