/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import AppConfig from "../preferences/Config";
import MultiAnimator from "../../components/animator/MultiAnimator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LSImage, LSImageProp } from "../../functional/Image";
import Poster from "../../components/poster/Poster";
import QuickCounter from "./QuickCounter";
import { formatDate } from "../../functional/Date";

/* Interfaces */
interface Stats {
    daysSinceFirstSelfie: number,
    selfiesCaptures: number,
    mostImagesOneDay: DateAndNr,
    numberOfScrappedSelfies: number,
    firstImage?: LSImageProp,
}
export interface Props {
    navigation: StackNavigationProp<{ Preferences: undefined }, "Preferences">,
}
export interface State {
    /** This scene displays a bunch of stats, this
      * value keeps track of which to display */
    statIndex: number,

    /** Stats when loading */
    stats: Stats
}

class Statistics extends React.PureComponent<Props, State> {
    /* Refs */
    multianimator: RefObject<MultiAnimator> = React.createRef();
    posterHasAnimated: boolean = false;

    /* Refs */
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            statIndex: 0,

            stats: {
                daysSinceFirstSelfie: 0,
                selfiesCaptures: 0,
                mostImagesOneDay: { date: 0, nr: 0 },
                numberOfScrappedSelfies: 0,
            }
        };

        /* Bindings */
        this.nextStat = this.nextStat.bind(this);
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        const imagePointers = await LSImage.getImagePointers();
        if (imagePointers) this.setState({ stats: await getAllStats(imagePointers) }, () => {
            this.multianimator.current?.fadeIn(200, 100, undefined, 0);
        });
    }

    /** Display the next stat */
    nextStat(): void {
        const STAT_AMOUNT = 4;
        let statIndex = this.state.statIndex;
        
        /* Wrap around */
        if (statIndex > STAT_AMOUNT - 2)
            this.setState({ statIndex: 0 });
        
        /* Next stat */
        else this.multianimator.current?.fadeOut(0, 0, () => {
            this.setState({ statIndex: statIndex + 1 }, () => {
                this.multianimator.current?.fadeIn(100, 0, undefined, 0);
            });
        }, 0)
    }

    /** Preferences Scene */
    goBack = () => {
        this.props.navigation.navigate("Preferences");
    }

	render() {
        const statComponents: (JSX.Element[])[] = [
            [
                <QuickCounter key={"pg2-1"} from={0} to={Math.round((new Date().getTime() - this.state.stats.daysSinceFirstSelfie) / (24 * 60 * 60 * 1000))} duration={2000} />,
                <Text key={"pg2-2"} style={Styles.amountOfImagesText}>⏱️ Days since first selfie ({formatDate(this.state.stats.daysSinceFirstSelfie)})</Text>
            ],
    
            [
                <QuickCounter key={"pg3-1"} from={0} to={this.state.stats.selfiesCaptures} duration={2000} />,
                <Text key={"pg3-2"} style={Styles.amountOfImagesText}>📸 Selfies captured</Text>
            ],
    
            [
                <QuickCounter key={"pg4-1"} from={0} to={this.state.stats.mostImagesOneDay.nr} duration={2000} delay={2000} />,
                <Text key={"pg4-2"} style={Styles.amountOfImagesText}>🔥 Most images taken on one day ({formatDate(this.state.stats.mostImagesOneDay.date)})</Text>
            ],
    
            [
                <QuickCounter key={"pg5-1"} from={0} to={this.state.stats.numberOfScrappedSelfies} duration={2000} />,
                <Text key={"pg5-2"} style={Styles.amountOfImagesText}>🗑️ Total amount of images scrapped</Text>
            ],
        ];

        /* @ts-ignore WHY DOES TYPESCRIPT COMPLAIN??????? IT LITERALLY RETURNS `JSX.ELEMENT[]` */
        const children: JSX.Element[] = statComponents.map((e: JSX.Element[], index) => {
            if (index === this.state.statIndex) { return e as JSX.Element[] }
            else { return [] as JSX.Element[] }
        });

		return (
			<View style={Styles.container} onTouchEnd={this.nextStat}>
                <View style={[Styles.innerContainer, Styles.padding]}>
                    <MultiAnimator ref={this.multianimator}>
                        {children}
                    </MultiAnimator>
                </View>

                <View style={Styles.footer}>
                    <Button
                        text="Done"
                        active
                        onPress={this.goBack}
                    />
                </View>
			</View>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Statistics {...props} navigation={navigation} />;
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
