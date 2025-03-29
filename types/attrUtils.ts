import {XAttr} from "./xEntity";

export  function getListAttrs(attrs? :XAttr[]){
    return attrs?.filter( (x) =>{
        return x.inList && x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable'
    }) ?? [];
}

export function getInputAttrs(attrs? :XAttr[]){
    return attrs?.filter( (x) =>{
        return x.inDetail && !x.isDefault &&  x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable'
    }) ?? [];
}