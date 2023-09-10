import React, { RefObject } from "react";
import { Image, View } from "react-native";
import Styles from "./Styles";
import ViewShot, { captureRef } from "react-native-view-shot";
import { CameraCapturedPicture } from "expo-camera";
import { FlipType, SaveFormat, SaveOptions, manipulateAsync } from "expo-image-manipulator";

/* Interfaces */
interface Props {
}
interface State {
    transform: any[],
    image?: string,
    imageLoadedPromise: Promise<void>
}

export class PictureManipulator extends React.PureComponent<Props, State> {
    viewShot: RefObject<ViewShot>;
    resolveImageLoadedPromise!: () => void;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            transform: [],
            imageLoadedPromise: new Promise<void>((resolve) => {
                this.resolveImageLoadedPromise = resolve;
            }),
		};

		/* Refs */
        this.viewShot = React.createRef();
	}

    async componentDidMount(): Promise<void> {}

	/* Lifetime */
	async takePictureAsync(
        image: string | null,
        transform: any[]
    ): Promise<string> {
        if (!image) return "";

        return new Promise<string>((resolve, _) => {
            this.setState({ image, transform }, () => {
                let cap = this.viewShot?.current?.capture;
                let fallback = image ?? "";

                /* Wait for image to actually render */
                this.state.imageLoadedPromise.then(async () => {
                    let resolve_and_clear = (value: string) => {
                        this.setState({
                            image: undefined,
                            transform: [],
                            imageLoadedPromise: new Promise<void>((resolve) => {
                                this.resolveImageLoadedPromise = resolve;
                            }),
                        });
                        
                        resolve(value);
                    }

                    const save: SaveOptions = { compress: 0, format: SaveFormat.JPEG };
                    const flip = async (uri: string) => await manipulateAsync(uri, [], save);
                    
                    /* Try run capture ref */
                    if (cap) await cap()
                        .then(async viewshot_uri => resolve_and_clear((await flip(viewshot_uri)).uri))
                        .catch(_ => resolve_and_clear(fallback))
                
                    /* Return image which is not manipulated
                        (because cap ref didn't work) */
                    else 
                        resolve_and_clear(fallback)
                })
            });
        })
	}

	render() {
		return (
            <View pointerEvents="none" style={Styles.viewShot} collapsable={false}>
                <ViewShot style={Styles.viewShot} ref={this.viewShot}>
                    <View collapsable={false} style={Styles.viewShot}>
                        {this.state.image && <Image
                            style={[
                                Styles.viewShot,
                                { transform: this.state.transform }
                            ]}
                            source={{
                                uri: this.state.image
                            }}
                            onLoad={this.resolveImageLoadedPromise}
                        />}
                    </View>
                </ViewShot>
            </View>
		);
	}
}
