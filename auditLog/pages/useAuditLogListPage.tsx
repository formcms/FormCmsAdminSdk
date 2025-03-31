import {FetchingStatus} from "../../containers/FetchingStatus"
import {encodeDataTableState} from "../../types/dataTableStateUtil";
import {useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {useAuditLogs} from "../services/auditLog"
import {XEntity} from "../../types/xEntity";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {ComponentConfig} from "../../ComponentConfig";
import {toDataTableColumns} from "../../types/attrUtils";
import {formater} from "../../types/formatter";

export function useAuditLogListPage(componentConfig:ComponentConfig,baseRouter: string, schema: XEntity) {
    //entrance
    const initQs = location.search.replace("?", "");

    //data
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading} = useAuditLogs(qs)

    const tableColumns = columns.map(x => toDataTableColumns(x, x.field == schema.labelAttributeName ? onEdit : undefined));
    const Icon = componentConfig.etc.icon;
    const actionTemplate = (rowData: any) => <Icon icon={'pi pi-search'} onClick={()=>onEdit(rowData)}/>;
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    //referencing
    const navigate = useNavigate();
    return {AuditLogListPageMain}

    function onEdit(rowData: any) {
        const url = `${baseRouter}/${schema.name}/${rowData[schema.primaryKey]}?ref=${encodeURIComponent(window.location.href)}`;
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