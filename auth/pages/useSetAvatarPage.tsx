import {uploadAvatar, useUserInfo} from "../services/auth";
import {useState} from "react";

export function useSetAvatarPage(){
    const [error, setError] = useState('');
    const {data:user, mutate} = useUserInfo();
    async function saveAvatar(file:any){
        setError('');
        const {error} = await uploadAvatar(file)
        if(error){
            setError(error)
        }
        await mutate()
    }
    return {user, saveAvatar, error}
}
