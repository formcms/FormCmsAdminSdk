import {useRef, useState} from "react";
import {ComponentConfig} from "../ComponentConfig";

export function useCheckError(componentConfig: ComponentConfig) {
    const toast = useRef<any>(null);
    const [error, setError] = useState('')
    return {
        handleErrorOrSuccess : async (error :string, succeedMessage:string, cb:any) =>{
            if (error){
                setError(error)
            }else {
                toast.current.show({severity: 'success', summary:succeedMessage})
                if (cb) {
                    await new Promise(r => setTimeout(r, 500));
                    cb();
                }
            }
        },
        CheckErrorStatus: ()=>{
            const Message = componentConfig.etc.message;
            const Toast = componentConfig.etc.toast;
            return <>
                <Toast ref={toast}/>
                {error&& error.split('\n').map(e =>(<><Message text={e} severity={'error'}/>&nbsp;&nbsp;</>))}
            </>
        }
    }
}