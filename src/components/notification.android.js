import PushNotification ,{Importance} from "react-native-push-notification"



const channeliddate = channel =>{
    PushNotification.createChannel(
        {
          channelId: channel, // (required)
          channelName: "My channel", // (required)
          channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
          playSound: true, // (optional) default: true
          soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
          importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
          vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
        },
        (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      );
}



const shownotification = (channel,title,message) =>{
    PushNotification.localNotification({
        channelId:channel,
        title:title,
        message:message,
        vibrate:true,
        vibration:500,
        priority: "high",
        playSound:true
        
    })
}





const handlecancel = () =>{
    PushNotification.cancelAllLocalNotifications()
}


export {channeliddate, shownotification ,handlecancel}
