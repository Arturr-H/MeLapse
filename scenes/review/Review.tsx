/* Imports */
import React from "react";
import { Alert, Animated, Easing, SafeAreaView, TouchableOpacity, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import { LSImage } from "../../functional/Image";
import * as fs from "react-native-fs";
import { ProgressView } from "../../components/progressView/ProgressView";
import TimewarpButton from "./TimewarpButton";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";

/** (ms) how long the user needs to hold timewarp
 * button for it to automatically switch every
 * {@link SWITCH_SPEED}ms */
const DURATION_FOR_STARTING_AUTOSWITCH = 300;

/** Auto image switching speed */
const SWITCH_SPEED = 50;

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined }, "Preferences">,
}
export interface State {
    /** If loading lsimage pointers */
    loading: boolean,

    /** Index of which image we're reviewing right now */
    searchIndex: number,

    /** Deleting an image takes some time, show progress view */
    deleting: boolean,

    /* Animation values for image */
    imageRotation: Animated.Value,
    imageOpacity: Animated.Value,

    /** Hide UI to take a better look at images */
    ui: boolean
}

class Review extends React.PureComponent<Props, State> {
    lsImages: { path: string, filename: string }[] = [];
    isHolding: boolean = false;
    holdStart: number = 0;
    switchInterval?: NodeJS.Timeout;
    autoswitchTimeout?: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            loading: true,
            searchIndex: 0,
            deleting: false,

            imageRotation: new Animated.Value(-1),
            imageOpacity: new Animated.Value(0.75),
            ui: true
        };

        /* Bindings */
        this.deleteCurrentImage = this.deleteCurrentImage.bind(this);
        this.animateImageIntro = this.animateImageIntro.bind(this);
        this.previousImage = this.previousImage.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.nextImage = this.nextImage.bind(this);
        this.hideUI = this.hideUI.bind(this);
        this.showUI = this.showUI.bind(this);
        this.goBack = this.goBack.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        const lsimgs = await LSImage.getImagePointers();
        
        if (lsimgs) {
            let images: { path: string, filename: string }[] = [];

            /** Get all images */
            await fs.readDir(fs.DocumentDirectoryPath).then(e => e.forEach(a => {
                const path = a.path;
                const name = a.name;
                if (this.getFileExt(path) === "jpg") images.push({ path: path, filename: name });
            })).finally(() => {
                this.lsImages = images;
                this.setState({ loading: false });
            });
        }else {
            alert("Could not load images");
            this.props.navigation.navigate("Preferences");
        }
    };

    /** Gets what file type the given path is */
    getFileExt(path: string): string {
        let s = path.split(".");
        return s[s.length - 1];
    }

    /** Yeah does what the function says */
    nextImage(): void {
        if (this.isHolding) {
            this.setState({ searchIndex: Math.min(this.state.searchIndex + 1, this.lsImages.length) })
        }else {
            clearInterval(this.switchInterval)
        }
    };
    previousImage(): void {
        if (this.isHolding) {
            this.setState({ searchIndex: Math.max(this.state.searchIndex - 1, 0) })
        }else {
            clearInterval(this.switchInterval)
        }
    };
    onTouchStart(callback: () => void): void {
        if (this.isHolding === true) return;

        this.isHolding = true;
        this.holdStart = new Date().getTime();

        /* Just callback with haptic */
        const hapticBoundCallback = () => {
            callback();
            impactAsync(ImpactFeedbackStyle.Light);
        };

        hapticBoundCallback();

        this.autoswitchTimeout = setTimeout(() => {
            this.switchInterval = setInterval(hapticBoundCallback, SWITCH_SPEED);
        }, DURATION_FOR_STARTING_AUTOSWITCH);
    }
    onTouchEnd(): void {
        this.isHolding = false;
        clearTimeout(this.autoswitchTimeout);
    }

    /** Probably to preferences */
    goBack(): void {
        this.props.navigation.navigate("Preferences");
    }

    /** For when a new image shows up */
    animateImageIntro(): void {
        /* Reset values */
        this.setState({
            imageRotation: new Animated.Value(-1),
            imageOpacity: new Animated.Value(0.75),
        },
        /* Animate */
        () => {
            const def = { duration: 200, easing: Easing.inOut(Easing.exp), useNativeDriver: true };
            Animated.timing(this.state.imageRotation, { toValue: 0, ...def }).start();
            Animated.timing(this.state.imageOpacity, { toValue: 1, ...def }).start();
        });
    }

    /** Try delete image */
    async deleteCurrentImage(): Promise<void> {
        const SEARCH_INDEX = this.state.searchIndex;
        const CURRENT_IMAGE = this.lsImages[SEARCH_INDEX];
        this.lsImages.splice(SEARCH_INDEX, 1);
        
        /** Remove from fs */
        await LSImage.deleteImageAsync(CURRENT_IMAGE).then(_ => 
            this.setState({ deleting: false, searchIndex: SEARCH_INDEX - 1 })
        );
    }

    /* Show and hide UI */
    hideUI(): void { this.setState({ ui: false }) };
    showUI(): void { this.setState({ ui: true }) };

    render() {
		return (
			<View style={Styles.container}>

                {/* The image which is up for review */}
                {!this.state.loading && <Animated.Image
                    source={{ uri: 
                        this.lsImages[this.state.searchIndex]?.path
                    }}
                    onLoad={this.animateImageIntro}
                    style={Styles.reviewImage}
                />}


                {/* UI layer */}
                <TouchableOpacity
                    onPressIn={this.hideUI}
                    onPressOut={this.showUI}
                    activeOpacity={1}
                    style={[Styles.safeAreaView, { display: this.state.ui ? "flex" : "none" }]}
                >
                <View style={Styles.safeAreaView}>
                    <View style={Styles.deleteButtonContainer}>
                        <Button color="blue" onPress={this.goBack} text="Done" active={true} />
                    </View>

                    {/* "Timewarp" buttons */}
                    <View style={Styles.bottom}>
                        <View style={Styles.row}>
                            <TimewarpButton onTouchEnd={this.onTouchEnd} onTouchStart={this.onTouchStart} direction="backwards" callback={this.previousImage} />
                            <TimewarpButton onTouchEnd={this.onTouchEnd} onTouchStart={this.onTouchStart} direction="forwards" callback={this.nextImage} />
                        </View>

                        <Button 
                            color="red"
                            onPress={this.deleteCurrentImage}
                            text="Delete  🗑️"
                            active={true}
                            confirm={{ message: "Are you sure you want to delete this? 🧐", title: "Delete" }}
                            onDeny={() => this.setState({ deleting: false })}
                        />
                    </View>
                </View>
                </TouchableOpacity>

                {/* Loading for delete image */}
                {this.state.deleting && <ProgressView />}
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Review {...props} navigation={navigation} />;
}
