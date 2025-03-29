import React from "react";
import {TextInput, TextInputProps} from "./components/inputs/TextInput";
import {fileColumn} from "./components/data/columns/FileColumn";
import {imageColumn} from "./components/data/columns/ImageColumn";
import {textColumn} from "./components/data/columns/TextColumn";
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
import {ProgressSpinner,} from "primereact/progressspinner";
import {Message} from "primereact/message";
import {Toast} from "primereact/toast";

export interface ComponentConfig {
    etc: {
        toast: (ref: any) => React.ReactNode;
        progressSpinner: React.ReactNode;
        errorMessage: (error: string) => React.ReactNode;
    }
    fileInputLabels: {
        upload: string
        choose: string
        edit: string
        delete: string
    }

    dataTableColumns: {
        file: (
            field: string,
            header: string,
            getFullAssetsURL?: (arg: string) => string | undefined
        ) => any
        image: (
            field: string,
            header: string,
            getFullAssetsURL?: (arg: string) => string | undefined
        ) => any
        text: (field: string,
               header: string,
               formater?: (arg: any) => any,
               colType?: 'numeric' | 'date' | 'text',
               onClick?: (rowData: any) => void) => any
    }

    inputComponent: {
        text: React.FC<TextInputProps>
        textarea: React.FC<TextAreaInputProps>
        dictionary: React.FC<DictionaryInputProps>
        dropdown: React.FC<DropDownInputProps>
        editor: React.FC<EditorInputProps>
        number: React.FC<NumberInputProps>
        datetime: React.FC<DatetimeInputProps>
        file: React.FC<FileInputProps>
        multiSelect: React.FC<MultiSelectInputProps>
        gallery: React.FC<GalleryInputProps>
        lookup: React.FC<LookupInputProps>
        treeSelect: React.FC<TreeSelectInputProps>
        treeInput: React.FC<TreeInputProps>
    },
    confirmLabels: {
        accept: string
        reject: string
    },
}


export function getDefaultComponentConfig(): ComponentConfig {
    return {
        etc: {
            toast: (ref: any) => <Toast ref={ref}/>,
            progressSpinner: <ProgressSpinner/>,
            errorMessage: (error: string) => <Message severity={'error'} text={error}/>
        },
        confirmLabels: {
            accept: 'Yes',
            reject: 'No',
        },
        fileInputLabels: {
            upload: 'Up',
            choose: 'Pick',
            edit: 'Mod',
            delete: 'Del',
        },
        inputComponent: {
            treeInput: TreeInput,
            treeSelect: TreeSelectInput,
            lookup: LookupInput,
            gallery: GalleryInput,
            multiSelect: MultiSelectInput,
            file: FileInput,
            datetime: DatetimeInput,
            textarea: TextAreaInput,
            dictionary: DictionaryInput,
            text: TextInput,
            editor: EditorInput,
            dropdown: DropDownInput,
            number: NumberInput,

        },
        dataTableColumns: {
            file: fileColumn,
            image: imageColumn,
            text: textColumn
        },

    }
}