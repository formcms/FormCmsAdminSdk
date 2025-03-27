import {Tree} from "primereact/tree";

export type TreeInputProps = {
    nodes: any,
    selectionKeys: any,
    expandedKeys: any,
    setExpandedKeys: any,
    saveSelectedIds: any,
}

export function TreeInput(
    {
        nodes,
        saveSelectedIds,
        selectionKeys,
        expandedKeys,
        setExpandedKeys
    }: TreeInputProps) {
    return <Tree value={nodes}
              selectionKeys={selectionKeys}
              expandedKeys={expandedKeys}
              selectionMode="checkbox"
              onToggle={(e) => setExpandedKeys(e.value)}
              className="w-full md:w-30rem"
              onSelectionChange={saveSelectedIds}
        />;
}