import  { useState } from 'react';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import {register} from "../services/auth";
import {LoginRoute} from "../AccountRouter";

export const useRegisterPage = ( baseRouter:string ) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleRegister =async () => {
        if (confirmPassword != password){
            setErrors(["passwords don't match"]);
            return;
        }
        setErrors([]);
        // Implement registration logic here
        const {errorDetail:error} = await register({email, password})
        if (error){
            if (error.errors){
                setErrors(Object.values(error.errors).map((x:any)=>x[0]) )
            }else {
                setErrors(["register failed"]);
            }
        }else {
            setSuccess(true);
        }
    };
    return {
        loginLink: `${baseRouter}${LoginRoute}`,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        success, setSuccess,
        errors, setErrors,
        handleRegister,
    }
};