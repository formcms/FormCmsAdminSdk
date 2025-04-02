import {useNavigate, useParams} from "react-router-dom";
import {deleteItem, updateItem, useItemData, savePublicationSettings} from "../services/entity";
import {Picklist} from "../containers/Picklist";
import {useCheckError} from "../../hooks/useCheckError";
import {createConfirm} from "../../hooks/createConfirm";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {EditTable} from "../containers/EditTable";
import {TreeContainer} from "../containers/TreeContainer";
import {SetPublishStatusDialog} from "../containers/PublishDialog";
import {DefaultAttributeNames} from "../types/defaultAttributeNames";
import {PublicationStatus} from "../types/publicationStatus";
import {SpecialQueryKeys} from "../types/specialQueryKeys";
import {getFileUploadURL, useGetCmsAssetsUrl} from "../services/asset";
import {DefaultColumnNames} from "../types/defaultColumnNames";
import {useState} from "react";
import {getInputAttrs} from "../../types/attrUtils";
import {createInput} from "../containers/createInput";
import {useForm} from "react-hook-form";
import {ArrayToObject} from "../../types/formatter";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {XEntity} from "../../types/xEntity";
import {GeneralComponentConfig} from "../../ComponentConfig";

export interface DataItemPageConfig {
    saveSuccess: string;
    deleteConfirmHeader: string
    deleteConfirm: (s: string) => string;
    deleteSuccess: string;
    unPublishSuccess: string;

    publishSuccess: string;
    publishDialogHeader: string;

    scheduleSuccess: string;
    scheduleDialogHeader: string;

    cancelButtonText: string,
    submitButtonText: string,
    publishAtHeader: string,
}

export function getDefaultDataItemPageConfig(): DataItemPageConfig {
    return {
        saveSuccess: "Save Succeed",
        deleteConfirmHeader: "Confirm",
        deleteConfirm: (s) => `Do you want to delete this item [${s}]?`,
        deleteSuccess: "Delete Succeed",
        unPublishSuccess: "Unpublish Succeed",
        publishSuccess: "Unpublish Succeed",
        publishDialogHeader: "Publish",
        scheduleSuccess: "Schedule Succeed",
        scheduleDialogHeader: "Schedule",

        cancelButtonText: "Cancel",
        submitButtonText: "Save",
        publishAtHeader: "Publish At",
    }
}

export function useDataItemPage(
    componentConfig: CmsComponentConfig & GeneralComponentConfig,
    schema: XEntity,
    baseRouter: string,
    pageConfig: DataItemPageConfig = getDefaultDataItemPageConfig(),
) {
    const {id} = useParams()
    const {data, error, isLoading, mutate} = useItemData(schema.name, id)
    const previewUrl = getPreviewUrl();
    const navigate = useNavigate();

    const formId = "dateItemEditForm" + schema.name;
    const showUnpublish = data && data[DefaultAttributeNames.PublicationStatus] === PublicationStatus.Published ||
        data && data[DefaultAttributeNames.PublicationStatus] === PublicationStatus.Scheduled;
    const deleteProps = useDelete(baseRouter, schema, data);
    const publishProps = usePublish(data, schema, mutate);
    const scheduleProps = useSchedule(data, schema, mutate);
    const unpublishProps = useUnpublish(data, schema, mutate);
    return {
        formId,
        showUnpublish,
        previewUrl,
        handleGoBack,
        deleteProps,
        publishProps,
        scheduleProps,
        unpublishProps,
        DataItemPageMain
    }

    function handleGoBack() {
        const refUrl = new URLSearchParams(location.search).get("ref");
        navigate(refUrl ?? `${baseRouter}/${schema.name}`);
    }

    function getPreviewUrl() {
        if (!schema.previewUrl) return null;
        const connChar = schema.previewUrl.indexOf("?") > 0 ? "&" : "?";
        return `${schema.previewUrl}${id}${connChar}${SpecialQueryKeys.Preview}=1`;
    }

    function DataItemPageMain() {
        const trees = schema.attributes.filter(x => x.displayType == 'tree');
        const inputAttrs = getInputAttrs(schema.attributes);
        const getCmsAssetUrl = useGetCmsAssetsUrl();
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
        const {register, handleSubmit, control} = useForm();

        async function onSubmit(formData: any) {
            formData[schema.primaryKey] = id
            formData[DefaultColumnNames.UpdatedAt] = data[DefaultColumnNames.UpdatedAt];

            schema.attributes.filter(x => x.displayType == 'dictionary').forEach(a => {
                formData[a.field] = ArrayToObject(formData[a.field]);
            });

            const {error} = await updateItem(schema.name, formData)
            await handleErrorOrSuccess(error, pageConfig.saveSuccess, mutate)
        }

        return <>
            <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
            <div><CheckErrorStatus/></div>
            {data && <div className="grid">
                <div className={`col-12 md:col-12 lg:${trees.length > 0 ? "col-9" : "col-12"}`}>
                    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {
                                inputAttrs.map((column) => createInput({
                                    data: data,
                                    column,
                                    register,
                                    control,
                                    id,
                                    uploadUrl: getFileUploadURL(),
                                    getFullAssetsURL: getCmsAssetUrl,
                                    fullRowClassName: 'field col-12',
                                    partialRowClassName: 'field col-12 md:col-4'
                                }, componentConfig))
                            }
                        </div>
                    </form>
                    {
                        (schema?.attributes?.filter(attr =>
                            attr.displayType ==='picklist'
                            || attr.displayType == 'editTable') ?? []).map((column) => {
                            const props = {
                                schema,
                                data,
                                column,
                                getFullAssetsURL: getCmsAssetUrl,
                                baseRouter,
                                inputConfig: componentConfig
                            }
                            if (column.displayType === 'picklist') {
                            }
                            return <div key={column.field}>
                                <hr/>
                                {column.displayType === 'picklist' &&
                                    <Picklist key={column.field} {...props} componentConfig={componentConfig}/>}
                                {column.displayType === 'editTable' &&
                                    <EditTable key={column.field} {...props} componentConfig={componentConfig}/>}
                            </div>
                        })
                    }
                </div>
                {
                    trees.length > 0 && <div className="col-12 md:col-12 lg:col-3">
                        {
                            trees.map((column) => {
                                return <div key={column.field}>
                                    <TreeContainer key={column.field} entity={schema} data={data}
                                                   componentConfig={componentConfig} column={column}></TreeContainer>
                                    <hr/>
                                </div>
                            })
                        }
                    </div>
                }
            </div>
            }
        </>
    }

    function usePublish(data: any, schema: XEntity, mutate: any) {
        const [visible, setVisible] = useState(false);
        const handleShowPublish = () => setVisible(true)
        const PublishDialog = () => data &&
            <SetPublishStatusDialog
                componentConfig={componentConfig}
                header={pageConfig.publishDialogHeader}
                successMessage={pageConfig.publishSuccess}
                publishAtHeader={pageConfig.publishAtHeader}
                cancelButtonText={pageConfig.cancelButtonText}
                submitButtonText={pageConfig.submitButtonText}

                data={data}
                schema={schema}
                visible={visible}
                mutate={mutate}
                newStatus={PublicationStatus.Published}
                setVisible={setVisible}
            />
        return {handleShowPublish, PublishDialog}
    }

    function useSchedule(data: any, schema: XEntity, mutate: any) {
        const [visible, setVisible] = useState(false);
        const handleShowSchedule = () => setVisible(true)
        const ScheduleDialog = () => data &&
            <SetPublishStatusDialog
                componentConfig={componentConfig}
                header={pageConfig.scheduleDialogHeader}
                successMessage={pageConfig.scheduleSuccess}
                publishAtHeader={pageConfig.publishAtHeader}
                cancelButtonText={pageConfig.cancelButtonText}
                submitButtonText={pageConfig.submitButtonText}

                data={data}
                schema={schema}
                visible={visible}
                mutate={mutate}

                newStatus={PublicationStatus.Scheduled}
                setVisible={setVisible}
            />
        return {handleShowSchedule, ScheduleDialog}
    }

    function useUnpublish(data: any, schema: XEntity, mutate: any) {
        const {handleErrorOrSuccess, CheckErrorStatus: CheckUnpublishStatus} = useCheckError(componentConfig);

        async function onUnpublish() {
            const formData: any = {}
            formData[schema.primaryKey] = data[schema.primaryKey];
            formData[DefaultAttributeNames.PublicationStatus] = PublicationStatus.Unpublished;

            const {error} = await savePublicationSettings(schema.name, formData)
            await handleErrorOrSuccess(error, pageConfig.unPublishSuccess, mutate)
        }

        return {onUnpublish, CheckUnpublishStatus}
    }

    function useDelete(baseRouter: string, schema: XEntity, data: any) {
        const refUrl = new URLSearchParams(location.search).get("ref");
        const {confirm, Confirm: ConfirmDelete} = createConfirm(`dataItemPage${schema.name}`, componentConfig);
        const {handleErrorOrSuccess, CheckErrorStatus: CheckDeleteStatus} = useCheckError(componentConfig);

        async function handleDelete() {
            const label = data ? data[schema.labelAttributeName] : "";
            confirm(pageConfig.deleteConfirm(label), pageConfig.deleteConfirmHeader, async () => {
                const {error} = await deleteItem(schema.name, data)
                await handleErrorOrSuccess(error, pageConfig.deleteSuccess, () => {
                    window.location.href = refUrl ?? `${baseRouter}/${schema.name}`
                });
            })
        }

        return {handleDelete, ConfirmDelete, CheckDeleteStatus}
    }
}