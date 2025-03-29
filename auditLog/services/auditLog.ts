import useSWR from "swr";
import { fullAuditLogUrl } from "../config";
import {decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import { AuditLog } from "../types/auditLog";
import {XEntity} from "../../types/xEntity";
import {ListResponse} from "../../types/listResponse";


export  function useAuditLogsEntity() {
    let res = useSWR<XEntity>(fullAuditLogUrl(`/audit_log/entity`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}
export  function useAuditLogs(qs:string) {
    let res = useSWR<ListResponse>(fullAuditLogUrl(`/audit_log?${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export  function useAuditLogsDetail(id:string) {
    let res = useSWR<AuditLog>(fullAuditLogUrl(`/audit_log/${id}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}