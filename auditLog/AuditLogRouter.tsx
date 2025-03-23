import {Route, Routes} from "react-router-dom";
import {AuditLogList} from "./pages/AuditLogList"
import { AuditLogDetail } from "./pages/AuditLogDetail";
import { useAuditLogsEntity } from "./services/auditLog";
export function AuditLogRouter({baseRouter}:{baseRouter:string}) {
    const {data:auditLog} = useAuditLogsEntity();
    return auditLog&&<Routes>
        <Route path={`/${auditLog.name}`} element={<AuditLogList schema={auditLog} baseRouter={baseRouter}/>}/>
        <Route path={`/${auditLog.name}/:id`} element={<AuditLogDetail baseRouter={baseRouter} />}/>
        <Route path={`*`} element={<AuditLogList schema={auditLog} baseRouter={baseRouter}/>}/>
    </Routes>
}