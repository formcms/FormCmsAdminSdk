import {AuditLog} from "./auditLog";

export type AuditLogLabels = {
    [K in keyof AuditLog]: string;
};