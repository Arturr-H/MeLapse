import { Alert, Text, TouchableOpacity, View } from "react-native"
import Styles from "./Styles"


export const TitleH3 = (props: { title: string, info?: string }) => {
    return <View style={Styles.titleContainer}>
        <Text style={Styles.h3}>{props.title}</Text>

        {props.info && <TouchableOpacity
            activeOpacity={0.5}
            style={Styles.questionMarkButtonTouchable}
            onPress={() => Alert.alert(
                "Info 🤔",
                props.info,
                [{ text: "Okay" }]
            )}
        >
            <Text style={Styles.questionMarkButton}>?</Text>
        </TouchableOpacity>}
    </View>
}
export const TitleH2 = (props: { title: string }) => {
    return <Text style={Styles.h2}>{props.title}</Text>
}
export const TitleH1 = (props: { title: string }) => {
    return <Text style={Styles.header}>{props.title}</Text>
}


export const TitleCentered = (props: { title: string }) => {
    return <Text style={Styles.headerCentered}>{props.title}</Text>
}