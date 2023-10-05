import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight, TouchableWithoutFeedback } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";

/* Interfaces */
interface ModalProps {
    /** Buttons at the footer of the modal */
    buttons: ModalButton[],

    /** Header (title) */
    header: string,

    /** Modal description */
    description: string,
}
interface ModalButton {
    /** Color of the button */
    color: "red" | "blue" | "green",

    /** Text */
    text: string,

    /** Function ("close", or () => void) */
    onClick: "close" | (() => void)
}
interface Props { }
interface State {
    modals: ModalProps[],
    bgOpacity: Animated.Value
}

export class ModalConstructor extends React.PureComponent<Props, State> {

    /* Static */
    colors: { "blue": string[], "red": string[], "green": string[] } = {
        "blue": ["rgb(90, 200, 245)", "rgb(80, 190, 245)"],
        "red": ["rgb(255, 45, 85)", "rgb(235, 25, 75)"],
        "green": ["rrgb(90, 200, 245)", "rgb(80, 190, 245)"]
    }
    
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            modals: [],
            bgOpacity: new Animated.Value(0)
        };

        /* Bindings */
        this.fadeOutBg = this.fadeOutBg.bind(this);
        this.fadeInBg = this.fadeInBg.bind(this);
	}

    /* Lifetime */
    componentDidMount(): void {
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    }

    /** Append a new modal */
    constructModal(modal: ModalProps): void {
        const modals =  [...this.state.modals, modal];
        this.setState({ modals });

        if (modals.length > 0) {
            this.fadeInBg();
        }else {
            this.fadeOutBg();
        }
    }

    /* Anim for bg */
    fadeInBg(): void {
        Animated.spring(this.state.bgOpacity, { toValue: 1, useNativeDriver: true }).start();
    }
    fadeOutBg(): void {
        Animated.spring(this.state.bgOpacity, { toValue: 0, useNativeDriver: true }).start();
    }

    /** Close modal */
    closeModal(idx: number): void {
        let modals = this.state.modals;
        modals.splice(idx, 1);
        this.setState({ modals: [...modals] });

        if (modals.length === 0) {
            this.fadeOutBg();
        }
    }

    /** OnClick */
    onClick(idx: number, fn: () => void): void {
        this.closeModal(idx);
        fn();
    }

	render() {
        const pointerEvents = { pointerEvents: this.state.modals.length > 0 ? "auto" : "none" as any };
        const bgOpacity = { opacity: this.state.bgOpacity };

		return (
            <View style={[Styles.container, pointerEvents]}>

                <Animated.View style={[
                    Styles.modalBackground,
                    bgOpacity
                ]} />

            <TouchableWithoutFeedback
                onPress={() => this.closeModal(this.state.modals.length - 1)}
                style={Styles.modalContainer}
            ><View style={Styles.modalContainerWrapper}>

                {this.state.modals.map((modal, modalIdx) => <Animated.View style={Styles.modal}>
                    {/* Header */}
                    <View style={Styles.modalHeader}>
                        <Text style={Styles.modalHeaderText}>{modal.header}</Text>
                    </View>

                    {/* Body */}
                    <View style={Styles.modalBody}>
                        <Text style={Styles.modalDescritionText}>{modal.description}</Text>
                    </View>

                    {/* Footer */}
                    <View style={Styles.modalFooter}>
                        {modal.buttons.map(button =>
                            <TouchableHighlight
                                underlayColor={this.colors[button.color][1]}
                                style={[Styles.modalButton, {
                                    backgroundColor: this.colors[button.color][0],
                                    borderColor: this.colors[button.color][1]
                                }]}
                                onPress={button.onClick === "close"
                                    ? () => this.closeModal(modalIdx)
                                    : () => this.onClick(modalIdx, button.onClick as () => void)}
                            >
                                <Text style={Styles.modalButtonText}>{button.text}</Text>
                            </TouchableHighlight>
                        )}
                    </View>
                </Animated.View>)}
            </View></TouchableWithoutFeedback>
            </View>
        );
	}
}
