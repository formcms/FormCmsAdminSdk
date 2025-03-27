import {DisplayType, XAttr} from "../../components/xEntity";
import {toDateStr, toDatetimeStr, utcStrToDatetimeStr} from "../types/formatter";
import {IComponentConfig} from "../../componentConfig";

const formater :any = {
    [DisplayType.Datetime]: toDatetimeStr,
    [DisplayType.LocalDatetime]: utcStrToDatetimeStr,
    [DisplayType.Date]: toDateStr,
    [DisplayType.Multiselect]: (x:any)=>x.join(','),
    [DisplayType.Dictionary]: (x:any)=> Object.entries(x).map(([k,v])=>(`${k}:${v}`)).join(', ')
}

export function createColumn(
    column: XAttr,
    componentConfig:IComponentConfig,
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
            return componentConfig.dataTableColumns.image({
                field,
                header:column.header,
                getFullAssetsURL:getFullAssetsURL
            });
        case 'file':
            return componentConfig.dataTableColumns.file({
                field:field,
                header:column.header,
                getFullAssetsURL:getFullAssetsURL,
            })
        default:
            return componentConfig.dataTableColumns.text({
                field,
                colType,
                onClick,
                header:column.header,
                formater:formater[column.displayType],
            });
    }
}