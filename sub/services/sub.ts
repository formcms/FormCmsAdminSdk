import {catchResponse, decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {Session} from "../types/session";
import axios from "axios";
import {fullActivityUrl} from "../../engagements/config";
import useSWR from "swr";
import {fullSubUrl} from "../config";
import {Billing} from "../types/billing";

export function createSubSession(priceId: string)  {
    return catchResponse(() =>
        axios.post<Session>(fullActivityUrl(`/subscriptions/sub_sessions?price=${priceId}&back=${window.location.href}`)));
}

export function useSubBilling()  {
    let res = useSWR<Billing>(
        fullSubUrl(`/subscriptions/sub_info`), fetcher, swrConfig);
    return {...res, error: decodeError(res.error)}
}