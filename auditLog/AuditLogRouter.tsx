import {Route, Routes} from "react-router-dom";
import {useAuditLogsEntity} from "./services/auditLog";
import {XEntity} from "../cms/types/xEntity";
import React from "react";

interface AuditLogRouterProps {
    baseRouter: string;
    AuditLogListPage: React.FC<{schema:XEntity,baseRouter:string}>;
    AuditLogDetailPage: React.FC<{schema:XEntity,baseRouter:string}>;

}

export function AuditLogRouter(
    {
        baseRouter,
        AuditLogListPage,
        AuditLogDetailPage,
    }: AuditLogRouterProps) {
    const {data: auditLog} = useAuditLogsEntity();
    return auditLog && <Routes>
        <Route path={`/${auditLog.name}`} element={
            <AuditLogListPage schema={auditLog} baseRouter={baseRouter}/>
        }/>
        <Route path={`/${auditLog.name}/:id`} element={
            <AuditLogDetailPage schema={auditLog} baseRouter={baseRouter}/>
        }/>
        <Route path={`*`} element={
            <AuditLogListPage schema={auditLog} baseRouter={baseRouter}/>
        }/>
    </Routes>
}