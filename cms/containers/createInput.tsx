import {LookupContainer} from "./LookupContainer";
import {TreeSelectContainer} from "./TreeSelectContainer";
import {XAttr} from "../../types/xEntity";
import {AssetSelector, AssetSelectorProps} from "./AssetSelector";
import {AssetMetadataEditor, AssetMetaDataEditorProps} from "./AssetMetaDataEditor";
import React from "react";
import {toDatetime, toZonelessStr, utcStrToDatetime} from "../types/formatter";
import {CmsComponentConfig} from "../types/cmsComponentConfig";

export function createInput(
    props: {
        column: XAttr,
        data: any,
        id: any,
        control: any,
        register: any,
        uploadUrl: string,
        getFullAssetsURL: (arg: string) => string
        fullRowClassName:string,
        partialRowClassName:string
    },
    config: CmsComponentConfig
) {
    const {field, displayType, options} = props.column
    const ConfiguredMetadataEditor = (props: AssetMetaDataEditorProps) => <AssetMetadataEditor {...props} componentConfig={config}/>
    const ConfiguredAssetSelector = (props: AssetSelectorProps) => <AssetSelector {...props} componentConfig={config}/>


    switch (displayType) {
        case 'dictionary':
            const DictionaryInput = config.inputComponent.dictionary;
            return <DictionaryInput
                className={props.fullRowClassName}
                {...props}
                key={field}/>
        case 'editor':
            const EditorInput = config.inputComponent.editor;
            return <EditorInput
                className={props.fullRowClassName}
                key={field}
                {...props}/>
        case 'textarea':
            const TextAreaInput = config.inputComponent.textarea;
            return <TextAreaInput
                className={props.partialRowClassName}
                key={field}
                {...props}/>
        case 'number':
            const NumberInput = config.inputComponent.number;
            return <NumberInput
                className={props.partialRowClassName}
                key={field}
                {...props}/>
        case 'localDatetime':
            const LocalDatetimeInput = config.inputComponent.datetime;
            return <LocalDatetimeInput
                showTime={true}
                parseDate={utcStrToDatetime}
                formatDate={x=>x}
                className={props.partialRowClassName}
                inline={false}
                key={field}
                {...props}/>
        case 'datetime':
            const DatetimeInput = config.inputComponent.datetime;
            return <DatetimeInput
                className={props.partialRowClassName}
                parseDate={toDatetime}
                formatDate={toZonelessStr}
                showTime={true}
                inline={false}
                key={field}
                {...props}/>
        case 'date':
            const DateInput = config.inputComponent.datetime;
            return <DateInput
                parseDate={toDatetime}
                formatDate={toZonelessStr}
                className={props.partialRowClassName}
                inline={false}
                showTime={false}
                key={field}
                {...props}/>
        case 'image':
            const Image = config.inputComponent.file;
            return <Image
                labels={config.fileInputLabels}
                fileSelector={ConfiguredAssetSelector}
                metadataEditor={ConfiguredMetadataEditor}
                previewImage
                className={props.partialRowClassName}
                key={field}
                {...props} />
        case 'gallery':
            const GalleryInput = config.inputComponent.gallery;
            return <GalleryInput
                labels={config.fileInputLabels}
                fileSelector={ConfiguredAssetSelector}
                metadataEditor={ConfiguredMetadataEditor}
                className={props.partialRowClassName}
                key={field}
                {...props} />
        case 'file':
            const FileInput = config.inputComponent.file;
            return <FileInput
                labels={config.fileInputLabels}
                fileSelector={ConfiguredAssetSelector}
                metadataEditor={ConfiguredMetadataEditor}
                download
                className={props.partialRowClassName}
                key={field}
                {...props} />
        case 'dropdown':
            const DropDownInput = config.inputComponent.dropdown;
            return <DropDownInput
                options={props.column.options.split(',')}
                className={props.partialRowClassName}
                key={field}
                {...props} />
        case 'lookup':
            return <LookupContainer
                className={props.partialRowClassName} key={field}{...props} componentConfig={config}/>
        case 'multiselect':
            const MultiSelectInput = config.inputComponent.multiSelect;
            return <MultiSelectInput
                options={(options ?? '').split(',')}
                className={props.partialRowClassName}
                key={field}
                {...props} />
        case 'treeSelect':
            return <TreeSelectContainer componentConfig={config}
                className={props.partialRowClassName}
                key={field}
                {...props}/>
        default:
            const TextInput = config.inputComponent.text;
            return <TextInput
                className={props.partialRowClassName}
                key={field}
                {...props}/>
    }
}

