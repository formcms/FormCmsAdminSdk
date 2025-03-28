import React from "react";
import {TextInput, TextInputProps} from "./components/inputs/TextInput";
import {fileColumn, FileColumnProps} from "./components/data/columns/FileColumn";
import {imageColumn, ImageColumnProps} from "./components/data/columns/ImageColumn";
import {textColumn, TextColumnProps} from "./components/data/columns/TextColumn";
import {DictionaryInput, DictionaryInputProps} from "./components/inputs/DictionaryInput";
import {DropDownInput, DropDownInputProps} from "./components/inputs/DropDownInput";
import {EditorInput, EditorInputProps} from "./components/inputs/EditorInput";
import {TextAreaInput, TextAreaInputProps} from "./components/inputs/TextAreaInput";
import {NumberInput, NumberInputProps} from "./components/inputs/NumberInput";
import {DatetimeInput, DatetimeInputProps} from "./components/inputs/DatetimeInput";
import {FileInput, FileInputProps} from "./components/inputs/FileInput";
import {MultiSelectInput, MultiSelectInputProps} from "./components/inputs/MultiSelectInput";
import {GalleryInput, GalleryInputProps} from "./components/inputs/GalleryInput";
import {LookupInput, LookupInputProps} from "./components/inputs/LookupInput";
import {TreeSelectInput, TreeSelectInputProps} from "./components/inputs/TreeSelectInput";
import {TreeInput, TreeInputProps} from "./components/inputs/TreeInput";

export interface IComponentConfig {
    fileInputLabels:{
        upload : string
        choose : string
        edit : string
        delete : string
    }

    dataTableColumns:{
        file:(props:FileColumnProps)=>any
        image:(props:ImageColumnProps)=>any
        text:(props:TextColumnProps)=>any
    }

    inputComponent:{
        text:React.FC<TextInputProps>
        textarea:React.FC<TextAreaInputProps>
        dictionary:React.FC<DictionaryInputProps>
        dropdown:React.FC<DropDownInputProps>
        editor:React.FC<EditorInputProps>
        number:React.FC<NumberInputProps>
        datetime:React.FC<DatetimeInputProps>
        file:React.FC<FileInputProps>
        multiSelect:React.FC<MultiSelectInputProps>
        gallery:React.FC<GalleryInputProps>
        lookup:React.FC<LookupInputProps>
        treeSelect:React.FC<TreeSelectInputProps>
        treeInput:React.FC<TreeInputProps>
    }
}

export function getDefaultComponentConfig():IComponentConfig {
    return {
        fileInputLabels:{
            upload:'Upload',
            choose:'Choose',
            edit:'Edit',
            delete:'Delete',
        },
        inputComponent:{
            treeInput:TreeInput,
            treeSelect:TreeSelectInput,
            lookup:LookupInput,
            gallery:GalleryInput,
            multiSelect:MultiSelectInput,
            file:FileInput,
            datetime:DatetimeInput,
            textarea: TextAreaInput,
            dictionary:DictionaryInput,
            text: TextInput,
            editor:EditorInput,
            dropdown:DropDownInput,
            number:NumberInput,

        },
        dataTableColumns:{
            file:fileColumn,
            image: imageColumn,
            text:textColumn
        },

    }
}