import {Dialog} from "primereact/dialog";
import {createColumn} from "./createColumn";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {FetchingStatus} from "../../components/FetchingStatus";
import {useAssetEntity, useAssets, useGetCmsAssetsUrl} from "../services/asset";
import {SelectButton, SelectButtonChangeEvent} from "primereact/selectbutton";
import {useState} from "react";
import {Asset} from "../types/asset";
import {SelectDataTable} from "../../components/data/SelectDataTable";
import { GalleryView } from "../../components/data/GalleryView";
import { AssetField } from "../types/assetUtils";
import { Button } from "primereact/button";
import { GallerySelector } from "../../components/data/GallerySelector";
import {CmsComponentConfig} from "../cmsComponentConfig";

export type AssetSelectorProps = {
    show: boolean;
    setShow: (show: boolean) => void;
    path?: string;
    setPath?: (path: string) => void;
    paths?: string[];
    setPaths?: (paths: string[]) => void;
};

enum DisplayMode {
    'List' = 'List',
    'Gallery' = 'Gallery',
}

export function AssetSelector(
    {
        show, setShow, path, setPath, paths, setPaths, componentConfig,
    }: AssetSelectorProps &{componentConfig: CmsComponentConfig}
) {
    const {data: schema} = useAssetEntity();
    return schema && <AssetSelectorMain/>

    function AssetSelectorMain(){
        const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.List);
        const columns = schema!.attributes?.filter(column => column.inList) ?? [];
        const stateManager = useDataTableStateManager(AssetField('id'), schema!.defaultPageSize, columns, undefined);
        const {data, error, isLoading} = useAssets(encodeDataTableState(stateManager.state), false);
        const getCmsAssetUrl = useGetCmsAssetsUrl();

        const tableColumns = columns.map(x => createColumn(x,componentConfig, getCmsAssetUrl, undefined));


        const handleSetSelectItems = (item: any) => {
            if (setPath) {
                setPath(item.path);
                setShow(false);
            }

            if (setPaths) {
                setPaths(item.map((x: Asset) => x.path));
            }
        };

        const dialogHeader =  componentConfig.metaDataSelector.dialogHeader;
        const okButtonLabel = componentConfig.metaDataSelector.okButtonLabel;
        const displayModes = [
            {value:DisplayMode.List, label: componentConfig.metaDataSelector.listLabel, icon: 'pi pi-list'},
            {value:DisplayMode.Gallery,label: componentConfig.metaDataSelector.galleryLabel, icon: 'pi pi-image'}
        ];

        return <Dialog maximizable
                       header={dialogHeader}
                       visible={show}
                       style={{width: '80%'}}
                       modal className="p-fluid"
                       onHide={() => setShow(false)}>
            <div className="flex gap-5 justify-between">
                <Button
                    icon={'pi pi-check'}
                    onClick={() => setShow(false)}
                    style={{width: '70px'}}
                    label={okButtonLabel}
                />
                <SelectButton
                    value={displayMode}
                    onChange={(e: SelectButtonChangeEvent) => setDisplayMode(e.value)}
                    options={displayModes}
                />
            </div>

            <FetchingStatus isLoading={isLoading} error={error}/>
            <div className="card">
                {
                    data && columns && displayMode === DisplayMode.List &&
                    <SelectDataTable
                        selectionMode={setPath ? 'single' : 'multiple'}
                        dataKey={AssetField('path')}
                        columns={tableColumns}
                        data={data}
                        stateManager={stateManager}
                        selectedItems={path ? {path} : paths?.map(path => ({path}))}
                        setSelectedItems={handleSetSelectItems}
                    />
                }
                {
                    data && columns && displayMode === DisplayMode.Gallery && setPath &&
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
                    data && columns && displayMode === DisplayMode.Gallery && setPaths &&
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
            </div>
        </Dialog>
    }
}