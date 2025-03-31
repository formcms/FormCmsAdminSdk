import React from "react";
import {
    ButtonProps, ConfirmDialogProps,
    DialogProps,
    IconProps,
    ImageProps,
    MessageProps,
    SelectButtonProps,
    ToastProps,
    UploadProps
} from './components/etc'
import {
    DatetimeInputProps,
    DictionaryInputProps,
    DropDownInputProps,
    EditorInputProps,
    FileInputProps,
    GalleryInputProps,
    LookupInputProps,
    MultiSelectInputProps,
    NumberInputProps,
    TextAreaInputProps,
    TextInputProps, TreeInputProps, TreeSelectInputProps
} from './components/inputs'

import {
    BasicDataTableProps,
    LazyDataTableProps,
    GallerySelectorProps,
    GalleryViewProps
} from './components/data'

export interface ComponentConfig {
    etc: {
        confirm: (message:string, header: string, tagKey:string, accept:any)=> void
        confirmDialog: React.ComponentType<ConfirmDialogProps>;
        button: React.FC<ButtonProps>;
        icon: React.FC<IconProps>;
        image: React.FC<ImageProps>;
        toast: React.FC<ToastProps>;
        spinner: React.FC;
        message: React.FC<MessageProps>;
        dialog: React.FC<DialogProps>;
        upload: React.FC<UploadProps>;
        selectButton: React.FC<SelectButtonProps>;
    }
    fileInputLabels: {
        upload: string
        choose: string
        edit: string
        delete: string
    }

    dataComponents: {
        lazyTable: React.FC<LazyDataTableProps>;
        basicTable: React.FC<BasicDataTableProps>;
        gallerySelector: React.FC<GallerySelectorProps>;
        galleryView: React.FC<GalleryViewProps>;
    }
    inputComponents: {
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