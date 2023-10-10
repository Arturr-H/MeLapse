import { TouchableHighlight } from "react-native-gesture-handler";
import Styles from "./Styles";
import { Text, View } from "react-native";
import { ImpactFeedbackStyle, impactAsync } from "expo-haptics";
import React from "react";
import { Button } from "../../components/button/Button";

/* Interfaces */
interface Props {
    deleteCurrent: () => void,
    setOnionskin: () => void,
    saveCurrent: () => void,
}
interface State {
    contextVisible: boolean
}

/* Context menu button */
export default class ContextMenu extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            contextVisible: false
        }

        /* Bindings */
        this.toggle = this.toggle.bind(this);
        this.close = this.close.bind(this);
    }

    /** Toggle context */
    toggle(): void {
        impactAsync(ImpactFeedbackStyle.Light);
        this.setState({ contextVisible: !this.state.contextVisible });
    }

    /** Close context (called externally) */
    close(): void {
        this.setState({ contextVisible: false});
    }
    
    render(): React.ReactNode {
        return (
            <View style={Styles.contextMenu}>
                <TouchableHighlight
                    onPress={this.toggle}
                    style={Styles.contextMenuButton}
                    underlayColor={"#ddd"}
                >
                    <Text style={Styles.contextMenuButtonText}>⚙️</Text>
                </TouchableHighlight>

                {this.state.contextVisible && <View style={Styles.contextBtnContainer}>
                    <Button small text="Download" active onPress={this.props.saveCurrent} />
                    <Button
                        color="blue"
                        small
                        text="onionskin"
                        active
                        onPress={this.props.setOnionskin}
                    />
                    <Button
                        color="red"
                        small
                        text="delete"
                        active
                        onPress={this.props.deleteCurrent}
                        confirm={{
                            title: "Delete?",
                            message: "This image will be deleted forever 😞"
                        }}
                    />
                </View>}
            </View>
        )
    }
}


  