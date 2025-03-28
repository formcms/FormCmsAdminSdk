import {Dialog} from "primereact/dialog";
import {AssetField} from "../types/assetUtils";
import {updateAssetMeta, useAssetEntity, useGetCmsAssetsUrl, useSingleAssetByPath} from "../services/asset";
import {FetchingStatus} from "../../components/FetchingStatus";
import {useCheckError} from "../../components/useCheckError";
import {useForm} from "react-hook-form";
import {createInput} from "./createInput";
import {Button} from "primereact/button";
import {Image} from 'primereact/image';
import {ArrayToObject, formatFileSize} from "../types/formatter";
import {getInputAttrs} from "../types/attrUtils";
import {CmsComponentConfig} from "../cmsComponentConfig";

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
        config
    }: AssetMetaDataEditorProps & { config: CmsComponentConfig }
) {
    //data
    const {data: assetSchema} = useAssetEntity();
    const inputAttrs = getInputAttrs(assetSchema?.attributes);
    const {data, isLoading, error} = useSingleAssetByPath(show ? path : null);

    //ui variables
    const formId = "AssetMetaDataDialog" + assetSchema?.name
    //ref
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
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
        await handleErrorOrSuccess(error, config.assetEditor.saveSuccessMessage, () => {
            reset();
            setShow(false);
        })
    }

    return <Dialog maximizable
                   header={config.assetEditor.dialogHeader}
                   visible={show}
                   style={{width: '700px'}}
                   modal className="p-fluid"
                   onHide={handleClose}>
        <FetchingStatus isLoading={isLoading} error={error}/>
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
            <label className="block font-bold">{config.assetEditor.fileNameLabel}</label>
            <label>{data.name}</label>

            <label className="block font-bold">{config.assetEditor.fileTypeLabel}</label>
            <label className="block">{data.type}</label>

            <label className="block font-bold">{config.assetEditor.fileSizeLabel}</label>
            <label>{formatFileSize(data.size)}</label>

        </div>}
        {data && <form onSubmit={handleSubmit(handleSubmitAssetMeta)} id={formId}>
            <Button
                label={config.assetEditor.saveButtonLabel}
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
                    }, config))
                }
            </div>
        </form>
        }
    </Dialog>
}