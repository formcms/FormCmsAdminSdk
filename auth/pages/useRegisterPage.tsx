import { useState } from "react";
import { register } from "../services/auth";
import { LoginRoute } from "../AccountRouter";

export interface RegisterPageConfig {
    passwordMismatchError: string;
    registerFailedError: string;
}

export function getDefaultUseRegisterPageConfig(): RegisterPageConfig {
    return {
        passwordMismatchError: "Passwords don't match",
        registerFailedError: "Register failed",
    };
}

export const useRegisterPage = (
    baseRouter: string,
    config: RegisterPageConfig = getDefaultUseRegisterPageConfig()
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