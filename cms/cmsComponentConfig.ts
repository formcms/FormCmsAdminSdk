import {getDefaultComponentConfig, IComponentConfig} from "../componentConfig";

export type CmsComponentConfig ={
    metaDataEditor: {
        dialogHeader: string
        saveSuccessMessage: string
        saveButtonLabel: string
    }
    metaDataSelector: {
        dialogHeader: string
        listLabel: string
        galleryLabel: string
        okButtonLabel: string
    }
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
}& IComponentConfig

export function getDefaultCmsComponentConfig():CmsComponentConfig {
    return {
        ...getDefaultComponentConfig(),


        metaDataEditor: {
            dialogHeader: "Edit Metadata",
            saveSuccessMessage: "Metadata saved",
            saveButtonLabel: "Save"
        },
        metaDataSelector: {
            dialogHeader: "Select Asset",
            listLabel: "Select Metadata",
            galleryLabel: "Select Metadata",
            okButtonLabel: "Ok"
        },
        editTable: {
            submitSuccess: (field: string) => `Saved ${field}`,
            dialogHeader: (header: string) => `Edit ${header}`,
            addButtonLabel: (header: string) => `Add ${header}`,
            cancelButtonLabel: "Cancel",
            saveButtonLabel: "Save"
        },
        picklist:{
            deleteButtonLabel: "Delete",
            deleteConfirmationHeader: "Confirm",
            deleteConfirmationMessage: "Do you want to delete these items?",
            deleteSuccessMessage: "Delete Succeed",

            saveSuccessMessage: "Save success",
            cancelButtonLabel: "Cancel",
            saveButtonLabel: "Save",

            dialogHeader:(lbl:string) => `Select ${lbl}`,
            selectButtonLabel:(lbl:string) => `Select ${lbl}`,
        },
    }
}