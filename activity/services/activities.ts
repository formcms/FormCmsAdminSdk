import useSWR from "swr";
import {decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {ListResponse} from "../../types/listResponse";
import {XEntity} from "../../types/xEntity";
import {fullActivityUrl} from "../config";

export function useActivityEntity(){
    let res = useSWR<XEntity>(
        fullActivityUrl(`/activities/entity`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export  function useActivities(type:string, qs:string) {
    let res = useSWR<ListResponse>(
        fullActivityUrl(`/activities/list/${type}?${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}