import {ListResponse} from "../../types/listResponse";
import {DataTableStateManager} from "../../hooks/useDataTableStateManager";
import {DateTableColumn} from "../../types/attrUtils";
import {Formater} from "../../types/formatter";

export type BasicDataTableProps = {
    pageSize: number;
    data: any[]
    dataKey: string

    tableColumns: {
        field: string;
        header: string;
        body?:any;
    }[]
    actionBodyTemplate?: any
}

export type LazyDataTableProps = {
    dataKey: string;
    data: ListResponse
    stateManager: DataTableStateManager;
    columns: DateTableColumn[];
    formater: Formater;
    actionTemplate?: any
    getFullAssetsURL?: (arg: string) => string | undefined

    selectedItems?: any
    setSelectedItems?: any
    selectionMode?: 'single' | 'multiple' | undefined;
}

export type GallerySelectorProps = {
    state: any
    onPage: any,
    data: {
        items: { [_: string]: any; }[];
        totalRecords: number;
    }

    getAssetUrl: (s: string) => string
    pathField:string
    nameField:string
    titleField:string
    typeField:string

    paths?:string[]|undefined,
    setPaths:(paths:string[]) => void,
}


export type GalleryViewProps = {
    state: any
    onPage: any,
    data: {
        items: { [_: string]: any; }[];
        totalRecords: number;
    }

    getAssetUrl: (s: string) => string
    pathField:string
    nameField:string
    titleField:string
    typeField:string

    path?:string,
    onSelect:(asset:any) => void,
}