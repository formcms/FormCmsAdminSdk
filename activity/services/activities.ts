import useSWR from "swr";
import {catchResponse, decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {ListResponse} from "../../types/listResponse";
import {fullActivityUrl} from "../config";
import axios from "axios";

export  function useActivities(type:string, qs:string) {
    let res = useSWR<ListResponse>(
        fullActivityUrl(`/activities/list/${type}?${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export function deleteActivity(id:number) {
    return catchResponse(()=>axios.post(fullActivityUrl(`/activities/delete/${id}`)))
}
