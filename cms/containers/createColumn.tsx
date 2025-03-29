import {DisplayType, XAttr} from "../../types/xEntity";
import {toDateStr, toDatetimeStr, utcStrToDatetimeStr} from "../types/formatter";
import {ComponentConfig} from "../../componentConfig";

const formater :any = {
    [DisplayType.Datetime]: toDatetimeStr,
    [DisplayType.LocalDatetime]: utcStrToDatetimeStr,
    [DisplayType.Date]: toDateStr,
    [DisplayType.Multiselect]: (x:any)=>x.join(','),
    [DisplayType.Dictionary]: (x:any)=> Object.entries(x).map(([k,v])=>(`${k}:${v}`)).join(', ')
}

export function createColumn(
    column: XAttr,
    componentConfig:ComponentConfig,
    getFullAssetsURL?: (arg: string) => string | undefined,
    onClick?: (rowData: any) => void,

) {
    const field = column.displayType == "lookup" || column.displayType === "treeSelect"
        ? column.lookup!.name + "." + column.lookup!.labelAttributeName
        : column.field;

    const colType: 'numeric' | 'date' | 'text' = column.displayType == 'number'
        ? 'numeric'
        : (column.displayType == 'datetime' || column.displayType == 'date' || column.displayType === 'localDatetime')
            ? 'date'
            : 'text';

    switch (column.displayType) {
        case 'image':
        case 'gallery':
            return componentConfig.dataTableColumns.image(
                field,
                column.header,
                getFullAssetsURL
            );
        case 'file':
            return componentConfig.dataTableColumns.file(
                field,
                column.header,
                getFullAssetsURL,
            )
        default:
            return componentConfig.dataTableColumns.text(
                field,
                column.header,
                onClick,
                colType,
                formater[column.displayType],
            );
    }
}