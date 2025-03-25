import {changePassword} from "../services/auth";
import {useState} from "react";

export function useChangePasswordPage() {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    const submit =async () => {
        if (confirmPassword != password){
            setErrors(["passwords don't match"]);
            return;
        }
        setErrors([]);
        const {error} = await changePassword({oldPassword, password})
        if (error){
            if (error){
                setErrors(error.split('\r\n'));
            }else {
                setErrors(["change password failed"]);
            }
        }else {
            setSuccess(true);
        }
    };
    return {
        handleChangePassword: submit,
        oldPassword, setOldPassword,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        success, setSuccess,
        errors, setErrors
    }

}