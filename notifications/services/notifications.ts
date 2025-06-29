import useSWR from "swr";
import {decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {ListResponse} from "../../types/listResponse";
import {fullNotificationUrl} from "../config";

export function useNotifications(qs:string)  {
    let res = useSWR<ListResponse>(
        fullNotificationUrl(`/notifications?qs=${qs}`), fetcher, swrConfig);
    return {...res, error: decodeError(res.error)}
}