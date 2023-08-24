import React, { RefObject } from "react";
import { Image, View } from "react-native";
import Styles from "./Styles";
// import { captureRef } from "react-native-view-shot";
import { CameraCapturedPicture } from "expo-camera";

/* Interfaces */
interface Props {
    image: CameraCapturedPicture | null,
    transform: any[]
}
interface State {}

export class PictureManipulator extends React.PureComponent<Props, State> {
    // viewShot: RefObject<View>;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
		};

		/* Refs */
        // this.viewShot = React.createRef();

		/* Bindings */
	}

	/* Lifetime */
	async takePictureAsync(): Promise<string | null> {
        return new Promise(() => "")
        // return await captureRef(this.viewShot, {
        //     result: "tmpfile",
        //     quality: 1,
        //     format: "jpg"
        // })
	}

	render() {
		return (
            this.props.image && <View pointerEvents="none" style={Styles.viewShot}>
                {/* <View style={Styles.viewShot} ref={this.viewShot}>
                    <Image style={[Styles.viewShot, {
                        transform: this.props.transform
                    }]} source={{ uri: this.props.image.uri }} />
                </View> */}
            </View>
		);
	}
}
