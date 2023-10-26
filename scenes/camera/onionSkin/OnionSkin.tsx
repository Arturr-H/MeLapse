import React from "react";
import { Image } from "react-native";
import { LSImage, LSImageProp } from "../../../functional/Image";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Interfaces */
interface Props {
    opacity: number
}
interface State {
    onionSkinOverlay: string | null,
    visible: boolean
}

export class OnionSkin extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = { onionSkinOverlay: null, visible: false };

		/* Bindings */
        this.updateOnionskin = this.updateOnionskin.bind(this);
	}

	/* Lifetimme */
	async componentDidMount(): Promise<void> {
        await this.updateOnionskin();
	}
    async updateOnionskin(): Promise<void> {
        try {
            const image = await OnionSkin.getOnionSkinImage();
            if (!image) throw new Error();
            const visible = await OnionSkin.getOnionSkinVisibility();
            const path = LSImage.fromLSImageProp(image).getPath();

            this.setState({ 
                onionSkinOverlay: path,
                visible
            });
        }catch (e) {
            console.log("Could not load onion skin", e)
        }
    }

    /** Sets the onion skin visibility (external call) */
    static async setOnionSkinVisibility(visible: boolean): Promise<void> {
        await AsyncStorage.setItem("onionSkinVisible", JSON.stringify(visible));
    }
    /** Sets the onion skin image from the image pointers array (external call) */
    static async setOnionSkinImage(img: LSImageProp): Promise<void> {
        await AsyncStorage.setItem("onionSkinImage", JSON.stringify(img));
    }

    /** Sets the onion skin opacity (external call) */
    static async setOnionSkinOpacity(opacity: number): Promise<void> {
        await AsyncStorage.setItem("onionSkinOpacity", JSON.stringify(opacity));
    }

    /* Getters */
    static async getOnionSkinImage(): Promise<LSImageProp | null> {
        try {
            return await JSON.parse(
                await AsyncStorage.getItem("onionSkinImage") ?? "!"
            ) as LSImageProp
        }catch {
            return null
        }
    }
    static async getOnionSkinVisibility(): Promise<boolean> {
        try {
            return await JSON.parse(
                await AsyncStorage.getItem("onionSkinVisible") ?? "!"
            )
        }catch {
            return false
        }
    }
    static async getOnionSkinOpacity(): Promise<number> {
        try {
            return await JSON.parse(
                await AsyncStorage.getItem("onionSkinOpacity") ?? "!"
            )
        }catch {
            return 0.45
        }
    }

	render() {
		return (
            this.state.visible && <Image
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 40,
                    opacity: this.props.opacity
                }}
                source={{ uri: this.state.onionSkinOverlay ?? undefined }}
            />
		);
	}
}
