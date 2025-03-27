import { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { register } from "../services/auth";
import { LoginRoute } from "../AccountRouter";

// Interface for configuration with no optional properties
interface IUseRegisterPageConfig {
    passwordMismatchError: string;
    registerFailedError: string;
}

function getDefaultUseRegisterPageConfig(): IUseRegisterPageConfig {
    return {
        passwordMismatchError: "Passwords don't match",
        registerFailedError: "Register failed",
    };
}

export const useRegisterPage = (
    baseRouter: string,
    config: IUseRegisterPageConfig = getDefaultUseRegisterPageConfig()
) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    async function handleRegister() {
        if (confirmPassword !== password) {
            setErrors([config.passwordMismatchError]);
            return;
        }
        setErrors([]);
        const { errorDetail: error } = await register({ email, password });
        if (error) {
            if (error.errors) {
                setErrors(Object.values(error.errors).map((x: any) => x[0]));
            } else {
                setErrors([config.registerFailedError]);
            }
        } else {
            setSuccess(true);
        }
    }

    return {
        loginLink: `${baseRouter}${LoginRoute}`,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        success,
        setSuccess,
        errors,
        setErrors,
        handleRegister,
    };
};