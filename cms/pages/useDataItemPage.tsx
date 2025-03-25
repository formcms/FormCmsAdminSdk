import {useParams} from "react-router-dom";
import {ItemForm} from "../containers/ItemForm";
import {deleteItem, updateItem, useItemData, savePublicationSettings} from "../services/entity";
import {Divider} from "primereact/divider";
import {Picklist} from "../containers/Picklist";
import {useCheckError} from "../../components/useCheckError";
import {useConfirm} from "../../components/useConfirm";
import {FetchingStatus} from "../../components/FetchingStatus";
import {EditTable} from "../containers/EditTable";
import {TreeContainer} from "../containers/TreeContainer";
import {DisplayType, XEntity} from "../types/xEntity";
import {SetPublishStatusDialog} from "../containers/PublishDialog";
import {DefaultAttributeNames} from "../types/defaultAttributeNames";
import {PublicationStatus} from "../types/publicationStatus";
import {SpecialQueryKeys} from "../types/specialQueryKeys";
import {getFileUploadURL, useGetCmsAssetsUrl} from "../services/asset";
import {DefaultColumnNames} from "../types/defaultColumnNames";
import {ArrayToObject} from "../../components/inputs/DictionaryInputUtils";
import {useState} from "react";

export function useDataItemPage(schema: XEntity, baseRouter: string) {
    //entrance
    const {id} = useParams()
    const {data, error, isLoading, mutate} = useItemData(schema.name, id)
    const previewUrl = getPreviewUrl();

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
        window.location.href = refUrl ?? `${baseRouter}/${schema.name}`
    }

    function getPreviewUrl() {
        if (!schema.previewUrl) return null;
        const connChar = schema.previewUrl.indexOf("?") > 0 ? "&" : "?";
        return `${schema.previewUrl}${id}${connChar}${SpecialQueryKeys.Preview}=1`;
    }

    function DataItemPageMain() {
        const trees = schema.attributes.filter(x => x.displayType == DisplayType.Tree);

        //variable and state
        //references
        const getCmsAssetUrl = useGetCmsAssetsUrl();
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();

        function inputColumns() {
            return schema?.attributes?.filter(
                (x) => {
                    return x.inDetail && !x.isDefault && x.displayType != 'picklist' && x.displayType != "tree" && x.displayType != 'editTable'
                }
            ) ?? [];
        }

        async function onSubmit(formData: any) {
            formData[schema.primaryKey] = id
            formData[DefaultColumnNames.UpdatedAt] = data[DefaultColumnNames.UpdatedAt];

            schema.attributes.filter(x => x.displayType == DisplayType.Dictionary).forEach(a => {
                formData[a.field] = ArrayToObject(formData[a.field]);
            });

            const {error} = await updateItem(schema.name, formData)
            await handleErrorOrSuccess(error, 'Save Succeed', mutate)
        }

        return <>
            <FetchingStatus isLoading={isLoading} error={error}/>
            <div><CheckErrorStatus/></div>
            {data && <div className="grid">
                <div className={`col-12 md:col-12 lg:${trees.length > 0 ? "col-9" : "col-12"}`}>
                    <ItemForm uploadUrl={getFileUploadURL()} formId={formId} columns={inputColumns()} {...{
                        schema,
                        data,
                        id,
                        onSubmit,
                        getFullAssetsURL: getCmsAssetUrl
                    }} />
                    {
                        (schema?.attributes?.filter(attr =>
                            attr.displayType === DisplayType.Picklist
                            || attr.displayType == DisplayType.EditTable) ?? []).map((column) => {
                            const props = {schema, data, column, getFullAssetsURL: getCmsAssetUrl, baseRouter}
                            return <div key={column.field}>
                                <Divider/>
                                {column.displayType === 'picklist' && <Picklist key={column.field} {...props}/>}
                                {column.displayType === 'editTable' && <EditTable key={column.field} {...props}/>}
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
                                                   column={column}></TreeContainer>
                                    <Divider/>
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
            <SetPublishStatusDialog data={data} schema={schema} visible={visible} mutate={mutate}
                                    newStatus={PublicationStatus.Published}
                                    setVisible={setVisible}/>
        return {handleShowPublish, PublishDialog}
    }

    function useSchedule(data: any, schema: XEntity, mutate: any) {
        const [visible, setVisible] = useState(false);
        const handleShowSchedule = () => setVisible(true)
        const ScheduleDialog = () => data &&
            <SetPublishStatusDialog data={data} schema={schema} visible={visible} mutate={mutate}
                                    newStatus={PublicationStatus.Scheduled}
                                    setVisible={setVisible}/>
        return {handleShowSchedule, ScheduleDialog}
    }

    function useUnpublish(data: any, schema: XEntity, mutate: any) {
        const {handleErrorOrSuccess, CheckErrorStatus: CheckUnpublishStatus} = useCheckError();

        async function onUnpublish() {
            const formData: any = {}
            formData[schema.primaryKey] = data[schema.primaryKey];
            formData[DefaultAttributeNames.PublicationStatus] = PublicationStatus.Unpublished;

            const {error} = await savePublicationSettings(schema.name, formData)
            await handleErrorOrSuccess(error, 'Publish Succeed', mutate)
        }

        return {onUnpublish, CheckUnpublishStatus}
    }

    function useDelete(baseRouter: string, schema: XEntity, data: any) {
        const refUrl = new URLSearchParams(location.search).get("ref");
        const {confirm, Confirm: ConfirmDelete} = useConfirm("dataItemPage" + schema.name);
        const {handleErrorOrSuccess, CheckErrorStatus: CheckDeleteStatus} = useCheckError();

        async function handleDelete() {
            confirm('Do you want to delete this item?', async () => {
                const {error} = await deleteItem(schema.name, data)
                await handleErrorOrSuccess(error, 'Delete Succeed', () => {
                    window.location.href = refUrl ?? `${baseRouter}/${schema.name}`
                });
            })
        }

        return {handleDelete, ConfirmDelete, CheckDeleteStatus}
    }
}