/* Imports */
import { FFmpegKit } from "ffmpeg-kit-react-native";
import fs, { DocumentDirectoryPath, readdir } from "react-native-fs";
import { StitchOptions } from "../scenes/compileFootage/LoadingScreen";

type StitchCallback = (uri: string) => void;

/**
 * input: Takes a list of image paths which are located
 * on the users file system.
 */
export async function stitchImages(callback: StitchCallback, options: StitchOptions): Promise<void> {
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
    const quality_bitrate = options.quality === "low" ? 1 :
                            options.quality === "mid" ? 6 : 64;
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
    const cmd_gif = `${framerate} ${search} ${r} ${overwrite} ${scaling} ${bitrate} '${output}'`;
    const cmd_mp4 = `${framerate} ${search} ${r} ${overwrite} ${scaling} ${bitrate} -c:v h264 -pix_fmt yuv420p '${output}'`;
    const cmd = options.outputFormat === "gif" ? cmd_gif : cmd_mp4;

    try {
        await FFmpegKit.executeAsync(cmd, (e) => {
            console.log(output, "WAS DOME VIA", cmd);
            callback(output);
        });
    }
    catch (e) {
        console.log(e);
        alert("Couldn't stitch video. Check advanced settings which often break the video creating process");
        throw new Error("errror stitching")
    };
}
