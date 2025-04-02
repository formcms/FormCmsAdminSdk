import { changePassword } from "../services/auth";
import { useState } from "react";

export interface ChangePasswordPageConfig {
    passwordMismatchError: string;
    changePasswordFailedError: string;
}

export function getDefaultUseChangePasswordPageConfig(): ChangePasswordPageConfig {
    return {
        passwordMismatchError: "Passwords don't match",
        changePasswordFailedError: "Change password failed",
    };
}

export function useChangePasswordPage(
    config: ChangePasswordPageConfig = getDefaultUseChangePasswordPageConfig()
) {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);

    async function submit() {
        if (confirmPassword !== password) {
            setErrors([config.passwordMismatchError]);
            return;
        }
        setErrors([]);
        const { error } = await changePassword({ oldPassword, password });
        if (error) {
            if (error) {
                setErrors(error.split("\r\n"));
            } else {
                setErrors([config.changePasswordFailedError]);
            }
        } else {
            setSuccess(true);
        }
    }

    return {
        handleChangePassword: submit,
        oldPassword,
        setOldPassword,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        success,
        setSuccess,
        errors,
        setErrors,
    };
}