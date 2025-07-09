import useSWR from "swr";
import {decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {fullSubUrl} from "../config";
import {Price} from "../types/price";

export function useSubscriptionPrices()  {
    let res = useSWR<Price[]>(
        fullSubUrl(`/subscriptions/sub_prices`), fetcher, swrConfig);
    return {...res, error: decodeError(res.error)}
}