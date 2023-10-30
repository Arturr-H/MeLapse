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
    visible: boolean,

    /** Can be hidden if clicked on */
    hideOnionskin: boolean
}

export class OnionSkin extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            onionSkinOverlay: null,
            visible: false,
            hideOnionskin: false
        };

		/* Bindings */
        this.updateOnionskin = this.updateOnionskin.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
	}

	/* Lifetimme */
	async componentDidMount(): Promise<void> {
        await this.updateOnionskin();
	}
    async updateOnionskin(): Promise<void> {
        console.log("UPDATEIGN ONIONSKIN");
        try {
            const visible = await OnionSkin.getOnionSkinVisibility();
            let onionSkinOverlay: string;
            const lsImgs = await LSImage.getImagePointers();
            
            if (await OnionSkin.getAlwaysUseLatestSelfie() === true && lsImgs) {
                if (lsImgs)
                    OnionSkin.setOnionSkinImage(lsImgs[lsImgs.length - 1]);

                const path = LSImage.fromLSImageProp(lsImgs[lsImgs.length-1]).getPath();
                onionSkinOverlay = path;
            }else {

                const image = await OnionSkin.getOnionSkinImage();
                if (!image) throw new Error();
                const path = LSImage.fromLSImageProp(image).getPath();
                onionSkinOverlay = path;
            }
            this.setState({ 
                onionSkinOverlay,
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
    /** Set if should use latest selfie as onionskin image */
    static async setAlwaysUseLatestSelfie(cond: boolean): Promise<void> {
        const imgPtrs = await LSImage.getImagePointers();
        if (imgPtrs) await this.setOnionSkinImage(imgPtrs[imgPtrs.length - 1]);
        await AsyncStorage.setItem("onionSkinUseLatestSelfie", JSON.stringify(cond));
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
    static async getAlwaysUseLatestSelfie(): Promise<boolean> {
        try {
            return await JSON.parse(
                await AsyncStorage.getItem("onionSkinUseLatestSelfie") ?? "true"
            )
        }catch {
            return true
        }
    }

    /* Visibility triggers (external calls) */
    show(): void { this.setState({ hideOnionskin: false }); }
    hide(): void { this.setState({ hideOnionskin: true }) }

	render() {
		return (
            (this.state.visible && !this.state.hideOnionskin) && <Image
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
