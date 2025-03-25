import {XEntity} from "../types/xEntity";
import {useLocation, useNavigate} from "react-router-dom";
import {useGetCmsAssetsUrl} from "../services/asset";
import {createColumn} from "../../components/data/columns/createColumn";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {deleteItem, useListData} from "../services/entity";
import {useEffect} from "react";
import {useCheckError} from "../../components/useCheckError";
import {useConfirm} from "../../components/useConfirm";
import {FetchingStatus} from "../../components/FetchingStatus";
import {EditDataTable} from "../../components/data/EditDataTable";
import {NewItemRoute} from "../EntityRouter";

export function useDataListPage(schema:XEntity, baseRouter:string) {
    const navigate = useNavigate();
    const createNewItem = () => {
        navigate(`${baseRouter}/${schema.name}/${NewItemRoute}`);
    }
    return {createNewItem, DataListPageMain}

    function DataListPageMain() {
        //entrance
        const initQs = useLocation().search.replace("?", "");

        //data
        const getCmsAssetUrl = useGetCmsAssetsUrl();
        const columns = schema?.attributes?.filter(x =>
            x.inList && x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable') ?? [];
        const dataTableColumns = columns.map(x => createColumn(x, getCmsAssetUrl, x.field == schema.labelAttributeName ? onEdit : undefined))
        const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, initQs);
        const qs = encodeDataTableState(stateManager.state);
        const {data, error, isLoading, mutate} = useListData(schema.name, qs)

        //navigate
        useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

        //components
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
        const {confirm, Confirm} = useConfirm("dataItemPage" + schema.name);

        function onDuplicate(rowData: any) {
            const id = rowData[schema.primaryKey];
            const url = `${baseRouter}/${schema.name}/${NewItemRoute}?sourceId=${id}&ref=${encodeURIComponent(window.location.href)}`;
            navigate(url);
        }

        function onEdit(rowData: any) {
            const id = rowData[schema.primaryKey];
            const url = `${baseRouter}/${schema.name}/${id}?ref=${encodeURIComponent(window.location.href)}`;
            navigate(url);
        }

        async function onDelete(rowData: any) {
            confirm(`Do you want to delete this item [${rowData[schema.labelAttributeName]}]?`, async () => {
                const {error} = await deleteItem(schema.name, rowData);
                await handleErrorOrSuccess(error, 'Delete Succeed', mutate);
            })
        }

        return <>
            <CheckErrorStatus/>
            <Confirm/>
            <FetchingStatus isLoading={isLoading} error={error}/>
            <div className="card">
                {data &&
                    <EditDataTable
                        dataKey={schema.primaryKey}
                        columns={dataTableColumns}
                        data={data}
                        stateManager={stateManager}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    />
                }
            </div>
        </>
    }
}
