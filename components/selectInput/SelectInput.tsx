/* Imports */
import React from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

/* Types */
type SelectButtonContent = string | DoubleText;

/* Interfaces */
interface DoubleText {
    main: string, lower: string
}
interface Props {
    /** `idx`: the index of the button in
     * the button array which was clicked */
    onChange?: (idx: number) => void,

    /** the buttons which will appear inside
     * this component. 
     * 
     * buttons={["1", "2", "3"]}
     */
    buttons: SelectButtonContent[],

    /** Index of which button is initially activated */
    initial?: number
}
interface State {
    active: number
}

/** The input */
export default class SelectInput extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            active: this.props.initial ?? 0
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (prevProps.initial !== this.props.initial) {
            this.setState({ active: this.props.initial ?? 0 });
        }
    }

    render(): React.ReactNode {
        return (
            <View style={Styles.selectInput}>
                <View style={[Styles.selectButtonWrapper]}>
                    {this.props.buttons.map((e, index) => 
                        <SelectButton
                            active={this.state.active === index}
                            content={e}
                            key={"selbtn-" + index}
                            onPress={() => {
                                this.setState({ active: index });
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                this.props.onChange && this.props.onChange(index);
                            }}
                        />
                    )}
                </View>
            </View>
        )
    }
}

/* Button */
function SelectButton(props: {
    content: SelectButtonContent,
    onPress: () => void,
    active: boolean
}) {
    const [hover, setHover] = React.useState(false);

    return (
        <View style={{
            flex: 1,
        }}>
            <TouchableHighlight
                underlayColor={"rgb(80, 190, 245)"}
                style={[
                    Styles.selectButton,
                    props.active && Styles.selectButtonActive,
                    hover && Styles.selectButtonActive,
                ]}
                onPress={() => {
                    props.onPress();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }}
                onPressIn={() => setHover(true)}
                onPressOut={() => setHover(false)}
            >
                {typeof props.content === "string" ?
                    <Text style={[
                        Styles.buttonText,
                        props.active && Styles.buttonTextActive,
                        hover && Styles.buttonTextActive,
                    ]}>{props.content}</Text>

                    /* If input is a text with small description */
                    : (props.content.lower !== undefined && props.content.main !== undefined) ?

                    <View style={Styles.textMainLowerContainer}>
                        {/* Main */}
                        <Text style={[
                            Styles.buttonText,
                            props.active && Styles.buttonTextActive,
                            hover && Styles.buttonTextActive,
                        ]}>{props.content.main}</Text>

                        {/* Lower */}
                        <Text style={[
                            Styles.buttonTextDescription,
                            props.active && Styles.buttonTextDescriptionActive,
                            hover && Styles.buttonTextDescriptionActive,
                        ]}>{props.content.lower}</Text>
                    </View>
                    
                : null }
            </TouchableHighlight>
        </View>
    )
}
