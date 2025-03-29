import {FetchingStatus} from "../../containers/FetchingStatus"
import {EditDataTable} from "../../components/data/EditDataTable";
import {encodeDataTableState} from "../../types/dataTableStateUtil";
import {createColumn} from "../../cms/containers/createColumn";
import {useDataTableStateManager} from "../../hooks/useDataTableStateManager";

import {useAuditLogs} from "../services/auditLog"
import {XEntity} from "../../types/xEntity";


import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {getDefaultComponentConfig, ComponentConfig} from "../../componentConfig";

export function useAuditLogListPage(baseRouter: string, schema: XEntity, componentConfig:ComponentConfig = getDefaultComponentConfig()) {
    //entrance
    const initQs = location.search.replace("?", "");

    //data
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading} = useAuditLogs(qs)
    const tableColumns = columns.map(x => createColumn(x,componentConfig, undefined, x.field == schema.labelAttributeName ? onEdit : undefined));
    tableColumns.push(<Column
        body={
            (rowData) => <Button icon="pi pi-search" rounded outlined className="mr-2" onClick={() => onEdit(rowData)}/>
        }
        exportable={false}
        style={{minWidth: '12rem'}}/>)

    //nav
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    //referencing
    const navigate = useNavigate();

    return {AuditLogListPageMain}

    function onEdit(rowData: any) {
        const url = `${baseRouter}/${schema.name}/${rowData[schema.primaryKey]}?ref=${encodeURIComponent(window.location.href)}`;
        navigate(url);
    }

    function AuditLogListPageMain() {
        return <>
            <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
            {data && columns && (
                <div className="card">
                    <EditDataTable
                        dataKey={schema.primaryKey}
                        columns={tableColumns}
                        data={data}
                        stateManager={stateManager}
                    />
                </div>
            )}
        </>
    }
}