/* Imports */
import React, { RefObject } from "react";
import { Text, View } from "react-native";
import Styles from "../Styles";
import { Button } from "../../../components/button/Button";
import { StackNavigationProp } from "@react-navigation/stack";
import { Animator } from "../../../components/animator/Animator";

/* Interfaces */
interface Props {
    navigation: StackNavigationProp<{ Camera: { comesFrom: string } }, "Camera">,
}
interface State {  }

export default class extends React.PureComponent<Props, State> {
    animator: RefObject<Animator> = React.createRef();

    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
        };

        /* Bindings */
        this.cameraScene = this.cameraScene.bind(this);
    };

    /** Called externally from this component, 
     * triggered when scrollview is focused */
    setFocused(): void {
        this.animator.current?.fadeIn(0).start();
    }

    /** Switch to camera scene */
    cameraScene(): void {
        this.animator.current?.fadeOut(100).start(() => {
            this.props.navigation.navigate("Camera", { comesFrom: "other" });
        });
    }

    /* Lifetime */
    async componentDidMount(): Promise<void> {
    };

	render() {
		return (
            <Animator ref={this.animator} style={Styles.page}>
                <View style={Styles.pageHeader}>
                </View>
                <View style={Styles.pageBody}>
                    <View style={Styles.textContainer}>
                        <Text style={Styles.header2}>Good luck 😄</Text>
                        <Text style={Styles.infoText}>I hope you find joy in capturing daily selfies to document the evolution of your face!</Text>
                    </View>
                </View>
                <View style={Styles.pageFooter}>
                    <Button
                        color="blue"
                        onPress={this.cameraScene}
                        active
                        text="Done"
                    />
                </View>
            </Animator>
		);
	}
}
