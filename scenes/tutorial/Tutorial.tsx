/* Imports */
import React, { RefObject } from "react";
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, ScrollView, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Page1 from "./page1/Page";
import Page2 from "./page2/Page";
import Page3 from "./page3/Page";
import Page4 from "./page4/Page";
import Page5 from "./page5/Page";
import { WIDTH } from "../result/Result";
import { StatusBar } from "expo-status-bar";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: string } }, "Camera">,
}
interface State {

    /** Index of what page we're on. Set
     * after page has transitioned */
    page: number
}

class Tutorial extends React.PureComponent<Props, State> {
    pages: JSX.Element[];
    page5: RefObject<Page5> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            page: 0
        };

        /* Bindings */
        this.nextPage = this.nextPage.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        /* Pages */
        this.pages = [
            <Page1 key="pg1" />,
            <Page2 key="pg2" />,
            <Page3 key="pg3" />,
            // <Page4 key="pg4" />,
            <Page5 key="pg5" ref={this.page5} navigation={this.props.navigation} />,
        ];
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.props.navigation.addListener("focus", () => {
            this.page5.current?.setFocused();
        })
    };

    /** Switch page */
    nextPage(): void {
        this.setState({ page: this.state.page + 1 });
    }

    /** Handle scroll */
    handleScroll(evt: NativeSyntheticEvent<NativeScrollEvent>): void {
        const index = Math.round(evt.nativeEvent.contentOffset.x / WIDTH);
        this.setState({ page: index });
    }

	render() {
		return (
			<SafeAreaView style={Styles.container}>
                <View style={Styles.pageContainer}>
                    <ScrollView
                        horizontal
                        decelerationRate={0}
                        snapToInterval={WIDTH}
                        snapToAlignment={"center"}
                        showsHorizontalScrollIndicator={false}

                        onScroll={this.handleScroll}
                        scrollEventThrottle={64}
                    >
                        {this.pages}
                    </ScrollView>
                </View>

                {/* Footer */}
                <View style={Styles.footer}>
                    <View style={Styles.dotContainer}>
                        {this.pages.map((_,i) => 
                            <View key={"dot" + i} style={[Styles.dot, i === this.state.page && Styles.active]} />
                        )}
                    </View>
                </View>

                <StatusBar style="dark" />
			</SafeAreaView>
		);
	}
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <Tutorial {...props} navigation={navigation} />;
}
