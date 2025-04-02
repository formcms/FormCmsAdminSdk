import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {deleteAsset, useAssets, useGetCmsAssetsUrl} from "../services/asset";
import {XEntity} from "../../types/xEntity";
import {AssetField} from "../types/assetUtils";
import {createConfirm} from "../../hooks/createConfirm";
import {useCheckError} from "../../hooks/useCheckError";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {toDataTableColumns} from "../../types/attrUtils";
import {formater} from "../../types/formatter";
import {GeneralComponentConfig} from "../../ComponentConfig";

const displayModeLabels = {
    list: 'List',
    gallery: 'gallery'
}

displayModeLabels['list'] = 'list';

export type AssetListPageConfig = {
    deleteConfirmHeader: string
    deleteConfirm: (label: string) => string;
    deleteSuccess: (label: string) => string;
    displayModeLabels: {
        list: string
        gallery: string
    }
}

export function getDefaultAssetListPageConfig(): AssetListPageConfig {
    return ({
        deleteConfirm: (label?: string) => `Do you want to delete this item [${label}] ?`,
        deleteSuccess: (label?: string) => `Delete [${label}] Succeed`,
        deleteConfirmHeader: "Confirm",
        displayModeLabels: {
            list: 'List',
            gallery: 'gallery'
        }
    });
}

export function useAssetListPage(
    componentConfig: CmsComponentConfig & GeneralComponentConfig,
    baseRouter: string,
    schema: XEntity,
    pageConfig: AssetListPageConfig = getDefaultAssetListPageConfig()
) {
    // Entrance
    const location = useLocation();
    let initDisplayMode = new URLSearchParams(location.search).get("displayMode");
    const initQs = location.search.replace("?", "");

    // Data
    const columns = schema?.attributes
        ?.filter(column => column.inList && column.field !== AssetField('linkCount')) ?? [];
    const stateManager = useDataTableStateManager(schema.name,schema.primaryKey, schema.defaultPageSize, columns, initQs);
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading, mutate} = useAssets(qs, true);

    const assetLabels = componentConfig.assetLabels;
    if (assetLabels) {
        columns.forEach(column => {
            column.header = assetLabels[column.field as keyof typeof assetLabels];
        })
    }

    //apply config
    const displayModeOptions: { label: string, value: 'List' | 'Gallery' }[] = [
        {
            value: 'List',
            label: pageConfig.displayModeLabels.list,
        },

        {
            value: 'Gallery',
            label: pageConfig.displayModeLabels.gallery,
        }
    ];

    if (initDisplayMode !== 'List' && initDisplayMode !== 'Gallery') {
        initDisplayMode = displayModeOptions[0].value;
    }
    const [displayMode, setDisplayMode] = useState<'List' | 'Gallery'>(initDisplayMode as any);

    // Navigate
    useEffect(() => window.history.replaceState(null, "", `?displayMode=${displayMode}&${qs}`), [stateManager.state, displayMode]);

    // Refs
    const getCmsAssetUrl = useGetCmsAssetsUrl();
    const navigate = useNavigate();
    const {confirm, Confirm} = createConfirm("dataItemPage" + schema.name, componentConfig);
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const LazyDataTable = componentConfig.dataComponents.lazyTable;
    const Icon = componentConfig.etc.icon;
    const GalleryView = componentConfig.dataComponents.galleryView;


    const onEdit = (rowData: any) => {
        const id = rowData[schema.primaryKey];
        const url = `${baseRouter}/${schema.name}/${id}?ref=${encodeURIComponent(`${baseRouter}/${schema.name}?displayMode=${displayMode}&${qs}`)}`;
        navigate(url);
    };

    const canDelete = (rowData: any) => {
        return (rowData[AssetField("linkCount")] ?? 0) === 0;
    };

    const onDelete = async (rowData: any) => {
        confirm(pageConfig.deleteConfirm(rowData[schema.labelAttributeName]), pageConfig.deleteConfirmHeader, async () => {
            const {error} = await deleteAsset(rowData[AssetField('id')]);
            await handleErrorOrSuccess(error, pageConfig.deleteSuccess(rowData[schema.labelAttributeName]), mutate);
        });
    };

    return {displayMode, displayModeOptions, setDisplayMode, AssetListPageMain};

    function AssetListPageMain() {
        const tableColumns = columns.map(x =>
            toDataTableColumns(x, x.field === AssetField("title") ? onEdit : undefined, x.field === AssetField("linkCount"))
        );

        const actionTemplate = (rowData: any) => <>
            <Icon icon={'pi pi-pencil'} onClick={()=>onEdit(rowData)}/>
            {canDelete(rowData) &&<Icon icon={'pi pi-trash'} onClick={()=>onDelete(rowData)}/>}
        </>
        return (
            <>
                <CheckErrorStatus key={'AssetList'}/>
                <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig}/>
                <div className="card">
                    {data && columns && displayMode === 'List' && (
                        <LazyDataTable
                            dataKey={schema.primaryKey}
                            columns={tableColumns}
                            data={data}
                            stateManager={stateManager}
                            formater={formater}
                            actionTemplate={actionTemplate}
                            getFullAssetsURL={getCmsAssetUrl}
                        />
                    )}
                    {data && columns && displayMode === 'Gallery' && (
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