/* Imports */
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

/// We use .jpg because when we flip the image
/// using `expo-image-manipulator` we save it
/// as jpg in the end (it's good for space)
const EXT = "JPG";

/* Locally Stored Image */
export interface LSImage {
	/// Path to the file which is stored in fs
	path: string,

	/// Maybe have use for this later but idk
	filename: string,

	/// Unix time stamp (ms)
	date: number,
}

/* Save image to users fs */
export async function saveImage(uri: string): Promise<void> {
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
		let push: LSImage = { path, filename, date: new Date().getTime() };
		let array = JSON.parse(imagePointers);

		if (array) {
			array.push(push);

			AsyncStorage.setItem(
				"imagePointers",
				JSON.stringify(array)
			);
		}
	};

	/* Save imamge */
	RNFS.copyFile(uri, path)
		.then(() => console.log('Image saved:', path))
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
