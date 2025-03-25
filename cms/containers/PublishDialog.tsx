import {useForm} from "react-hook-form"
import {DefaultAttributeNames} from "../types/defaultAttributeNames"
import {LocalDatetimeInput} from "../../components/inputs/LocalDatetimeInput";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {useCheckError} from "../../components/useCheckError";
import {PublicationStatus} from "../types/publicationStatus";
import {savePublicationSettings} from "../services/entity";
import {XEntity} from "../types/xEntity";

export function SetPublishStatusDialog(
    {
        data, mutate, newStatus,  schema,visible,setVisible
    }:
    {
        schema:XEntity
        data: any,
        mutate: any,
        newStatus: PublicationStatus,
        visible: boolean,
        setVisible: (visible: boolean) => void,
    }
) {
    const {
        register,
        handleSubmit,
        control
    } = useForm()

    //make a copy, don't want to mutate data
    const publishedAt = data[DefaultAttributeNames.PublishedAt] ?? new Date();
    const formData = {[DefaultAttributeNames.PublishedAt]: publishedAt}
    const formId = "PublicationSettings" + newStatus;
    const header = newStatus == PublicationStatus.Published ? "Publish" : "Schedule";

    const {handleErrorOrSuccess, CheckErrorStatus: CheckPublishErrorStatus} = useCheckError();
    async function submit(formData: any) {
        formData[schema.primaryKey] = data[schema.primaryKey];
        formData[DefaultAttributeNames.PublicationStatus] = newStatus;
        const {error} = await savePublicationSettings(schema.name, formData)
        await handleErrorOrSuccess(error, 'Publish Succeed', () => {
            mutate();
        })
    }
    const footer =   <>
        <Button label="Cancel" icon="pi pi-times" outlined onClick={()=>setVisible(false)}/>
        <Button type={'submit'} label={"Submit"} icon="pi pi-check" form={formId}/>
    </>
    return <Dialog header={header}
                   footer={footer}
                   visible={visible}
                   onHide={()=>setVisible(false)}
                   style={{width: '300px'}}
                   modal
                   className="p-fluid">
        <form onSubmit={handleSubmit(submit)} id={formId}>
            <LocalDatetimeInput inline className="col-10" data={formData} column={{
                field: DefaultAttributeNames.PublishedAt,
                header: "Published at",
            }} register={register} control={control} id={'publishedAt'}/>
            <CheckPublishErrorStatus/>
        </form>
    </Dialog>
}