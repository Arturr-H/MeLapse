/* Imports */
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "../../components/button/Button";
import { StatusBar } from "expo-status-bar";

/* Interfaces */
export interface Props {
    navigation: any,
}
export interface State {
    contents: JSX.Element[]
}

class ThankYou extends React.PureComponent<Props, State> {
    contents: JSX.Element[] = [
        <React.Fragment key={"cr-hugo"}>
            <Text style={Styles.header2}>Hugo</Text>
            <Text style={Styles.paragraph}>Testing</Text>
            <Text style={Styles.paragraph}>Feedback & ideas</Text>
            <Text style={Styles.paragraph}>Bug reports</Text>
        </React.Fragment>,

        <React.Fragment key={"cr-marco"}>
            <Text style={Styles.header2}>Marco</Text>
            <Text style={Styles.paragraph}>Testing</Text>
            <Text style={Styles.paragraph}>Feedback & ideas</Text>
            <Text style={Styles.paragraph}>Scrapping animations</Text>
        </React.Fragment>,

        <React.Fragment key={"cr-arman"}>
            <Text style={Styles.header2}>Arman</Text>
            <Text style={Styles.paragraph}>Testing</Text>
            <Text style={Styles.paragraph}>Feedback</Text>
        </React.Fragment>,

        <React.Fragment key={"cr-aaron"}>
            <Text style={Styles.header2}>Aaron</Text>
            <Text style={Styles.paragraph}>Testing</Text>
            <Text style={Styles.paragraph}>Feedback</Text>
        </React.Fragment>,

        <React.Fragment key={"cr-mom"}>
            <Text style={Styles.header2}>Mom</Text>
            <Text style={Styles.paragraph}>UI & UX Tips</Text>
            <Text style={Styles.paragraph}>Feedback</Text>
        </React.Fragment>,
    ];

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            contents: this.shuffle(this.contents)
        };

        /* Bindings */
        this.shuffle = this.shuffle.bind(this);
    };

    shuffle(contents: JSX.Element[]): JSX.Element[] {
        return contents.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }, index) => {
                value.key = index;
                return value;
            });
    }

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.props.navigation.addListener("focus", () => {
            this.setState({ contents: this.shuffle(this.contents) });
        });
    };
    goBack = () => this.props.navigation.navigate("Menu");

	render() {
		return (
            <SafeAreaView style={Styles.container}>
                <View style={Styles.body}>
                    <Text style={Styles.header}>Thank you</Text>

                    <ScrollView contentContainerStyle={Styles.body}>
                        {this.state.contents}
                    </ScrollView>
                </View>

                <View style={Styles.footer}>
                    <Button active color="blue" onPress={this.goBack} text="Okay" />
                </View>

                <StatusBar style="dark" />
            </SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <ThankYou {...props} navigation={navigation} />;
}
