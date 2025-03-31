import {addItem, useItemData} from "../services/entity";
import {useCheckError} from "../../hooks/useCheckError";
import {DisplayType, XEntity} from "../../types/xEntity";
import {getFileUploadURL, useGetCmsAssetsUrl} from "../services/asset";
import {createInput } from "../containers/createInput";
import {getInputAttrs} from "../../types/attrUtils";
import {useForm} from "react-hook-form";
import {ArrayToObject} from "../../types/formatter";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {useNavigate} from "react-router-dom";

export interface NewDataItemPageConfig {
    saveSuccess: (label?: string) => string; // Success message for saving
}

export function getDefaultNewDataItemPageConfig(): NewDataItemPageConfig{
    return {
        saveSuccess: (label?: string) => `Save${label ? ` [${label}]` : ''} Succeed`
    };
}

export function userNewDataItemPage(
    componentConfig: CmsComponentConfig,
    schema: XEntity,
    baseRouter: string,
    pageConfig: NewDataItemPageConfig = getDefaultNewDataItemPageConfig(),
) {
    const formId = "newDataItemForm" + schema.name;
    const {register, handleSubmit, control} = useForm()
    const navigate = useNavigate();

    function handleGoBack() {
        const refUrl = new URLSearchParams(location.search).get("ref");
        navigate(refUrl??`${baseRouter}/${schema.name}`);
    }

    function NewDataItemPageMain() {
        // Entrance and data
        const id = new URLSearchParams(location.search).get("sourceId");
        const {data} = useItemData(schema.name, id);

        const getFullAssetsURL = useGetCmsAssetsUrl();
        const uploadUrl = getFileUploadURL();
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);

        const inputAttrs = getInputAttrs(schema.attributes);

        const handleSaveData = async (formData: any) => {
            schema.attributes.filter(x => x.displayType === DisplayType.Dictionary).forEach(a => {
                formData[a.field] = ArrayToObject(formData[a.field]);
            });

            const {data: savedData, error} = await addItem(schema.name, formData);
            await handleErrorOrSuccess(error, pageConfig.saveSuccess(formData[schema.labelAttributeName]), () => {
                window.location.href = `${baseRouter}/${schema.name}/${savedData[schema.primaryKey]}`;
            });
        };

        return (
            <>
                <CheckErrorStatus/>
                {
                    (!id || data) && <form onSubmit={handleSubmit(handleSaveData)} id={formId}>
                    <div className="formgrid grid">
                        {
                            inputAttrs.map((column: any) => createInput({
                                data: data??{},
                                column,
                                register,
                                control,
                                id,
                                uploadUrl,
                                getFullAssetsURL,
                                fullRowClassName:'field col-12',
                                partialRowClassName:'field col-12 md:col-4'
                            }, componentConfig))
                        }
                    </div>
                </form>
                }
            </>
        );
    }

    return {handleGoBack, formId, NewDataItemPageMain};
}