import {confirmDialog, ConfirmDialog} from "primereact/confirmdialog";

export function useConfirm(id:any){
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
                <ConfirmDialog key={id} id={id} tagKey={id}/>
            </>
        }
    }
}