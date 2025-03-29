import {useRef, useState} from "react";
import {ComponentConfig} from "../componentConfig";

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
            return <>
                <>{componentConfig.etc.toast(toast.current)}</>
                {error&& error.split('\n').map(e =>(<>{componentConfig.etc.errorMessage(e)}&nbsp;&nbsp;</>))}
            </>
        }
    }
}