import {DataTable} from "primereact/datatable";
import {ListResponse} from "../../cms/types/listResponse";
import React from "react";

export function EditDataTable(
    {
        dataKey,
        columns, 
        data, 
        stateManager:{state,handlers:{onPage,onFilter,onSort}},
    }:
    {
        dataKey:string,
        data: ListResponse | undefined
        stateManager:{
            state:any
            handlers:{
                onPage:any,
                onFilter:any,
                onSort:any,
            }
        }

        columns: React.JSX.Element[];
    }) {
    return columns && data && <DataTable
        key={dataKey}
        dataKey={dataKey}
        sortMode="multiple"
        value={data.items}
        paginator
        totalRecords={data.totalRecords}
        rows={state.rows}
        lazy
        first={state.first}
        filters={state.filters}
        multiSortMeta={state.multiSortMeta}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        onSort={onSort}
        onFilter={onFilter}
        onPage={onPage}>
        {columns}
    </DataTable>
}