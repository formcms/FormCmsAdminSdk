import {AssetField} from "../types/assetUtils";
import {updateAssetMeta, useAssetEntity, useGetCmsAssetsUrl, useSingleAssetByPath} from "../services/asset";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {useCheckError} from "../../hooks/useCheckError";
import {useForm} from "react-hook-form";
import {createInput} from "./createInput";
import {ArrayToObject, formatFileSize} from "../../types/formatter";
import {getInputAttrs} from "../../types/attrUtils";
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
    const Dialog = componentConfig.etc.dialog;
    const Button = componentConfig.etc.button;
    const Image = componentConfig.etc.image;

    return <Dialog header={componentConfig.assetEditor.dialogHeader}
                   visible={show} width={'750px'}
                   onHide={handleClose}>
        <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig}/>
        <CheckErrorStatus/>
        {data?.type?.startsWith("image") &&
            <div className="card flex justify-content-start">
                <Image src={getCmsAssetUrl(data.path)} width={'700px'}/>
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
        <br/>
        <div style={{width:'100px'}}>
            <Button label={componentConfig.assetEditor.saveButtonLabel} icon={'pi pi-check'} type={"submit"} form={formId}/>
        </div>
        <br/>
        <br/>
        {data && <form onSubmit={handleSubmit(handleSubmitAssetMeta)} id={formId}>
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
                        fullRowClassName: 'field col-12',
                        partialRowClassName: 'field col-12'
                    }, componentConfig))
                }
            </div>
        </form>
        }
    </Dialog>
}