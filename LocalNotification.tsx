import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

interface ILocalNotificationHook {
    expoPushToken: string | undefined;
    notification: Notifications.Notification;
}

/** Hook to create local notifications */
export const useLocalNotification = (): ILocalNotificationHook => {
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(
        {} as Notifications.Notification
    );
    const notificationListener = useRef<Notifications.Subscription | undefined>();
    const responseListener = useRef<Notifications.Subscription | undefined>();
    

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token || "");
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener(notification => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(response => {
                setNotification(response.notification);
            });

        return () => {
            if (notificationListener.current?.remove) {
                notificationListener.current.remove();
            }
            if (responseListener.current?.remove) {
                responseListener.current.remove();
            }
        };
    }, []);

    return { expoPushToken, notification };
};

async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#ffffff",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            return undefined;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId
        })).data;
    }

    return token;
}

/** If device allows notis */
export async function allowsNotificationsAsync(): Promise<boolean> {
    const settings = await Notifications.getPermissionsAsync();
    return (
        settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}
