import {XAttr} from "../../types/xEntity";
import {useTree} from "./useTree";
import {ComponentConfig} from "../../componentConfig";

type TreeSelectContainerProps = {
    data: any, column: XAttr, id: any, control: any, register: any, className: string
    componentConfig: ComponentConfig
}

export function TreeSelectContainer(
    {
        data: item, column, id, className, control, register,
        componentConfig
    }: TreeSelectContainerProps
) {

    const targetEntity = column.lookup!
    const options = useTree(targetEntity)
    if (item[column.field] && typeof item[column.field] === "object") {
        item[column.field] = item[column.field][targetEntity.primaryKey];
    }

    const TreeSelectInput = componentConfig.inputComponent.treeSelect;
    return <TreeSelectInput
        options={options ?? []}
        data={item}
        column={column}
        control={control}
        className={className}
        register={register}
        id={id}
    />
}