import {FetchingStatus} from "../../containers/FetchingStatus"
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {useAuditLogs} from "../services/auditLog"
import {XEntity} from "../../types/xEntity";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {GeneralComponentConfig} from "../../ComponentConfig";
import {toDataTableColumns} from "../../types/attrUtils";
import {formater} from "../../types/formatter";
import {AuditLogLabels} from "../types/auditLogUtil";

export type AuditLogListPageConfig = {
    auditLogLabels :AuditLogLabels | undefined;
}

export function getDefaultAuditLogPageConfig(){
    return {
        auditLogLabels : undefined
    }
}

export function useAuditLogListPage(componentConfig:GeneralComponentConfig,baseRouter: string, schema: XEntity,
                                    pageConfig:AuditLogListPageConfig = getDefaultAuditLogPageConfig()) {
    //entrance
    const initQs = location.search.replace("?", "");

    //data
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.name,schema.primaryKey, schema.defaultPageSize, columns, initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading} = useAuditLogs(qs)
    const currentUrl = `${baseRouter}/${schema.name}/?${qs}`
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    //ui
    const tableColumns = columns.map(x => toDataTableColumns(x, x.field == schema.labelAttributeName ? onEdit : undefined));
    const auditLogLabels = pageConfig.auditLogLabels;
    if (auditLogLabels) {
        columns.forEach(column => {
            column.header = auditLogLabels[column.field as keyof typeof auditLogLabels];
        })
    }

    //referencing
    const navigate = useNavigate();
    const Icon = componentConfig.etc.icon;

    return {AuditLogListPageMain}

    function actionTemplate  (rowData: any) {
        return <Icon icon={'pi pi-search'} onClick={()=>onEdit(rowData)}/>;
    }

    function onEdit(rowData: any) {
        const url = `${baseRouter}/${schema.name}/${rowData[schema.primaryKey]}?ref=${encodeURIComponent(currentUrl)}`;
        navigate(url);
    }

    function AuditLogListPageMain() {
        const LazyDataTable = componentConfig.dataComponents.lazyTable;
        return <>
            <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
            {data && columns && (
                <div className="card">
                    <LazyDataTable
                        dataKey={schema.primaryKey}
                        columns={tableColumns}
                        data={data}
                        stateManager={stateManager}
                        actionTemplate={ actionTemplate}
                        formater={formater}
                    />
                </div>
            )}
        </>
    }
}