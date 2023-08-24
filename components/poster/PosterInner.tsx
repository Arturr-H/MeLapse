import { Image, Text, View } from "react-native";
import React from "react";
import Styles from "./Styles";
import { Props } from "./Poster";


export class PosterInner extends React.PureComponent<Props> {
    date: string;

    constructor(props: Props) {
        super(props);

        this.date = "-";
    }

    componentDidMount(): void {
        if (typeof this.props.date === "string") {
            this.date = this.props.date;
        }else {
            this.date = this.toDateStr(this.props.date)
        }
    }
    toDateStr(ms: number) {
        const startDate = new Date(ms);
        const endDate = new Date(ms + 7 * 24 * 60 * 60 * 1000); // Adding 7 days
      
        const startMonth = startDate.toLocaleString('default', { month: 'short' });
        const endDay = endDate.getDate();
      
        return `${startMonth} ${startDate.getDate()} - ${endDay}`;
    }

    /* Render */
    render() {
        return (
            <React.Fragment>
                {/* This image is used to make the poster
                    look like it's made from actual paper */}
                <Image
                    resizeMode="contain"
                    alt="Paper ending"
                    source={require("../../assets/images/paper-thing.png")}
                    style={Styles.paperEnding} />

                <View style={Styles.poster}>
                    {/* The actual image */}
                    <Image style={Styles.image} source={this.props.source} />

                    {/* Date? (yes / no) */}
                    <Text style={Styles.posterDate}>{this.props.date}</Text>
                </View>
            </React.Fragment>
        );
    }
}
