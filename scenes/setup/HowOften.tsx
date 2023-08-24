/* Imports */
import React, { RefObject } from "react";
import { KeyboardAvoidingView, Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TextInput } from "../../components/textInput/TextInput";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Floater from "../../components/floater/Floater";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: undefined }, "Camera">,
}
export interface State {
    switching: boolean,
    active: number
}

class HowOften extends React.PureComponent<Props, State> {
    s1: RefObject<Animator>;
    s2: RefObject<Animator>;
    s3: RefObject<Animator>;

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            switching: false,
            active: 1
        };

        /* Bindings */
        this.onConfirm = this.onConfirm.bind(this);
        this.activate = this.activate.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
        this.fadeIn = this.fadeIn.bind(this);
        
        /* Refs */
        this.s1 = React.createRef();
        this.s2 = React.createRef();
        this.s3 = React.createRef();
    };

    /* Lifetime */
    async componentDidMount(): Promise<void> {
        this.fadeIn();
    };
    fadeIn(): void {
        [this.s1, this.s2, this.s3].forEach((e, index) => {
            e.current?.wait(index*200).fadeIn(400).start()
        });
    }
    fadeOut(): void {
        [this.s1, this.s2, this.s3].forEach((e, index) => {
            e.current?.wait(index*200).fadeOut(400).start()
        });
    }

    /* Activate button */
    activate(nr: number): void {
        this.setState({ active: nr });
    }

    onConfirm(): void {
        this.fadeOut();
        setTimeout(() => {
            this.props.navigation.navigate("Camera");
        }, 800);
    }

	render() {
		return (
			<View style={Styles.container}>
                <View style={Styles.containerInner}>
                    <Animator startOpacity={0} ref={this.s1}>
                        <Text style={Styles.header}>Goal per day 🎯</Text>
                        <Text style={Styles.paragraph}>
                            How often would you like to take a selfie per day?{" "}
                            <Text style={Styles.italic}>(Can be changed later)</Text>
                        </Text>
                    </Animator>

                    {/* Name */}
                    <Animator startOpacity={0} ref={this.s2}>
                        <View style={Styles.frequencyInput}>
                            <View style={Styles.freqButtonWrapper}>
                                <FrequencyButton active={this.state.active === 1} text="1" onPress={() => this.activate(1)} />
                                <FrequencyButton active={this.state.active === 2} text="2" onPress={() => this.activate(2)} />
                                <FrequencyButton active={this.state.active === 3} text="3" onPress={() => this.activate(3)} />
                                <FrequencyButton active={this.state.active === 4} text="🤷‍♂️" onPress={() => this.activate(4)} />
                            </View>
                        </View>
                    </Animator>

                    {/* Confirm */}
                    <Animator startOpacity={0} ref={this.s3}>
                        <Button active={!this.state.switching} onPress={this.onConfirm} text="Confirm" />
                    </Animator>
                </View>
			</View>
		);
	}
}
function FrequencyButton(props: {
    text: string,
    onPress: () => void,
    active: boolean
}) {
    const [hover, setHover] = React.useState(false);

    return (
        <View style={{
            flex: 1,
        }}>
            <Floater loosness={0.7}>
                <TouchableHighlight
                    underlayColor={"rgb(80, 190, 245)"}
                    style={[
                        Styles.freqButton,
                        props.active && Styles.freqButtonActive,
                        hover && Styles.freqButtonActive,
                    ]}
                    onPress={() => {
                        props.onPress();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    }}
                    onPressIn={() => setHover(true)}
                    onPressOut={() => setHover(false)}
                >
                    <Floater loosness={1.2}>
                        <Text style={[
                            Styles.buttonText,
                            props.active && Styles.buttonTextActive,
                            hover && Styles.buttonTextActive,
                        ]}>{props.text}</Text>
                    </Floater>
                </TouchableHighlight>
            </Floater>
        </View>
    )
}

export default function(props: any) {
	const navigation = useNavigation();
  
	return <HowOften {...props} navigation={navigation} />;
}
