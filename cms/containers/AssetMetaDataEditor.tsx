import {Dialog} from "primereact/dialog";
import {AssetField} from "../types/assetUtils";
import {updateAssetMeta, useAssetEntity, useGetCmsAssetsUrl, useSingleAssetByPath} from "../services/asset";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {useCheckError} from "../../hooks/useCheckError";
import {useForm} from "react-hook-form";
import {createInput} from "./createInput";
import {Button} from "primereact/button";
import {Image} from 'primereact/image';
import {ArrayToObject, formatFileSize} from "../types/formatter";
import {getInputAttrs} from "../../types/attrUtils";
import {CmsComponentConfig} from "../types/cmsComponentConfig";

export type AssetMetaDataEditorProps = {
    path: string,
    show: boolean;
    setShow: (show: boolean) => void;
}

export function AssetMetadataEditor(
    {
        path,
        show,
        setShow,
        componentConfig,
    }: AssetMetaDataEditorProps & { componentConfig: CmsComponentConfig }
) {
    //data
    const {data: assetSchema} = useAssetEntity();
    const inputAttrs = getInputAttrs(assetSchema?.attributes);
    const {data, isLoading, error} = useSingleAssetByPath(show ? path : null);

    //ui variables
    const formId = "AssetMetaDataDialog" + assetSchema?.name
    //ref
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const getCmsAssetUrl = useGetCmsAssetsUrl();
    const {register, handleSubmit, control, reset} = useForm()

    function handleClose() {
        reset();
        setShow(false);
    }

    async function handleSubmitAssetMeta(formData: any) {
        const payload = {
            ...formData,
            metadata: ArrayToObject(formData[AssetField('metadata')]),
            id: data?.id,
        };
        const {error} = await updateAssetMeta(payload)
        await handleErrorOrSuccess(error, componentConfig.assetEditor.saveSuccessMessage, () => {
            reset();
            setShow(false);
        })
    }

    return <Dialog maximizable
                   header={componentConfig.assetEditor.dialogHeader}
                   visible={show}
                   style={{width: '700px'}}
                   modal className="p-fluid"
                   onHide={handleClose}>
        <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
        <CheckErrorStatus/>
        {data?.type?.startsWith("image") &&
            <div className="card flex justify-content-start">
                <Image src={getCmsAssetUrl(data.path)}
                       indicatorIcon={<i className="pi pi-search"></i>}
                       alt="Image"
                       preview
                       width="650"></Image>
            </div>
        }
        <br/>
        {data && <div className="mt-2 flex gap-4">
            <label className="block font-bold">{componentConfig.assetEditor.fileNameLabel}</label>
            <label>{data.name}</label>

            <label className="block font-bold">{componentConfig.assetEditor.fileTypeLabel}</label>
            <label className="block">{data.type}</label>

            <label className="block font-bold">{componentConfig.assetEditor.fileSizeLabel}</label>
            <label>{formatFileSize(data.size)}</label>

        </div>}
        {data && <form onSubmit={handleSubmit(handleSubmitAssetMeta)} id={formId}>
            <Button
                label={componentConfig.assetEditor.saveButtonLabel}
                type="submit"
                form={formId}
                style={{width: '100px'}}
                icon="pi pi-check"/>
            <div className="formgrid grid">
                {
                    inputAttrs.map((column: any) => createInput({
                        data,
                        column,
                        register,
                        control,
                        id: column.field,
                        getFullAssetsURL: getCmsAssetUrl,
                        uploadUrl: '',
                        fullRowClassName:'field col-12',
                        partialRowClassName:'field col-12'
                    }, componentConfig))
                }
            </div>
        </form>
        }
    </Dialog>
}