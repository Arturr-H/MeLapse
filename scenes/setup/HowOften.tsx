import React, { RefObject } from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { Button } from "../../components/button/Button";
import { Animator } from "../../components/animator/Animator";
import SelectInput from "../../components/selectInput/SelectInput";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import AppConfig from "../preferences/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* Interfaces */
export interface Props {
    navigation: StackNavigationProp<{ Camera: undefined }, "Camera">,
}
export interface State {
    switching: boolean,
    active: number
}

export class HowOften extends React.PureComponent<Props, State> {
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
            e.current?.wait(index * 200).fadeIn(400).start();
        });
    }
    fadeOut(): void {
        [this.s1, this.s2, this.s3].forEach((e, index) => {
            e.current?.wait(index * 200).fadeOut(400).start();
        });
    }

    /* Activate button */
    activate(nr: number): void {
        this.setState({ active: nr });
    }

    async onConfirm(): Promise<void> {
        this.fadeOut();
        await AsyncStorage.setItem("setupComplete", "true");
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
                        <SelectInput buttons={["1", "2", "3", "🤷‍♂️"]} onChange={AppConfig.setTargetTimesPerDay} />
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

export default function(props: any) {
	const navigation = useNavigation();
  
	return <HowOften {...props} navigation={navigation} />;
}
