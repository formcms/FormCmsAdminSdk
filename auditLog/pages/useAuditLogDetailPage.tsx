import { useParams } from "react-router-dom"
import { useAuditLogsDetail } from "../services/auditLog"

export function useAuditLogDetailPage(baseRouter:string){
    const {id} = useParams()
    const {data:auditLogData} = useAuditLogsDetail(id!)
    const refUrl = new URLSearchParams(location.search).get("ref") ?? baseRouter;
    return {auditLogData, refUrl}
}

