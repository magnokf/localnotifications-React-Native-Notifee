import {Button, Text, View} from "react-native";
import notifee, {
    AndroidImportance,
    EventType,
    RepeatFrequency,
    TimestampTrigger,
    TriggerType
} from "@notifee/react-native";
import {useEffect} from "react";

export default function Index() {


    async function displayNotification() {
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({
            id: "default",
            name: "Default Channel",
            sound: "default",
            vibration: true,
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: "Hello World",
            body: "This is a notification",
            android: {
                channelId,
                pressAction: {
                    id: "default",
                },
            },
            ios: {
                categoryId: "default",
                sound: "default",
            },
        });

    }

    async function scheduleNotification() {
        const date = new Date(Date.now());
        date.setSeconds(date.getSeconds() + 10);
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
            repeatFrequency: RepeatFrequency.NONE
        }
        await notifee.requestPermission();
        const channelId = await notifee.createChannel({
            id: "default",
            name: "Default Channel",
            sound: "default",
            vibration: true,
            importance: AndroidImportance.HIGH,
        });
        await notifee.createTriggerNotification(({
            title: "⏱️ Notificação Agendada",
            body: "Esse é um teste de notificação agendada",
            android: {
                channelId,
                pressAction: {
                    id: "default",
                },
                importance: AndroidImportance.HIGH,
            },
            ios: {
                categoryId: "default",
                sound: "default",
            },
        }), trigger);



    }



    useEffect(() => {

        return notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                if(detail) {

                    console.log("Notification Pressed", detail.notification);
                }
            }
        });
    })

    useEffect(() => {

        return notifee.onBackgroundEvent(async ({ type, detail }) => {
            if (type === EventType.PRESS) {
                if(detail) {
                    console.log("Notification Pressed", detail.notification);
                }
            }

            if (type === EventType.ACTION_PRESS) {
                if (detail)
                console.log("Notification Action Pressed", detail.notification);
            }
        })
    })


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Local Notifications</Text>
        <Button title={'Display Notification'} onPress={displayNotification} />
        <Button title={'Schedule Notification'} onPress={scheduleNotification} />
    </View>
  );
}
