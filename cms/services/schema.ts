import useSWR from "swr";
import {fullCmsApiUrl} from "../configs";
import {decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {XEntity} from "../../types/xEntity";

export function useSchema(schemaName: string | undefined) {
    const url = schemaName ? fullCmsApiUrl(`/schemas/entity/${schemaName}`) : null;
    let {data, error, isLoading} = useSWR<XEntity>(url, fetcher, swrConfig)
    if (error) {
        error = decodeError(error)
    }
    return {data, isLoading, error}
}