/* Imports */
import React from "react";
import { Text, View } from "react-native";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import Floater from "../floater/Floater";

/* Interfaces */
interface Props {
    /** `idx`: the index of the button in
     * the button array which was clicked */
    onChange?: (idx: number) => void,

    /** the buttons which will appear inside
     * this component. 
     * 
     * buttons={["1", "2", "3"]}
     */
    buttons: string[],

    /** Index of which button is initially activated */
    initial?: number
}
interface State {
    active: number
}

/** The input */
class SelectInput extends React.PureComponent<Props, State> {
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
                <Floater loosness={1} style={Styles.selectButtonWrapper}>
                    {this.props.buttons.map((e, index) => 
                        <SelectButton
                            active={this.state.active === index}
                            text={e}
                            key={"selbtn-" + index}
                            onPress={() => {
                                this.setState({ active: index });
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                this.props.onChange && this.props.onChange(index);
                            }}
                        />
                    )}
                </Floater>
            </View>
        )
    }
}

/* Button */
function SelectButton(props: {
    text: string,
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
                <Text style={[
                    Styles.buttonText,
                    props.active && Styles.buttonTextActive,
                    hover && Styles.buttonTextActive,
                ]}>{props.text}</Text>
            </TouchableHighlight>
        </View>
    )
}

export default function(props: Props) {
	const navigation = useNavigation();
  
	return <SelectInput {...props} />;
}
