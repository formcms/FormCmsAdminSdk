import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";
import {ComponentConfig} from "../componentConfig";

export function useConfirm(id:any, componentConfig:ComponentConfig){
    return {
        confirm:(message :any, header:any, accept:any) =>{
            confirmDialog({
                tagKey:id,
                message: message,
                header: header,
                icon: 'pi pi-exclamation-triangle',
                accept,
            });
        },
        Confirm: ()=>{
            return <>
                <ConfirmDialog rejectLabel={componentConfig.confirmLabels.reject} acceptLabel={componentConfig.confirmLabels.accept} key={id} id={id} tagKey={id}></ConfirmDialog>
            </>
        }
    }
}