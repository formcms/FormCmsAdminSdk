import {XAttr, XEntity} from "../../types/xEntity";
import {useTree} from "./useTree";
import {deleteJunctionItems, saveJunctionItems, useJunctionIds} from "../services/entity";
import {ComponentConfig} from "../../ComponentConfig";

export function TreeContainer(
    {
        entity, column, data, componentConfig
    }: {
        entity: XEntity,
        column: XAttr,
        data: any,
        componentConfig: ComponentConfig
    }) {


    const targetEntity = column.junction!;
    const sourceId = data[entity.primaryKey];

    const nodes = useTree(targetEntity);
    const {
        data: selectedIds,
        mutate: mutateSelectedIds
    } = useJunctionIds(entity.name, data[entity.primaryKey], column.field);

    async function handleSelectionChange(check: boolean, ids: string[]) {
        const items = ids.map(id => ({[targetEntity.primaryKey]: id}));
        if (check) {
            await saveJunctionItems(entity.name, sourceId, column.field, items)
        } else {
            await deleteJunctionItems(entity.name, sourceId, column.field, items)
        }
        await mutateSelectedIds();
    }

    const Tree = componentConfig.inputComponents.treeInput
    return selectedIds && nodes && <Tree nodes={nodes}
                                         selectedNodeIds={selectedIds.map(x=>x.toString())}
                                         handleSelectionChange={handleSelectionChange}

    />
}