import useSWR from "swr";
import {catchResponse, decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {ListResponse} from "../../types/listResponse";
import {fullActivityUrl} from "../config";
import axios from "axios";
import {DailyActivityCount} from "../types/dailyActivityCount";
import {PageVisitCount} from "../types/pageVisitCount";

export  function useActivities(type:string, qs:string) {
    let res = useSWR<ListResponse>(
        fullActivityUrl(`/engagements/list/${type}?${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function deleteActivity(id:number) {
    return catchResponse(()=>axios.post(fullActivityUrl(`/engagements/delete/${id}`)))
}

export function usePageVisitCount(topN:number) {
    let res = useSWR<PageVisitCount[]>(
        fullActivityUrl(`/engagements/page-counts?n=${topN}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function useVisitCounts(n:number,authed:boolean) {
    let res = useSWR<DailyActivityCount[]>(
        fullActivityUrl(`/engagements/visit-counts?n=${n}&authed=${authed}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function useActivityCounts(n:number) {
    let res = useSWR<DailyActivityCount[]>(
        fullActivityUrl(`/engagements/counts?n=${n}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}