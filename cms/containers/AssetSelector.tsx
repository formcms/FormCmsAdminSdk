import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {useAssetEntity, useAssets, useGetCmsAssetsUrl} from "../services/asset";
import {useState} from "react";
import {Asset} from "../types/asset";
import {AssetField} from "../types/assetUtils";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {formater} from "../../types/formatter";
import {toDataTableColumns} from "../../types/attrUtils";
import {GeneralComponentConfig} from "../../ComponentConfig";


export type AssetSelectorProps = {
    show: boolean;
    setShow: (show: boolean) => void;
    path?: string;
    setPath?: (path: string) => void;
    paths?: string[];
    setPaths?: (paths: string[]) => void;
};

export function AssetSelector(
    {
        show, setShow,
        path, setPath,
        paths, setPaths,
        componentConfig,
    }: AssetSelectorProps & { componentConfig: CmsComponentConfig & GeneralComponentConfig },
) {

    const {data: assetSchema} = useAssetEntity();
    const [displayMode, setDisplayMode] = useState<'List' | 'Gallery'>('List');
    const columns = assetSchema?.attributes?.filter(column => column.inList) ?? [];
    const assetLabels = componentConfig.assetLabels
    if (assetLabels) {
        columns.forEach(column => {
            column.header = assetLabels[column.field as keyof typeof assetLabels];
        })
    }

    const stateManager = useDataTableStateManager(assetSchema!.name,AssetField('id'), assetSchema!.defaultPageSize, columns, undefined);
    const {data, error, isLoading} = useAssets(encodeDataTableState(stateManager.state), false);
    const getCmsAssetUrl = useGetCmsAssetsUrl();

    const tableColumns = columns.map(x => toDataTableColumns(x));


    const handleSetSelectItems = (item: any) => {
        if (setPath) {
            setPath(item.path);
            setShow(false);
        }

        if (setPaths) {
            setPaths(item.map((x: Asset) => x.path));
        }
    };

    const dialogHeader = componentConfig.assetSelector.dialogHeader;
    const okButtonLabel = componentConfig.assetSelector.okButtonLabel;
    const displayModes = [
        {value: 'List', label: componentConfig.assetSelector.listLabel, icon: 'pi pi-list'},
        {value: 'Gallery', label: componentConfig.assetSelector.galleryLabel, icon: 'pi pi-image'}
    ];
    const LazyDataTable = componentConfig.dataComponents.lazyTable;
    const Dialog = componentConfig.etc.dialog;
    const Button = componentConfig.etc.button;
    const GalleryView = componentConfig.dataComponents.galleryView;
    const GallerySelector = componentConfig.dataComponents.gallerySelector;
    const SelectButton = componentConfig.etc.selectButton;

    return <Dialog maximizable
                   header={dialogHeader}
                   visible={show}
                   width={'80%'}
                   modal
                   className="p-fluid"
                   onHide={() => setShow(false)}>
        <div className="flex gap-5 justify-between">
            <div><Button label={okButtonLabel} icon={'pi pi-check'} type={'button'} onClick={() => setShow(false)}/>
            </div>
            <SelectButton
                value={displayMode}
                onChange={(value) => setDisplayMode(value)}
                options={displayModes}
            />
        </div>

        <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig}/>
        {
            data && columns && displayMode === 'List' &&
            <LazyDataTable
                getFullAssetsURL={getCmsAssetUrl}
                selectionMode={setPath ? 'single' : 'multiple'}
                dataKey={AssetField('path')}
                columns={tableColumns}
                data={data}
                stateManager={stateManager}
                selectedItems={path ? {path} : paths?.map(path => ({path}))}
                setSelectedItems={handleSetSelectItems}
                formater={formater}
            />
        }
        {
            data && columns && displayMode === 'Gallery' && setPath &&
            <GalleryView
                state={stateManager.state}
                onPage={stateManager.handlers.onPage}
                data={data}
                path={path}
                onSelect={(asset: any) => handleSetSelectItems(asset)}
                getAssetUrl={getCmsAssetUrl}
                nameField={AssetField('name')}
                pathField={AssetField('path')}
                titleField={AssetField('title')}
                typeField={AssetField('type')}
            />
        }
        {
            data && columns && displayMode === 'Gallery' && setPaths &&
            <GallerySelector
                paths={paths}
                setPaths={setPaths}
                state={stateManager.state}
                onPage={stateManager.handlers.onPage}
                data={data}
                getAssetUrl={getCmsAssetUrl}
                nameField={AssetField('name')}
                pathField={AssetField('path')}
                titleField={AssetField('title')}
                typeField={AssetField('type')}
            />
        }
    </Dialog>
}