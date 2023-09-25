/* Imports */
import React from "react";
import Styles from "./Styles";
import { Animated, Image, StyleProp, Text, TouchableHighlight, TouchableOpacity, View, ViewStyle } from "react-native";
import { Gyroscope } from "expo-sensors";

/* Interfaces */
interface Props {
    children: JSX.Element | JSX.Element[],
    style?: Animated.AnimatedProps<StyleProp<ViewStyle>>,

    /// How "loose" the element is connected to something behind it
    loosness?: number,
}
interface State {
    data: { x: number, y: number, z: number },
    animated: Animated.ValueXY,
    subscription: any,
}

/* Main */
export default class Floater extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            data: { x: 0, y: 0, z: 0 },
            animated: new Animated.ValueXY(),
            subscription: null,
        };

        /* Bindings */
        this._subscribe = this._subscribe.bind(this);
        this._unsubscribe = this._unsubscribe.bind(this);
	}

	/* Lifecycle */
	componentDidMount(): void {
        this._subscribe();
        Gyroscope.setUpdateInterval(150);
    }
	componentWillUnmount(): void {
        this._unsubscribe();
    }

    /* Gyroscope logic */
    _subscribe() {
        this.setState({
            subscription: Gyroscope.addListener(gyroscopeData => {
                let { x, y } = gyroscopeData;
                let a = x;
                x = y;
                y = a;

                let loosness = this.props.loosness ?? 5;
                Animated.spring(this.state.animated, {
                    toValue: { x: -x*loosness, y: -y*loosness },
                    useNativeDriver: false
                }).start();
            })
        });
    };
    _unsubscribe() {
        const { subscription } = this.state;
        if (subscription) {
            subscription.remove();
            this.setState({ subscription: null });
        }
    };

	/* Render */
	render() {
		return (
            <Animated.View
            style={[
                    /* @ts-ignore */
                    this.props.style,

                    { transform: this.state.animated.getTranslateTransform() }
                ]}
            >
                {this.props.children}

                {/* <Text>{this.state.data.x}</Text> */}
            </Animated.View>
		);
	};
}
