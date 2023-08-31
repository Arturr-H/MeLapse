import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";

/* Interfaces */
interface Props {
    placeholder?: string,
    onChangeText?: (text: string) => void,

    minChars?: number,
    maxChars?: number,
    active: boolean,

    initial?: string,

    spellCheck?: boolean,
    autoCorrect?: boolean,
}
interface State {
    focus: boolean,
    chars: number,
    value: string
}

export class TextInput extends React.PureComponent<Props, State> {
    minMaxText: RefObject<Animator>;
    min: number;
    max: number;

	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            focus: false,
            value: "",
            chars: 0,
        };

        /* Static */
        this.min = 1;
        this.max = 16;

        this.minMaxText = React.createRef();

        this.tryGetValue = this.tryGetValue.bind(this);
	}

    /* Lifetime */
    componentDidMount(): void {
        this.setState({ value: this.props.initial ?? "" });
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.initial !== this.props.initial) {
            this.setState({ value: this.props.initial ?? "" });
        }
    }

    /* On change the character length */
    onCharLenChange(len: number): void {
        this.setState({ chars: len });

        if (len > this.max) {
            this.minMaxText.current?.fadeIn().start();
        }else if (len <= this.max) {
            this.minMaxText.current?.fadeOut().start();
        }
    }

    /* Try get the value of the input, if it's
        invalid (more than max or less than)
        min return null else return input value */
    tryGetValue(): string | null {
        const val = this.state.value;
        const len = val.length;
        
        if (len < this.max && len >= this.min) {
            return val;
        }else if(len > this.max) {
            this.minMaxText.current?.fadeIn().start();
            return null;
        }else {
            this.minMaxText.current?.fadeIn().start();
            return null;
        }
    }

	render() {
		return (
            <View
                style={[
                    Styles.textInputWrapper,
                    this.state.focus && Styles.focused
                ]}
            >
                <RNTextInput
                    spellCheck={this.props.spellCheck ?? false}
                    autoCorrect={this.props.autoCorrect ?? false}
                    style={Styles.textInput}
                    placeholder={this.props.placeholder}
                    onChangeText={(e) => {
                        this.props.onChangeText && this.props.onChangeText(e);
                        this.onCharLenChange(e.length);
                        this.setState({ value: e });
                    }}
                    value={this.state.value}
                    editable={this.props.active}

                    onFocus={() => this.setState({ focus: true })}
                    onBlur={() => this.setState({ focus: false })}
                />

                <View style={Styles.charLenTextWrapper}>
                    <Animator startOpacity={0} ref={this.minMaxText}>
                        <Text style={Styles.charLenText}>{this.state.chars}/{this.max}</Text>
                    </Animator>
                </View>
            </View>
        );
	}
}
