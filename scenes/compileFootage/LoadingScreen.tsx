/* Imports */
import React, { RefObject } from "react";
import { ActivityIndicator, Animated, Easing, SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { stitchImages } from "../../functional/VideoCreator";
import * as MediaLibrary from "expo-media-library";
import { WIDTH, getTimeAgo } from "../result/Result";
import QuickCounter from "./QuickCounter";
import MultiAnimator from "../../components/animator/MultiAnimator";
import { FFmpegKit } from "ffmpeg-kit-react-native";
import { Button } from "../../components/button/Button";
import Poster from "../../components/poster/Poster";
import { LSImage, LSImageProp } from "../../functional/Image";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatDate } from "../../functional/Date";


/* Interfaces */
interface Stats {
    daysSinceFirstSelfie: number,
    selfiesCaptures: number,
    mostImagesOneDay: DateAndNr,
    numberOfScrappedSelfies: number,
    firstImage?: LSImageProp,
}
interface Props {
    navigation: StackNavigationProp<{ Composer: undefined, Camera: { comesFrom: "other" } }, "Composer" | "Camera">,

    params: StitchOptions
}
interface State {
    amountOfImages: number,
    amountOfImagesTranslateX: Animated.Value,

    /** This scene displays a bunch of stats, this
     * value keeps track of which to display */
    statIndex: number,

    loading: boolean,

    /** Stats when loading */
    stats: Stats
}
export interface StitchOptions {
    fps: number,
    outputFormat: "gif" | "mp4",
    quality: "low" | "mid" | "high",
    bitrateOverride: number | null,

    widthOverride: number | null,
}

class LoadingScreen extends React.Component<Props, State> {
    /* Refs */
    multianimator: RefObject<MultiAnimator> = React.createRef();
    posterHasAnimated: boolean = false;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            amountOfImages: 0,
            amountOfImagesTranslateX: new Animated.Value(-WIDTH),

            statIndex: 0,
            loading: true,

            stats: {
                daysSinceFirstSelfie: 0,
                selfiesCaptures: 0,
                mostImagesOneDay: { date: 0, nr: 0 },
                numberOfScrappedSelfies: 0,
            }
        };

        /* Bindings */
        this.generateVideo = this.generateVideo.bind(this);
        this.nextStat = this.nextStat.bind(this);
        this.goBack = this.goBack.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        await this.generateVideo();

        this.setState({ amountOfImages: 10 });
        this.animateAmountOfImages();
        this.multianimator.current?.fadeIn(200, 100, undefined, 1000);

        const imagePointers = await LSImage.getImagePointers();
        if (imagePointers) this.setState({ stats: await getAllStats(imagePointers) });
    }

    /** Animate intro for amount of images text */
    animateAmountOfImages(): void {
        Animated.timing(this.state.amountOfImagesTranslateX, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.exp),
            useNativeDriver: true,
        }).start()
    }

    /** Generate the timmelapse footage */
    async generateVideo(): Promise<void> {
        try {
            await stitchImages(async (e) => {
                await MediaLibrary.saveToLibraryAsync(e).then(() => {
                    this.setState({ loading: false });
                });
            }, this.props.params);
        } catch {
            alert("Couldn't generate video");
        }
    }

    /** Display the next stat */
    nextStat(): void {
        this.multianimator.current?.fadeOut(800, 100, () => {
            this.setState({ statIndex: this.state.statIndex + 1 }, () => {
                this.multianimator.current?.fadeIn(200, 100, undefined, 1000);
            });
        }, 400)
    }

    /** Can cancel the ffmpeg gif stitching process
     * and switches back scene */
    goBack(shouldCancel: boolean, to: "Camera" | "Composer"): void {
        let nav: () => void;
        if (to === "Camera") {
            nav = () => this.props.navigation.navigate(to, { comesFrom: "other" });
        } else {
            nav = () => this.props.navigation.navigate(to);
        };

        this.multianimator.current?.fadeOut(200, 100, () => {
            if (shouldCancel === true) {
                FFmpegKit.cancel().then(nav);
            } else {
                nav()
            }
        });
    }

    render() {
        const statComponents: (JSX.Element[])[] = [
            [
                <Poster lsimage={this.state.stats.firstImage} ref={e => {
                    if (this.posterHasAnimated === false) {
                        this.posterHasAnimated = true;
                        setTimeout(() => {
                            this.nextStat();
                            e?.save(() => { });
                        }, 5000)
                    };
                }} />,
                <Text style={[Styles.amountOfImagesText, { transform: [{ translateY: -100 }], textAlign: "center" }]}>😉 Your first selfie</Text>
            ],

            [
                <QuickCounter from={0} to={Math.round((new Date().getTime() - this.state.stats.daysSinceFirstSelfie) / (24 * 60 * 60 * 1000))} duration={4000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>⏱️ Days since first selfie ({formatDate(this.state.stats.daysSinceFirstSelfie)})</Text>
            ],

            [
                <QuickCounter from={0} to={this.state.stats.selfiesCaptures} duration={4000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>📸 Selfies captured</Text>
            ],

            [
                <QuickCounter from={0} to={this.state.stats.mostImagesOneDay.nr} duration={2000} delay={2000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>🔥 Most images taken on one day ({formatDate(this.state.stats.mostImagesOneDay.date)})</Text>
            ],

            [
                <QuickCounter from={0} to={this.state.stats.numberOfScrappedSelfies} duration={4000} callback={this.nextStat} />,
                <Text style={Styles.amountOfImagesText}>🗑️ Total amount of images scrapped</Text>
            ],

            [
                <Text style={Styles.thankYou}>Thank you for using {"my app"}</Text>,
                <Text style={Styles.thankYou}>😄</Text>
            ],
        ];

        /* @ts-ignore WHY DOES TYPESCRIPT COMPLAIN??????? IT LITERALLY RETURNS `JSX.ELEMENT[]` */
        const children: JSX.Element[] = statComponents.map((e: JSX.Element[], index) => {
            if (index === this.state.statIndex) { return e as JSX.Element[] }
            else { return [] as JSX.Element[] }
        });

        return (
            <SafeAreaView style={Styles.container}>
                <TouchableOpacity style={Styles.cancelButton} activeOpacity={0.5} onPress={() => this.goBack(true, "Composer")}>
                    <Text style={Styles.cancelButtonText}>← Cancel</Text>
                </TouchableOpacity>

                <View style={Styles.padding}>
                    <View style={Styles.innerContainer}>
                        <MultiAnimator ref={this.multianimator}>
                            {children}
                        </MultiAnimator>
                    </View>

                    <View style={Styles.loadingContainer}>
                        {this.state.loading ? (
                            <React.Fragment>
                                <Text style={Styles.loadingText}>Generating</Text>
                                <ActivityIndicator color={"#ddd"} />
                            </React.Fragment>
                        )
                            : (
                                <View style={{ flexDirection: "column", gap: 10, width: "100%" }}>
                                    <Text style={Styles.loadingText}>Done Generating 🎉</Text>
                                    <Button flex active={true} color="blue" onPress={() => this.goBack(false, "Camera")} text="Okay" />
                                </View>
                            )}
                    </View>
                </View>

                <StatusBar style="dark" />
            </SafeAreaView>
        );
    }
}

export default function (props: any) {
    const navigation = useNavigation();

    return <LoadingScreen params={props.route.params} {...props} navigation={navigation} />;
}


async function getAllStats(lsimages: LSImageProp[]): Promise<Stats> {
    let firstImage_: LSImageProp | null = null;
    for (let i = 0; i < lsimages.length; i++) {
        const oldestDate = (firstImage_ ?? { date: Number.MAX_SAFE_INTEGER }).date;
        if (lsimages[i].date < oldestDate) firstImage_ = lsimages[i];
    }

    const mostImagesOneDay = getMostOnOneDay(lsimages.map(e => e.date));
    const daysSinceFirstSelfie = firstImage_?.date ?? 0;
    const firstImage = firstImage_ ?? undefined;
    const selfiesCaptures = lsimages.length;
    let numberOfScrappedSelfies: number;
    try {
        const c = await AsyncStorage.getItem("scrappedSelfies") ?? "!";
        numberOfScrappedSelfies = JSON.parse(c);
    }catch {
        numberOfScrappedSelfies = 0;
    }

    return { firstImage, mostImagesOneDay, daysSinceFirstSelfie, numberOfScrappedSelfies, selfiesCaptures }
}

/** Get the most amount of pictures were taken on a day */
type DateAndNr = { nr: number, date: number };
function getMostOnOneDay(unixTimestamps: number[]): DateAndNr {
    const dayCounts: { [day: string]: DateAndNr } = {};

    // Iterate through the timestamps and count the occurrences of each day
    unixTimestamps.forEach((timestamp) => {
        const date = new Date(timestamp);
        const dayKey = date.toDateString(); // Extract the day and use it as the key

        if (dayCounts[dayKey]) {
            dayCounts[dayKey].nr++;
        } else {
            dayCounts[dayKey] = { date: timestamp, nr: 1 };
        }
    });

    // Find the day(s) with the maximum count
    let maxCount = 0;
    let mostRecordedDay: DateAndNr = { nr: 0, date: 0 };

    for (const dayKey in dayCounts) {
        if (dayCounts.hasOwnProperty(dayKey)) {
            const count = dayCounts[dayKey];
            if (count.nr > maxCount) {
                maxCount = count.nr;
                mostRecordedDay = count;
            } else if (count.nr === maxCount) {
                mostRecordedDay = count;
            }
        }
    };

    return mostRecordedDay
}
