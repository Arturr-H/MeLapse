/* Imports */
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import RNFS from "react-native-fs";
import { formatDate } from "./Date";
import * as fs from "react-native-fs";
import AppConfig from "../scenes/preferences/Config";

/// We use .jpg because when we flip the image
/// using `expo-image-manipulator` we save it
/// as jpg in the end (it's good for space)
const EXT = "jpg";

/**
 * The `LSImage` class can't be passed as prop, it leads 
 * to the warning "Non-serializable values were found in
 * the navigation state". Therefore we have this interface
 * which only has the neccesary values (not including methods)
 * for converting it back into a LSImage.
*/
export interface LSImageProp {
	/** Path to the file which is stored in fs */
	path: string;

	/**	Used when storing images (is randomly
	 * generated) and can be used for ex keys. */
	filename: string;
	
	/** Unix time stamp (ms) */
	date: number;
}

/** Locally Stored Image */
export class LSImage {
	path: string;
	private filename: string;
	date: number;

	constructor(path: string, filename: string) {
		this.path = path;
		this.filename = filename;
		this.date = new Date().getTime();

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
			await MediaLibrary.saveToLibraryAsync(this.path);
		}

		/* Save in fs */
		saveImage(this, callback);
	}

	/** Convert `LSImageProp` into this class */
	static fromLSImageProp(prop: LSImageProp): LSImage {
		let lsimage = new LSImage(prop.path, prop.filename);
		lsimage.filename = prop.filename;
		lsimage.date = prop.date;

		return lsimage;
	}
	/** Convert this class into `LSImageProp` */
	toLSImageProp(): LSImageProp {
		return {
			path: this.path,
			filename: this.filename,
			date: this.date
		}
	}

	/* Getters */
	getDateFormatted(): string { return formatDate(this.date) };
	getFilename(): string { return this.filename };
	getDate(): number { return this.date };
	getPath(): string { return this.path };

	/** Gets all image paths */
	public static async getImagePointers(): Promise<LSImageProp[] | null> {
		try {
			const ret = await AsyncStorage.getItem("imagePointers");
			return JSON.parse(ret!) as LSImageProp[];
		} catch {
			return null
		}
	}
	
	/** Removes file extension from only filename */
	static removeFileExt(name: string): string {
		return name.split(".")[0];
	}

	/** Delete image */
	public static async deleteImageAsync(image: { path: string, filename: string }): Promise<void> {
		/* Check if we've got a local image pointer array to delete from */
		const imagePointers_str = await AsyncStorage.getItem("imagePointers");
		if (imagePointers_str !== null) {
			try {
				let imagePointers: LSImageProp[] = JSON.parse(imagePointers_str) as LSImageProp[];
				const filename = image.filename;
				const filepath = image.path;
				
				/* Find removable element */
				for (let i = 0; i < imagePointers.length; i++) {
					const element = imagePointers[i];
					const split = element.path.split("/");
					const try_filename = split[split.length - 1];

					if (try_filename === filename) {
						/* Set image pointers */
						imagePointers.splice(i, 1);
						await AsyncStorage.setItem("imagePointers", JSON.stringify(imagePointers));

						const unlinkPath = fs.DocumentDirectoryPath + "/" + try_filename;
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
	/* Check if we've got a local image pointer array */
	if (await AsyncStorage.getItem("imagePointers") === null) {
		AsyncStorage.setItem("imagePointers", JSON.stringify([]));
	}

	/* Push & create filename */
	const filename = generateFileName();
	const path = `${RNFS.DocumentDirectoryPath}/${filename}.${EXT}`;
	let imagePointers = await AsyncStorage.getItem("imagePointers");

	/* Push image to pointers */
	if (imagePointers !== null) {
		let push = new LSImage(path, filename);
		console.log("pushing", push.toLSImageProp());
		let array: LSImage[] = JSON.parse(imagePointers);

		if (array) {
			array.push(push);

			AsyncStorage.setItem(
				"imagePointers",
				JSON.stringify(array)
			);
		}
	};

	/* Save image */
	RNFS.copyFile(lsimage.path, path)
		.then(callback)
		.catch(error => console.error('Error saving image:', error));
}

function generateFileName() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 16; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}
	return result;
};
