import React from "react";
import {TreeNode} from "../../types/treeNode";

export type DatetimeInputProps = {
    showTime:boolean,
    data: any,
    column: { field: string, header: string },
    register: any
    className: any
    control: any
    id: any
    inline:boolean
    parseDate:(date:string)=>Date
    formatDate:(date:any)=>any
}

export type DictionaryInputProps = {
    data: any;
    column: { field: string; header: string };
    control: any;
    className: any;
    id: any;
    addPairLabel:string
}

export type DropDownInputProps = {
    data: any,
    column: { field: string, header: string },
    options: string[],
    control: any
    className: any
    register: any
    id: any
}

export type EditorInputProps = {
    data: any
    control: any
    column: { field: string, header: string },
    className: any
    register: any
    id: any
}

export type FileInputProps = {
    id: any
    data: any,
    column: { field: string, header: string },
    className: any

    register: any
    control: any

    uploadUrl: any
    getFullAssetsURL: (arg: string) => string

    previewImage?: boolean
    download?: boolean

    fileSelector?: React.ComponentType<{
        show: boolean;
        setShow: (show: boolean) => void;

        path: string;
        setPath: (paths: string) => void;
    }>

    metadataEditor?: React.ComponentType<{
        path:string;
        show: boolean;
        setShow: (show: boolean) => void;
    }>

    labels :{
        upload : string
        choose : string
        edit : string
        delete : string
    }
}

export type GalleryInputProps = {
    data: any,
    column: { field: string, header: string },
    register: any
    className: any
    control: any
    id: any
    uploadUrl: any
    getFullAssetsURL: (arg: string) => string
    fileSelector?: React.ComponentType<{
        show: boolean;
        setShow: (show: boolean) => void

        setPaths: (selectedPath: string[]) => void
        paths: string[]
    }>
    metadataEditor?: React.ComponentType<{
        path: string;
        show: boolean;
        setShow: (show: boolean) => void;
    }>
    labels :{
        upload : string
        choose : string
        edit : string
        delete : string
    }
}

export type LookupInputProps = {
    data: any,
    column: { field: string, header: string },
    idField: string,
    labelField: string,
    control: any,
    className: any
    register: any,
    items: any[]
    id: any
    search: (s: string) => Promise<any[] | undefined>,
    hasMore: boolean,
}

export type MultiSelectInputProps = {
    data: any,
    column: { field: string, header: string },
    options: string[],
    register: any
    className: any
    control: any
    id: any
}

export type NumberInputProps = {
    data: any,
    column: { field: string, header: string },
    register: any
    className:any
    control:any
    id:any
}

export type TextAreaInputProps = {
    data: any,
    column: { field: string, header: string },
    register: any
    className:any
    control:any
    id:any
}

export type TextInputProps = {
    data: any,
    column: { field: string, header: string },
    register: any
    className: any
    control: any
    id: any
}

export type TreeInputProps = {
    nodes: TreeNode[],
    selectedNodeIds: string[],
    handleSelectionChange: (checked:boolean, ids:any[])=>void,
}

export type TreeSelectInputProps = {
    data: any,
    options: any[],
    column: { field: string, header: string },
    register: any
    className: any
    control: any
    id: any
}

