import {useNavigate, useParams} from "react-router-dom";
import {getAssetReplaceUrl, updateAssetMeta, useGetCmsAssetsUrl, useSingleAsset, deleteAsset} from "../services/asset";
import {XEntity} from "../types/xEntity";
import {useForm} from "react-hook-form";
import {createInput} from "../containers/createInput";
import {Button} from "primereact/button";
import {FetchingStatus} from "../../components/FetchingStatus";
import {Image} from 'primereact/image';
import {AssetField, AssetLinkField} from "../types/assetUtils";
import {useState} from "react";
import {useCheckError} from "../../components/useCheckError";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {AssetLink} from "../types/asset";
import {useConfirm} from "../../components/useConfirm";
import {ArrayToObject, formatFileSize} from "../types/formatter";
import {getInputAttrs} from "../types/attrUtils";
import {CmsComponentConfig, getDefaultCmsComponentConfig} from "../cmsComponentConfig";

interface IAssetEditPageConfig {
    deleteConfirmHeader: string;
    deleteConfirm: (label?: string) => string;
    deleteSuccess: (label?: string) => string;
    saveSuccess: (label?: string) => string;
    assetLinksTitle: string
    assetLinksTableHeaderEntityName: string;
    assetLinksTableHeaderRecordId: string;
    assetLinksTableHeaderCreatedAt: string;
}

export function getDefaultAssetEditPageConfig(): IAssetEditPageConfig {
    return {
        deleteConfirmHeader: "Confirm",
        deleteConfirm: (label?: string) => `Do you want to delete this item${label ? ` [${label}]` : ''}?`,
        deleteSuccess: (label?: string) => `Delete${label ? ` [${label}]` : ''} Succeed`,
        saveSuccess: (label?: string) => `Save ${label ? ` [${label}]` : ''} Succeed`,
        assetLinksTitle: 'Used By:',
        assetLinksTableHeaderEntityName: 'Entity Name',
        assetLinksTableHeaderRecordId: 'Record Id',
        assetLinksTableHeaderCreatedAt: 'Created At'
    };
}

// Main hook for AssetEditPage with unified config
export function useAssetEditPage(
    baseRouter: string,
    schema: XEntity,
    pageConfig: IAssetEditPageConfig = getDefaultAssetEditPageConfig(),
    componentConfig: CmsComponentConfig = getDefaultCmsComponentConfig(),
) {
    // Entrance
    const {id} = useParams();
    const refUrl = new URLSearchParams(location.search).get("ref");

    // Data
    const {data, isLoading, error, mutate} = useSingleAsset(id);

    // State
    const [version, setVersion] = useState(1);

    // Refs
    const navigate = useNavigate();
    const getCmsAssetUrl = useGetCmsAssetsUrl();
    const {register, handleSubmit, control} = useForm();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const {confirm, Confirm} = useConfirm("dataItemPage" + schema.name);

    const formId = "AssetEdit" + schema.name;

    function actionBodyTemplate(rowData: AssetLink) {
        return (
            <Button
                icon="pi pi-eye"
                rounded
                outlined
                className="mr-2"
                onClick={() => navigate(`${baseRouter}/${rowData.entityName}/${rowData.recordId}`)}
            />
        );
    }

    const inputs = getInputAttrs(schema.attributes);

    async function onSubmit(formData: any) {
        const payload = {
            ...formData,
            metadata: ArrayToObject(formData[AssetField('metadata')]),
            id: data?.id,
        };
        const {error} = await updateAssetMeta(payload);
        await handleErrorOrSuccess(error, pageConfig.saveSuccess(data?.name), mutate);
    }

    function handleDownload() {
        if (data && data.path) {
            const url = getCmsAssetUrl(data.path);
            const link = document.createElement('a');
            link.href = url;
            link.download = data.name || 'asset'; // Fallback to 'asset' if name is not available
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    async function handleDelete() {
        data && confirm(pageConfig.deleteConfirm(data.name), pageConfig.deleteConfirmHeader, async () => {
            const {error} = await deleteAsset(data.id);
            await handleErrorOrSuccess(error, pageConfig.deleteSuccess(data.name), () => {
                window.location.href = refUrl ?? `${baseRouter}/${schema.name}`;
            });
        });
    }

    function FeaturedImage() {
        return data?.type?.startsWith("image") && (
            <div className="card flex justify-content-start">
                <Image
                    src={getCmsAssetUrl(data.path + `?version=${version}`)}
                    indicatorIcon={<i className="pi pi-search"></i>}
                    alt="Image"
                    preview
                    width="400"
                />
            </div>
        );
    }

    async function handleUpload() {
        setVersion(x => x + 1);
        await mutate();
    }

    const replaceAssetUrl = getAssetReplaceUrl(data?.id ?? 0);

    function MetaDataForm() {
        return (
            <>
                <FetchingStatus isLoading={isLoading} error={error}/>
                <CheckErrorStatus/>
                <Confirm/>
                {
                    data && <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {inputs.map(column => createInput(
                                {
                                    data,
                                    column,
                                    register,
                                    control,
                                    id: column.field,
                                    getFullAssetsURL: getCmsAssetUrl,
                                    uploadUrl: '',
                                    fullRowClassName: 'field col-12',
                                    partialRowClassName: 'field col-12 md:col-4'
                                },
                                componentConfig
                            ))}
                        </div>
                    </form>
                }
            </>
        );
    }

    function AssetLinks() {
        return data && (
            <>
                {data.links && <h3>{pageConfig.assetLinksTitle}</h3>}
                {data.links && (
                    <DataTable value={data.links} tableStyle={{minWidth: '50rem'}}>
                        <Column field={AssetLinkField('entityName')}
                                header={pageConfig.assetLinksTableHeaderEntityName}></Column>
                        <Column field={AssetLinkField('recordId')}
                                header={pageConfig.assetLinksTableHeaderRecordId}></Column>
                        <Column field={AssetLinkField('createdAt')}
                                header={pageConfig.assetLinksTableHeaderCreatedAt}></Column>
                        <Column body={actionBodyTemplate} style={{minWidth: '12rem'}}></Column>
                    </DataTable>
                )}
            </>
        );
    }

    return {
        asset: {...data ?? {}, size: formatFileSize(data?.size)},
        formId,
        replaceAssetUrl,
        handleDownload,
        handleUpload,
        handleDelete,
        FeaturedImage,
        AssetLinkTable: AssetLinks,
        MetaDataForm
    };
}