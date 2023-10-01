import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";

/* Interfaces */
interface Props {
}
interface State {
    progressInnerWidth?: number,
    scaleX: Animated.Value
}

export class ProgressBar extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            scaleX: new Animated.Value(0)
        };

        this.updateProgress = this.updateProgress.bind(this);
	}

    /* Lifetime */
    componentDidMount(): void {
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        // if (prevProps.progress !== this.props.progress) {
        //     this.updateProgress(this.props.progress)
        // }
    }

    /** Called externally */
    updateProgress(to: number): void {
        Animated.spring(this.state.scaleX, {
            toValue: to*2,
            useNativeDriver: true,
        }).start();
    }

	render() {
        const width = this.state.progressInnerWidth;
        const scaleX = this.state.scaleX;

		return (
            <View style={Styles.progressBarShell}>
                <Animated.View
                    onLayout={(e) => this.setState({
                        progressInnerWidth: e.nativeEvent.layout.width
                    })}
                    style={[
                        Styles.progressBarInner,
                        { transform: [
                            { translateX: - (width ? width/2 : 0) },
                            { scaleX },
                        ] },
                        width ? { width } : {}
                    ]}
                
                />
            </View>
        );
	}
}
