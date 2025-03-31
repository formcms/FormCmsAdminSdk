import {XAttr} from "./xEntity";
import {Formater} from "./formatter";

export function getListAttrs(attrs?: XAttr[]) {
    return attrs?.filter((x) => {
        return x.inList && x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable'
    }) ?? [];
}

export function getInputAttrs(attrs?: XAttr[]) {
    return attrs?.filter((x) => {
        return x.inDetail && !x.isDefault && x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable'
    }) ?? [];
}

export type DateTableColumn = {
    field: string
    header: string
    contentType: 'file' | 'image' | 'text'
    dataType: 'numeric' | 'date' | 'text'
    sortable?: boolean
    filterable?: boolean
    format?: keyof Formater
    onClick?:  ((rowData: any) => void)
}

export function toDataTableColumns(attr: XAttr, onClick?: DateTableColumn['onClick'], locked?:boolean): DateTableColumn {

    const field = attr.displayType == "lookup" || attr.displayType === "treeSelect"
        ? attr.lookup!.name + "." + attr.lookup!.labelAttributeName
        : attr.field;

    let contentType: DateTableColumn['contentType'] = 'text';
    if (attr.displayType == 'image' || attr.displayType == 'gallery') {
        contentType = 'image';
    } else if (attr.displayType == 'file') {
        contentType = 'file';
    }

    let dataType: DateTableColumn['dataType'] = 'text';
    if (attr.displayType == 'number') {
        dataType = 'numeric'
    } else if (attr.displayType == 'date' || attr.displayType == 'datetime' || attr.displayType == 'localDatetime') {
        dataType = 'date'
    }

    let format: DateTableColumn['format'] = 'default';

    return {
        contentType,
        dataType,
        field,
        format,
        header: attr.header,
        onClick,
        sortable: locked !== true,
        filterable: locked !== true,
    }
}