import { Image, Text, View } from "react-native";
import React from "react";
import Styles from "./Styles";
import { Props } from "./Poster";
import { formatDate } from "../../functional/Date";


export class PosterInner extends React.PureComponent<Props> {
    constructor(props: Props) {
        super(props);
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
                    <Text style={Styles.posterDate}>{formatDate(this.props.date)}</Text>
                </View>
            </React.Fragment>
        );
    }
}
