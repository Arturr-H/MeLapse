/* Imports */
import * as MediaLibrary from "expo-media-library";
import RNFS from "react-native-fs";
import { formatDate } from "./Date";
import * as fs from "react-native-fs";
import AppConfig from "../scenes/preferences/Config";

/// We use .jpg because when we flip the image
/// using `expo-image-manipulator` we save it
/// as jpg in the end (it's good for space)
const EXT = ".jpg";
const DOC_DIR = RNFS.DocumentDirectoryPath + "/";
const IMAGE_POINTER_FILENAME = "imagepointers.json";
const FILE_PATH = DOC_DIR + IMAGE_POINTER_FILENAME;

/**
 * The `LSImage` class can't be passed as prop, it leads 
 * to the warning "Non-serializable values were found in
 * the navigation state". Therefore we have this interface
 * which only has the neccesary values (not including methods)
 * for converting it back into a LSImage.
*/
export interface LSImageProp {
	/**	Used when storing images (is the date in
	 * unix time ms) and can be used for ex keys. */
	filename: string,
	
	/** In preview scene, we've not saved the image
	 * yet, and it lies in the temporary dir. Otherwise
	 * we always use the .getPath() method to use the
	 * correct directory */
	path: string,

	/** Unix time stamp (ms) */
	date: number,
}

/** Locally Stored Image */
export class LSImage {
	private path: string;
	private filename: string;
	private date: number;

	constructor() {
		this.path = "";
		this.date = new Date().getTime();
		this.filename = this.date.toString();

		/* Bindings */
		this.getDateFormatted = this.getDateFormatted.bind(this);
		this.getFilename = this.getFilename.bind(this);
		this.saveAsync = this.saveAsync.bind(this);
		this.getDate = this.getDate.bind(this);
		this.getPath = this.getPath.bind(this);
	};

	/**
	 * Save the image to users filesystem. `callback` can be used after image
	 * has successfully or unsuccessfully been saved.
	 */
	async saveAsync(callback?: () => void): Promise<void> {
		/* Save image to user media library if that setting is on */
		if (await AppConfig.getSaveSelfiesToCameraRoll()) {
			await MediaLibrary.saveToLibraryAsync(this.getPath());
		}

		/* Save in fs */
		saveImage(this, callback);
	}

	/** Convert `LSImageProp` into this class */
	static fromLSImageProp(prop: LSImageProp): LSImage {
		let lsimage = new LSImage();
		lsimage.path = prop.path;
		lsimage.filename = prop.filename;
		lsimage.date = prop.date;

		return lsimage;
	}
	/** Convert this class into `LSImageProp` */
	toLSImageProp(): LSImageProp {
		return {
			filename: this.filename,
			path: this.path,
			date: this.date,
		}
	}

	/* Filename */
	getFilename(): string { return this.filename };
	withFilename(filename: string): this { this.filename = filename; return this; }
	
	/* Path */
	getPath(): string { return RNFS.DocumentDirectoryPath + "/" + this.filename + EXT };
	getRawPath(): string { return this.path };
	withPath(path: string): this { this.path = path; return this; }

	/* Date & path */
	getDateFormatted(): string { return formatDate(this.date) };
	getDate(): number { return this.date };

	/** Gets all image paths */
	public static async getImagePointers(): Promise<LSImageProp[] | null> {
		try {
			const ret = await RNFS.readFile(DOC_DIR + IMAGE_POINTER_FILENAME);
			return JSON.parse(ret!) as LSImageProp[];
		} catch {
			return null
		}
	}

	/** Push to the image pointers file. If the
	 * file is not set up, we set it up. */
	public static async pushToImagesPointers(push: LSImage): Promise<void> {

		/** Push to file (File now is guaranteed to exist) */
		async function processFileContent(content: string): Promise<void> {
			try {
				let ret: LSImageProp[] = JSON.parse(content);
				ret.push(push.toLSImageProp());
				const PARSED = JSON.stringify(ret);
				
				/* Write to file */
				RNFS.writeFile(FILE_PATH, PARSED);
			}catch (e){
				console.error("Could not parse", e);
			}
		}

		return await RNFS.readFile(FILE_PATH)
			.then(processFileContent)
			.catch(_ => processFileContent("[]"));
	}

	/** Dangerous function. Resets the file contents of imagepointers.json */
	public static async resetImagePointersFile(): Promise<void> {
		console.info("Clearing imagepointers.json file");
		await RNFS.writeFile(FILE_PATH, "[]");
	}

	/** Delete image */
	public static async deleteImageAsync(image: LSImage): Promise<void> {
		/* Check if we've got a local image pointer array to delete from */
		let imagePointers = await this.getImagePointers();
		if (imagePointers !== null) {
			try {
				const filename = image.filename;
				
				/* Find removable element */
				for (let i = 0; i < imagePointers.length; i++) {
					const element = LSImage.fromLSImageProp(imagePointers[i]);
					const split = element.getPath().split("/");
					const try_filename = split[split.length - 1].split(".")[0];

					if (try_filename === filename) {
						/* Set image pointers */
						imagePointers.splice(i, 1);
						RNFS.writeFile(FILE_PATH, JSON.stringify(imagePointers));

						const unlinkPath = fs.DocumentDirectoryPath + "/" + try_filename + ".jpg";
						return fs.unlink(unlinkPath);
					}
				}

				return alert("Image wasn't found sadly. Nothing was removed.");
			}catch {
				return alert("Couldn't parse images pointer...");
			}
		}else {
			return alert("No images in pointer...");
		}
	}
}

/* Save image to users fs */
export async function saveImage(lsimage: LSImage, callback?: () => void): Promise<void> {
	/* Push & create filename */
	const filename = generateFileName();
	const path = `${RNFS.DocumentDirectoryPath}/${filename}${EXT}`;
	LSImage.pushToImagesPointers(new LSImage().withFilename(filename));

	/* Save image */
	RNFS.copyFile(lsimage.getRawPath(), path)
		.then(callback)
		.catch(error => console.error("Error saving image:", error));
}

/** Generates a date filename */
export function generateFileName() {
	const length = 15;
	const timestampStr = new Date().getTime().toString();
	const padding = "0".repeat(length - timestampStr.length);
  
	return padding + timestampStr;
};
