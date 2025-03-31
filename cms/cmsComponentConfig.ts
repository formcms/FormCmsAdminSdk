import {ComponentConfig} from "../ComponentConfig";
import {AssetLabels} from "./types/assetUtils";

export type CmsComponentConfig ={
    assetEditor: {
        dialogHeader: string
        saveSuccessMessage: string
        saveButtonLabel: string
        fileNameLabel: string
        fileTypeLabel: string
        fileSizeLabel: string
    }
    assetSelector: {
        dialogHeader: string
        listLabel: string
        galleryLabel: string
        okButtonLabel: string
    }
    assetLabels:AssetLabels|null
    editTable: {
        submitSuccess: (field: string) => string;
        dialogHeader: (header: string) => string;
        addButtonLabel: (header: string) => string;
        cancelButtonLabel: string;
        saveButtonLabel: string;
    },
    picklist: {
        deleteButtonLabel: string;
        deleteConfirmationHeader: string;
        deleteConfirmationMessage: string;
        deleteSuccessMessage: string;

        saveSuccessMessage: string;
        cancelButtonLabel: string;
        saveButtonLabel: string;

        dialogHeader: (lbl: string) => string;
        selectButtonLabel:(lbl :string)=> string;
    }
}& ComponentConfig