import {useTreeData} from "../services/entity";
import {XEntity} from "../../types/xEntity";
import {TreeNode} from "../../types/treeNode";

export function useTree(entity: XEntity):TreeNode[] {
    const {data} = useTreeData(entity.name);
    return  (data??[]).map(toNode);

    function toNode(item:any):TreeNode {
        return {
            key:  item[entity.primaryKey].toString(),
            label:item[entity.primaryKey] + " " + item[entity.labelAttributeName],
            children: (item.children??[]).map(toNode)
        };
    }
}