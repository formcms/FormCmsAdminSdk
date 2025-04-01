import {useNavigate, useParams} from "react-router-dom";
import {getAssetReplaceUrl, updateAssetMeta, useGetCmsAssetsUrl, useSingleAsset, deleteAsset} from "../services/asset";
import {XEntity} from "../../types/xEntity";
import {useForm} from "react-hook-form";
import {createInput} from "../containers/createInput";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {AssetField, AssetLabels, AssetLinkField} from "../types/assetUtils";
import {useState} from "react";
import {useCheckError} from "../../hooks/useCheckError";
import {AssetLink} from "../types/asset";
import {createConfirm} from "../../hooks/createConfirm";
import {ArrayToObject, formatFileSize} from "../../types/formatter";
import {getInputAttrs} from "../../types/attrUtils";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {BasicDataTableProps} from "../../components/data";

export interface AssetEditPageConfig {
    deleteConfirmHeader: string;
    deleteConfirm: (label?: string) => string;
    deleteSuccess: (label?: string) => string;
    saveSuccess: (label?: string) => string;
    usedByLabel :string;
}

export function getDefaultAssetEditPageConfig(): AssetEditPageConfig {
    return {
        deleteConfirmHeader: "Confirm",
        deleteConfirm: (label?: string) => `Do you want to delete this item${label ? ` [${label}]` : ''}?`,
        deleteSuccess: (label?: string) => `Delete${label ? ` [${label}]` : ''} Succeed`,
        saveSuccess: (label?: string) => `Save ${label ? ` [${label}]` : ''} Succeed`,
        usedByLabel: 'Used By',
    };
}

// Main hook for AssetEditPage with unified config
export function useAssetEditPage(
    componentConfig: CmsComponentConfig,
    baseRouter: string,
    schema: XEntity,
    pageConfig: AssetEditPageConfig = getDefaultAssetEditPageConfig(),
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
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const {confirm, Confirm} = createConfirm("dataItemPage" + schema.name, componentConfig);
    const Icon = componentConfig.etc.icon;
    const Image = componentConfig.etc.image;

    const formId = "AssetEdit" + schema.name;
    const BasicDataTable = componentConfig.dataComponents.basicTable;

    function actionBodyTemplate(rowData: AssetLink) {
        return (
            <Icon
                icon="pi pi-eye"
                onClick={() => navigate(`${baseRouter}/${rowData.entityName}/${rowData.recordId}`)}
            />
        );
    }

    let inputs = getInputAttrs(schema.attributes);
    const assetLabels = componentConfig.assetLabels;
    if (assetLabels) {
        inputs = inputs.map(input => {
            return {...input, header: assetLabels[input.field as keyof AssetLabels]};
        })
    }

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
                <Image src={getCmsAssetUrl(data.path + `?version=${version}`)} width="400" />
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
                <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
                <CheckErrorStatus/>
                <Confirm/>
                {
                    data && <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {inputs.map(input => createInput(
                                {
                                    data,
                                    column: input,
                                    register,
                                    control,
                                    id: input.field,
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
        const columns  : BasicDataTableProps['tableColumns'] = [
            {field:AssetLinkField('entityName'),header:componentConfig.assetLinkLabels.entityName,},
            {field:AssetLinkField('recordId'),header:componentConfig.assetLinkLabels.recordId,},
            {field:AssetLinkField('createdAt'),header:componentConfig.assetLinkLabels.createdAt,},
        ];

        return data && (
            <>
                {data.links && <h3>{pageConfig.usedByLabel}</h3>}
                {data.links && <BasicDataTable pageSize={10} data={data.links} dataKey={''} tableColumns={columns} actionBodyTemplate={actionBodyTemplate}/>}
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