import {useLocation, useNavigate} from "react-router-dom";
import {useGetCmsAssetsUrl} from "../services/asset";
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {deleteItem, useListData} from "../services/entity";
import {useEffect} from "react";
import {useCheckError} from "../../hooks/useCheckError";
import {createConfirm} from "../../hooks/createConfirm";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {NewItemRoute} from "../EntityRouter";
import {getListAttrs, toDataTableColumns} from "../../types/attrUtils";
import {ComponentConfig} from "../../ComponentConfig";
import {XEntity} from "../../types/xEntity";
import {formater} from "../../types/formatter";

export interface DataListPageConfig {
    confirmHeader: string
    deleteConfirm: (label: string) => string;        // Prompt for delete confirmation
    deleteSuccess: (label: string) => string;       // Success message after deletion
}

export function getDefaultDataListPageConfig() {
    return {
        confirmHeader: "Confirm",
        deleteConfirm: (label: string) => `Do you want to delete this item [${label}]?`,
        deleteSuccess: (label: string) => `Delete [${label}] Succeed `
    }
}

export function useDataListPage(
    componentConfig: ComponentConfig,
    schema: XEntity,
    baseRouter: string,
    pageConfig: DataListPageConfig = getDefaultDataListPageConfig(),
) {
    //entrance
    const location = useLocation();
    const initQs = location.search.replace("?", "");
    console.log("initQs", schema.name, initQs);

    //data
    const columns = getListAttrs(schema.attributes);
    const stateManager = useDataTableStateManager(schema.name, schema.primaryKey, schema.defaultPageSize, columns, initQs);
    const qs = encodeDataTableState(stateManager.state);
    const currUrl = `${baseRouter}/${schema.name}?${qs}`;
    const {data, error, isLoading, mutate} = useListData(schema.name, qs);

    const getCmsAssetUrl = useGetCmsAssetsUrl();
    const navigate = useNavigate();
    const LazyDataTable = componentConfig.dataComponents.lazyTable;

    const createNewItem = () => {
        navigate(`${baseRouter}/${schema.name}/${NewItemRoute}?ref=${encodeURIComponent(currUrl)}`);
    }
    return {createNewItem, DataListPageMain}

    function DataListPageMain() {
        const Icon = componentConfig.etc.icon;

        const dataTableColumns = columns.map(x => toDataTableColumns(x, x.field == schema.labelAttributeName ? onEdit : undefined));
        const actionTemplate = (rowData: any) => <>
            <Icon icon={'pi pi-copy'} onClick={() => onDuplicate(rowData)}/>
            <Icon icon={'pi pi-pencil'} onClick={() => onEdit(rowData)}/>
            <Icon icon={'pi pi-trash'} onClick={() => onDelete(rowData)}/>
        </>

        //navigate
        useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

        //components
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
        const {confirm, Confirm} = createConfirm("dataItemPage" + schema.name, componentConfig);

        function onDuplicate(rowData: any) {
            const id = rowData[schema.primaryKey];
            const url = `${baseRouter}/${schema.name}/${NewItemRoute}?sourceId=${id}&ref=${encodeURIComponent(currUrl)}`;
            navigate(url);
        }

        function onEdit(rowData: any) {
            const id = rowData[schema.primaryKey];
            const url = `${baseRouter}/${schema.name}/${id}?ref=${encodeURIComponent(currUrl)}`;
            navigate(url);
        }

        async function onDelete(rowData: any) {
            const label = rowData[schema.labelAttributeName];
            const deletePrompt = pageConfig.deleteConfirm(label)

            confirm(deletePrompt, pageConfig.confirmHeader, async () => {
                const {error} = await deleteItem(schema.name, rowData);
                const successMessage = pageConfig.deleteSuccess(label);
                await handleErrorOrSuccess(error, successMessage, mutate);
            });
        }

        return <>
            <CheckErrorStatus/>
            <Confirm/>
            <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig}/>
            {data &&
                <LazyDataTable
                    formater={formater}
                    getFullAssetsURL={getCmsAssetUrl}
                    dataKey={schema.primaryKey}
                    columns={dataTableColumns}
                    data={data}
                    stateManager={stateManager}
                    actionTemplate={actionTemplate}
                />
            }
        </>
    }
}