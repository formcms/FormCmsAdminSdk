import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {useEffect} from "react";
import {NotificationField} from "../types/utils";
import {useNotifications} from "../services/notifications";

export function useNotificationPage() {
    //entrance
    const initQs = location.search.replace("?", "");

    //data
    const stateManager = useDataTableStateManager('notification', NotificationField('id'), 8, [], initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data: notificationResponse, error, isLoading} = useNotifications(qs);
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    const orderFields = (
        actionTypeLabel: string,
        messageTypeLabel: string,
        cratedAtLabel: string
    ) => [
        {
            value: NotificationField('actionType'),
            label: actionTypeLabel
        },
        {
            value: NotificationField('messageType'),
            label: messageTypeLabel
        },
        {
            value: NotificationField('createdAt'),
            label: cratedAtLabel
        }
    ];

    const searchField = NotificationField('message');
    return {
        notificationResponse, error, isLoading, stateManager, orderFields, searchField
    };
}