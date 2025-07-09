import {Notification} from "./notification";

export function NotificationField(key: keyof Notification) {
    return key as string;
}