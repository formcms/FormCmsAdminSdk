import {Column} from "primereact/column";
import {createColumn} from "../containers/createColumn";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {EditDataTable} from "../../components/data/EditDataTable";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {FetchingStatus} from "../../components/FetchingStatus";
import {deleteAsset, useAssets, useGetCmsAssetsUrl} from "../services/asset";
import {XEntity} from "../types/xEntity";
import {AssetField} from "../types/assetUtils";
import {useConfirm} from "../../components/useConfirm";
import {useCheckError} from "../../components/useCheckError";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {GalleryView} from "../../components/data/GalleryView";
import {Button} from "primereact/button";
import {getDefaultComponentConfig, IComponentConfig} from "../../componentConfig";

enum DisplayMode {
    'List' = 'List',
    'Gallery' = 'Gallery',
}

export const displayModes: DisplayMode[] = [DisplayMode.List, DisplayMode.Gallery];

interface IAssetListPageConfig {
    deleteConfirmHeader :string
    deleteConfirm: (label?: string) => string;
    deleteSuccess: (label?: string) => string;
    linkCountHeader: string; // For the linkCount column
}

export function getDefaultAssetListPageConfig(): IAssetListPageConfig {
    return ({
        deleteConfirm: (label?: string) => `Do you want to delete this item${label ? ` [${label}]` : ''}?`,
        deleteSuccess: (label?: string) => `Delete${label ? ` [${label}]` : ''} Succeed`,
        linkCountHeader: 'Link Count',
        deleteConfirmHeader:"Confirm"
    });
}

export function useAssetList(
    baseRouter: string,
    schema: XEntity,
    pageConfig: IAssetListPageConfig = getDefaultAssetListPageConfig(),
    componentConfig : IComponentConfig = getDefaultComponentConfig()

) {
    // Entrance
    const location = useLocation();
    const initDisplayMode = new URLSearchParams(location.search).get("displayMode");
    const initQs = location.search.replace("?", "");

    // Data
    const columns = schema?.attributes?.filter(column => column.inList && column.field !== AssetField('linkCount')) ?? [];
    const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, initQs);
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading, mutate} = useAssets(qs, true);

    // State
    const [displayMode, setDisplayMode] = useState<DisplayMode>(initDisplayMode as DisplayMode ?? displayModes[0]);

    // Navigate
    useEffect(() => window.history.replaceState(null, "", `?displayMode=${displayMode}&${qs}`), [stateManager.state, displayMode]);

    // Refs
    const getCmsAssetUrl = useGetCmsAssetsUrl();
    const navigate = useNavigate();
    const {confirm, Confirm} = useConfirm("dataItemPage" + schema.name);
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();


    const onEdit = (rowData: any) => {
        const id = rowData[schema.primaryKey];
        const url = `${baseRouter}/${schema.name}/${id}?ref=${encodeURIComponent(window.location.href)}`;
        navigate(url);
    };

    const canDelete = (rowData: any) => {
        return (rowData[AssetField("linkCount")] ?? 0) === 0;
    };

    const onDelete = async (rowData: any) => {
        confirm(pageConfig.deleteConfirm(rowData[schema.labelAttributeName]),pageConfig.deleteConfirmHeader, async () => {
            const {error} = await deleteAsset(rowData[AssetField('id')]);
            await handleErrorOrSuccess(error, pageConfig.deleteSuccess(rowData[schema.labelAttributeName]), mutate);
        });
    };

    return {displayMode, setDisplayMode, AssetListPageMain};

    function AssetListPageMain() {
        const tableColumns = columns.map(x =>
            createColumn(
                x,
                componentConfig,
                getCmsAssetUrl,
                x.field === AssetField("title") ? onEdit : undefined,
            )
        );
        tableColumns.push(
            <Column
                key={AssetField("linkCount")}
                field={AssetField("linkCount")}
                header={pageConfig.linkCountHeader} // Configurable header
            />
        );

        tableColumns.push(<Column
            body={
                (rowData) => <>
                    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => onEdit(rowData)}/>
                    {canDelete(rowData) && <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => onDelete(rowData)}/>}
                </>
            }
            exportable={false}
            style={{minWidth: '12rem'}}/>)

        return (
            <>
                <CheckErrorStatus key={'AssetList'}/>
                <FetchingStatus isLoading={isLoading} error={error}/>
                <div className="card">
                    {data && columns && displayMode === DisplayMode.List && (
                        <EditDataTable
                            dataKey={schema.primaryKey}
                            columns={tableColumns}
                            data={data}
                            stateManager={stateManager}
                        />
                    )}
                    {data && columns && displayMode === DisplayMode.Gallery && (
                        <GalleryView
                            onSelect={onEdit}
                            state={stateManager.state}
                            onPage={stateManager.handlers.onPage}
                            data={data}
                            getAssetUrl={getCmsAssetUrl}
                            pathField={AssetField('path')}
                            nameField={AssetField('name')}
                            titleField={AssetField('title')}
                            typeField={AssetField('type')}
                        />
                    )}
                </div>
                <Confirm/>
            </>
        );
    }
}