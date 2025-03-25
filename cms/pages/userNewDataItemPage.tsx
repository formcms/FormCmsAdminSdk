import {ItemForm} from "../containers/ItemForm";
import {addItem, useItemData} from "../services/entity";
import {useCheckError} from "../../components/useCheckError";
import {DisplayType, XEntity } from "../types/xEntity";
import { getFileUploadURL, useGetCmsAssetsUrl } from "../services/asset";
import { ArrayToObject } from "../../components/inputs/DictionaryInputUtils";

export function userNewDataItemPage(schema:XEntity, baseRouter:string) {
    const formId =  "newDataItemForm" + schema.name;
    return {handleGoBack, formId, NewDataItemPageMain}

    function handleGoBack() {
        const refUrl = new URLSearchParams(location.search).get("ref");
        window.location.href = refUrl ?? `${baseRouter}/${schema.name}`
    }

    function NewDataItemPageMain(){
        //entrance and data
        const id =  new URLSearchParams(location.search).get("sourceId");
        const {data} = useItemData(schema.name, id)


        const getFullAssetsURL = useGetCmsAssetsUrl();
        const uploadUrl = getFileUploadURL()
        const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();

        function inputColumns () {
            return schema?.attributes?.filter(
                x => {
                    return x.inDetail && !x.isDefault && x.displayType != "editTable" && x.displayType != "tree" && x.displayType != 'picklist';
                }
            ) ?? [];
        }

        const onSubmit = async (formData: any) => {
            schema.attributes.filter(x=>x.displayType == DisplayType.Dictionary).forEach(a=>{
                formData[a.field] = ArrayToObject(formData[a.field]);
            });

            const {data, error} = await addItem(schema.name, formData)
            await handleErrorOrSuccess(error, 'Save Succeed', () => {
                window.location.href = `${baseRouter}/${schema.name}/${data[schema.primaryKey]}`;
            })
        }

        return <>
            <CheckErrorStatus/>
            {(!id || data) && <ItemForm columns={inputColumns()} {...{data:data??{} , onSubmit,  formId,uploadUrl,  getFullAssetsURL}}/>}
        </>
    }
}

