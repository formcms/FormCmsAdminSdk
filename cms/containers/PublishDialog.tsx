import {useForm} from "react-hook-form"
import {DefaultAttributeNames} from "../types/defaultAttributeNames"
import {useCheckError} from "../../hooks/useCheckError";
import {PublicationStatus} from "../types/publicationStatus";
import {savePublicationSettings} from "../services/entity";
import {XEntity} from "../../types/xEntity";
import {ComponentConfig} from "../../ComponentConfig";
import {utcStrToDatetime} from "../../types/formatter";

export function SetPublishStatusDialog(
    {
        header,successMessage,
        cancelButtonText,submitButtonText, publishAtHeader,
        data, mutate, newStatus,  schema,visible,setVisible,
        componentConfig
    }:
    {
        header: string,
        successMessage: string,
        cancelButtonText: string,
        submitButtonText: string,
        publishAtHeader: string,

        schema:XEntity
        data: any,
        mutate: any,
        newStatus: PublicationStatus,
        visible: boolean,
        setVisible: (visible: boolean) => void,
        componentConfig:ComponentConfig
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
    const Dialog = componentConfig.etc.dialog;
    const Button = componentConfig.etc.button;

    const {handleErrorOrSuccess, CheckErrorStatus: CheckPublishErrorStatus} = useCheckError(componentConfig);
    async function submit(formData: any) {
        formData[schema.primaryKey] = data[schema.primaryKey];
        formData[DefaultAttributeNames.PublicationStatus] = newStatus;
        const {error} = await savePublicationSettings(schema.name, formData)
        await handleErrorOrSuccess(error,successMessage, () => {
            mutate();
        })
    }
    const footer =   <>
        <Button type={'button'} label={cancelButtonText} icon="pi pi-times" outlined onClick={()=>setVisible(false)}/>
        <Button type={'submit'} label={submitButtonText} icon="pi pi-check" form={formId}/>
    </>
    const DateInput = componentConfig.inputComponents.datetime;

    return <Dialog header={header}
                   footer={footer}
                   visible={visible}
                   onHide={()=>setVisible(false)}
                   width={'300px'}
                   modal
                   className="p-fluid">
        <form onSubmit={handleSubmit(submit)} id={formId}>
            <DateInput
                showTime={true}
                formatDate={x=>x}
                parseDate={utcStrToDatetime}
                inline className="col-10" data={formData} column={{
                field: DefaultAttributeNames.PublishedAt,
                header: publishAtHeader,
            }} register={register} control={control} id={'publishedAt'}/>
            <CheckPublishErrorStatus/>
        </form>
    </Dialog>
}