/* Imports */
import ContextMenu from "./ContextMenu";
import React, { RefObject } from "react";
import { Animated, Easing, SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import { LSImage, LSImageProp } from "../../functional/Image";
import { ProgressView } from "../../components/progressView/ProgressView";
import TimewarpButton from "./TimewarpButton";
import { formatDate } from "../../functional/Date";
import { saveToLibraryAsync } from "expo-media-library";
import * as Haptics from "expo-haptics"

/** (ms) how long the user needs to hold timewarp
 * button for it to automatically switch every
 * {@link SWITCH_SPEED}ms */
const DURATION_FOR_STARTING_AUTOSWITCH = 300;

/** Auto image switching speed */
const SWITCH_SPEED = 60;

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined }, "Preferences">,
}
export interface State {
    /** If loading lsimage pointers */
    loading: boolean,

    /** Image we're reviewing right now */
    currentImage?: LSImageProp,

    /** Deleting an image takes some time, show progress view */
    deleting: boolean,
}

class Review extends React.PureComponent<Props, State> {
    lsImages: { path: string, filename: string, date: number }[] = [];
    contextMenu: RefObject<ContextMenu> = React.createRef();

    /** Index of which image we're reviewing right now */
    searchIndex: number = 0;
    currentImage?: LSImageProp;

    /* For holding (repeating next / prev image switch) */
    holdInterval?: NodeJS.Timeout;
    startIntervalTimeout?: NodeJS.Timeout;
    isHolding: boolean = false;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            loading: true,
            deleting: false,
        };

        /* Bindings */
        this.deleteCurrentImage = this.deleteCurrentImage.bind(this);
        this.saveCurrentImage = this.saveCurrentImage.bind(this);
        this.updateCurrImage = this.updateCurrImage.bind(this);
        this.previousImage = this.previousImage.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.goBack = this.goBack.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        const lsimgs = await LSImage.getImagePointers();

        if (lsimgs) {
            let images: LSImageProp[] = [];

            /** Get all images */
            lsimgs.forEach(a => {
                const { path, filename, date } = a;
                if (this.getFileExt(path) === "jpg") images.push({ path, filename, date });
            });

            this.lsImages = images;
            this.setState({ loading: false, currentImage: images[0] });

        }else {
            alert("Could not load images");
            this.props.navigation.navigate("Preferences");
        }
    };

    /** Timewarp button interactions */
    onTouchStart(callback: () => void): void {
        function callbackLightFeedback(): void {
            callback();
            Haptics.selectionAsync();
        }

        if (!this.isHolding) {
            this.isHolding = true;
            
            /* Wait the min hold ms for starting interval */
            this.startIntervalTimeout = setTimeout(() => {
                if (this.isHolding) this.holdInterval = setInterval(callbackLightFeedback, SWITCH_SPEED);
            }, DURATION_FOR_STARTING_AUTOSWITCH);

            callback();
        }
    }
    onTouchEnd(): void {
        this.isHolding = false;
        clearInterval(this.holdInterval);
        clearTimeout(this.startIntervalTimeout);
    }

    /** Gets what file type the given path is */
    getFileExt(path: string): string {
        let s = path.split(".");
        return s[s.length - 1];
    }

    /** Yeah does what the function says */
    nextImage(): void {
        const searchIndex = Math.min(this.searchIndex + 1, this.lsImages.length - 1);

        this.searchIndex = searchIndex;
        this.currentImage = this.lsImages[searchIndex];
        this.updateCurrImage();
    };
    previousImage(): void {
        const searchIndex = Math.max(this.searchIndex - 1, 0);

        this.searchIndex = searchIndex;
        this.currentImage = this.lsImages[searchIndex];
        this.updateCurrImage();
    };

    /** Probably to preferences */
    goBack(): void {
        this.props.navigation.navigate("Preferences");
    }

    /** Try delete image */
    async deleteCurrentImage(): Promise<void> {
        const SEARCH_INDEX = this.searchIndex;
        const CURRENT_IMAGE = this.lsImages[SEARCH_INDEX];
        this.lsImages.splice(SEARCH_INDEX, 1);
        
        /** Remove from fs */
        await LSImage.deleteImageAsync(CURRENT_IMAGE).then(_ => {
            this.contextMenu?.current?.close();
            this.setState({ deleting: false });
            let new_: number;

            /* Move "search cursor" or leave scene if no images left */
            if (this.lsImages.length === 0) {
                alert("No more images 😢");
                return this.goBack();
            }else if (SEARCH_INDEX - 1 < 0) {
                new_ = SEARCH_INDEX;
            }else {
                new_ = SEARCH_INDEX - 1;
            }

            this.searchIndex = new_;
            this.currentImage = this.lsImages[new_];
            this.updateCurrImage();
        });
    }
    async saveCurrentImage(): Promise<void> {
        const SEARCH_INDEX = this.searchIndex;
        const CURRENT_IMAGE = this.lsImages[SEARCH_INDEX];

        saveToLibraryAsync(CURRENT_IMAGE.path).then(_ => alert("Image saved!"));
    }

    /** Update image */
    updateCurrImage(): void {
        this.setState({ currentImage: this.currentImage });
    }

    render() {
		return (
			<SafeAreaView style={Styles.container}>
                <View style={Styles.headerView}>
                    <Text style={Styles.header}>{formatDate(this.state.currentImage?.date ?? undefined)}</Text>
                </View>

                <View style={Styles.body}>
                    {/* The image which is up for review */}
                    {!this.state.loading && <View style={Styles.reviewImageContainer}>
                        {/* CURR */}
                        <Animated.Image
                            source={{ uri: 
                                this.state.currentImage?.path
                            }}
                            style={Styles.reviewImage}
                        />

                        {/* Button */}
                        <ContextMenu
                            ref={this.contextMenu}
                            deleteCurrent={this.deleteCurrentImage}
                            saveCurrent={this.saveCurrentImage}
                        />
                    </View>}
                </View>

                <View style={Styles.footer}>
                    <TimewarpButton direction="backwards" callback={this.previousImage} onTouchEnd={this.onTouchEnd} onTouchStart={this.onTouchStart} />
                    <TimewarpButton direction="forwards" callback={this.nextImage} onTouchEnd={this.onTouchEnd} onTouchStart={this.onTouchStart} />
                </View>
                <View style={{ width: "100%", flex: 1, paddingHorizontal: 20 }}>
                    <Button text="← Back" active flex onPress={this.goBack} />
                </View>
                {/* Loading for delete image */}
                {this.state.deleting && <ProgressView />}
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Review {...props} navigation={navigation} />;
}
