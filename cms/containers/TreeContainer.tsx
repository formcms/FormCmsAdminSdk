import {XAttr, XEntity} from "../types/xEntity";
import {Tree, TreeCheckboxSelectionKeys, TreeSelectionEvent} from 'primereact/tree';
import {useTree} from "./useTree";
import {deleteJunctionItems, saveJunctionItems, useJunctionIds} from "../services/entity";
import {useEffect, useState} from "react";
import {IComponentConfig} from "../../componentConfig";

function getSelectionKeys(nodes: any[], selectedKeys: any[]) {
    let ret: any = {};
    let root = {key: undefined, children: nodes};
    wfs(root);

    function wfs(current: any) {
        const currentChecked = selectedKeys.includes(current.key);

        //if current not checked, then no need to check children
        if (!current.key || currentChecked) {
            current.children?.forEach((x: any) => wfs(x))
        }

        if (currentChecked) {
            let partial = false;
            for (const c of current.children ?? []) {
                if (!ret[c.key]?.checked) {
                    partial = true;
                    break;
                }
            }
            ret[current.key] = partial ? {partialChecked: true} : {checked: true};
        }
    }

    return ret;
}

function getAdded(testingKeys: TreeCheckboxSelectionKeys, basedKeys: TreeCheckboxSelectionKeys) {
    let ret: any[] = [];
    Object.keys(testingKeys).forEach(testingKey => {
        if (!basedKeys[testingKey]) {
            ret.push(testingKey);
        }
    })
    return ret;
}

export function TreeContainer(
    {
        entity, column, data, componentConfig
    }: {
        entity: XEntity,
        column: XAttr,
        data: any,
        componentConfig: IComponentConfig
    }) {

    const [expandedKeys, setExpandedKeys] = useState<any>();
    const [selectionKeys, setSelectionKeys] = useState<any>();

    const targetEntity = column.junction!;
    const sourceId = data[entity.primaryKey];

    const nodes = useTree(targetEntity);
    const {
        data: selectedIds,
        mutate: mutateSelectedIds
    } = useJunctionIds(entity.name, data[entity.primaryKey], column.field);

    async function saveSelectedIds(e: TreeSelectionEvent) {
        // @ts-ignore
        const checked = e.originalEvent.checked;
        if (checked) {
            const ids = getAdded(e.value as TreeCheckboxSelectionKeys, selectionKeys);
            const items = ids.map(id => ({[targetEntity.primaryKey]: id}));
            await saveJunctionItems(entity.name, sourceId, column.field, items)
        } else {
            const ids = getAdded(selectionKeys, e.value as TreeCheckboxSelectionKeys);
            const items = ids.map(id => ({[targetEntity.primaryKey]: id}));
            await deleteJunctionItems(entity.name, sourceId, column.field, items)
        }
        await mutateSelectedIds();
    }

    useEffect(() => {
        const keys = getSelectionKeys(nodes ?? [], selectedIds ?? []);
        setSelectionKeys(keys);

    }, [selectedIds, nodes]);

    useEffect(() => {
        const keys = nodes?.map(node => node.key.toString())
            .reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
        setExpandedKeys(keys);
    }, [nodes]);

    const Tree = componentConfig.inputComponent.treeInput
    return  <div>
        <Tree nodes={nodes}
              selectionKeys={selectionKeys}
              expandedKeys={expandedKeys}
              setExpandedKeys={selectionKeys}
              saveSelectedIds={saveSelectedIds}
        />
    </div>
}