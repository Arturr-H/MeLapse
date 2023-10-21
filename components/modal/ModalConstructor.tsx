import React, { RefObject } from "react";
import { TextInput as RNTextInput, Animated, Dimensions, Easing, Image, TouchableOpacity, View, Text, TouchableHighlight, TouchableWithoutFeedback } from "react-native";
import Styles from "./Styles";
import { Animator } from "../animator/Animator";
import { Colors } from "../../styleBundles/Colors";

/* Interfaces */
interface ModalProps {
    /** Buttons at the footer of the modal */
    buttons?: ModalButton[],

    /** Header (title) */
    header?: string,

    /** Modal description */
    description?: string,

    /** Modal body content (JSX) */
    body?: JSX.Element
}
interface ModalButton {
    /** Color of the button */
    color: "red" | "blue",

    /** Text */
    text: string,

    /** Function ("close", or () => void) */
    onClick: "close" | (() => void),

    /** Only border no background (indicates not usually clicked) */
    hollow?: boolean
}
interface Props { }
interface State {
    modals: ModalProps[],
    bgOpacity: Animated.Value
}

export class ModalConstructor extends React.PureComponent<Props, State> {

    /* Static */
    colors: { "blue": string[], "red": string[] } = {
        "blue": [Colors.blue.default, Colors.blue.darkened],
        "red": [Colors.red.default, Colors.red.darkened],
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
            <View style={Styles.modalContainerWrapper}>

                {this.state.modals.map((modal, modalIdx) => <View key={"MODAL-idx-" + modalIdx} style={Styles.modal}>
                    {/* DElete button */}
                    <TouchableOpacity
                        onPress={() => this.closeModal(this.state.modals.length - 1)}
                        style={Styles.modalDeleteButton}
                        activeOpacity={1}
                    ><Text style={Styles.modalDeleteButtonText}>❌</Text></TouchableOpacity>

                    {/* Header */}
                    <View style={Styles.modalHeader}>
                        <Text style={Styles.modalHeaderText}>{modal.header}</Text>
                    </View>

                    {/* Description */}
                    <View style={Styles.modalBody}>
                        {modal.description && <Text style={Styles.modalDescritionText}>{modal.description}</Text>}
                        {modal.body}
                    </View>

                    {/* Footer */}
                    <View style={Styles.modalFooter}>
                        {(modal.buttons ?? []).map((button, buttonIdx) =>
                            <TouchableHighlight
                                key={"mbut" + modalIdx + "-" + buttonIdx}
                                underlayColor={this.colors[button.color][1]}
                                style={[Styles.modalButton, {
                                    backgroundColor: button.hollow === true ? "none" : this.colors[button.color][0],
                                    borderColor: this.colors[button.color][1]
                                }]}
                                onPress={button.onClick === "close"
                                    ? () => this.closeModal(modalIdx)
                                    : () => this.onClick(modalIdx, button.onClick as () => void)}
                            >
                                <Text style={[
                                    Styles.modalButtonText,
                                    { color: button.hollow === true ? this.colors[button.color][0] : "#fff" }
                                ]}>{button.text}</Text>
                            </TouchableHighlight>
                        )}
                    </View>
                </View>)}
            </View>
            </View>
        );
	}
}
