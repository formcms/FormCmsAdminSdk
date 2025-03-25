import {Route, Routes} from "react-router-dom";
import {useAuditLogsEntity} from "./services/auditLog";
import {XEntity} from "../cms/types/xEntity";
import React from "react";

export interface EntityPageProps {
    baseRouter: string,
    schema: XEntity
}

interface AuditLogRouterProps {
    baseRouter: string;
    AuditLogListPage: React.FC<EntityPageProps>;
    AuditLogDetailPage: React.FC<EntityPageProps>;

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