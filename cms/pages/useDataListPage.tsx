import {XEntity} from "../types/xEntity";
import {useLocation, useNavigate} from "react-router-dom";
import {useGetCmsAssetsUrl} from "../services/asset";
import {createColumn} from "../containers/createColumn";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {deleteItem, useListData} from "../services/entity";
import {useEffect} from "react";
import {useCheckError} from "../../components/useCheckError";
import {useConfirm} from "../../components/useConfirm";
import {FetchingStatus} from "../../components/FetchingStatus";
import {EditDataTable} from "../../components/data/EditDataTable";
import {NewItemRoute} from "../EntityRouter";
import {getListAttrs} from "../types/attrUtils";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {getDefaultComponentConfig, IComponentConfig} from "../../componentConfig";

interface IDataListPageConfig {
    confirmHeader:string
    deleteConfirm: (label: string) => string;        // Prompt for delete confirmation
    deleteSuccess: (label: string) => string;       // Success message after deletion
}

export function getDefaultDataListPageConfig(){
    return {
        confirmHeader: "Confirm",
        deleteConfirm: (label: string) => `Do you want to delete this item [${label}]?`,
        deleteSuccess: (label: string) => `Delete [${label}] Succeed `
    }
}

export function useDataListPage(
    schema: XEntity,
    baseRouter: string,
    pageConfig: IDataListPageConfig = getDefaultDataListPageConfig(),
    componentConfig: IComponentConfig = getDefaultComponentConfig()
) {
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
        const columns = getListAttrs(schema.attributes);
        const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, initQs);
        const qs = encodeDataTableState(stateManager.state);
        const {data, error, isLoading, mutate} = useListData(schema.name, qs);

        const dataTableColumns = columns.map(x =>
            createColumn(x,componentConfig, getCmsAssetUrl, x.field == schema.labelAttributeName ? onEdit : undefined));

        dataTableColumns.push(<Column key="action"
            body={
                (rowData) => <>
                    <Button icon="pi pi-copy" rounded outlined className="mr-2" onClick={() => onDuplicate(rowData)}/>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => onEdit(rowData)}/>
                    <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(rowData)}/>
                </>

            }
            exportable={false}
            style={{minWidth: '12rem'}}
        />)

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
            const label = rowData[schema.labelAttributeName];
            const deletePrompt = pageConfig.deleteConfirm(label)

            confirm(deletePrompt, pageConfig.confirmHeader,async () => {
                const {error} = await deleteItem(schema.name, rowData);
                const successMessage =  pageConfig.deleteSuccess(label);
                await handleErrorOrSuccess(error, successMessage, mutate);
            });
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
                    />
                }
            </div>
        </>
    }
}