import { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useLocation } from "react-router-dom";
import { login, useUserInfo } from "../services/auth";
import { RegisterRoute } from "../AccountRouter";

// Interface for configuration with no optional properties
interface IUseLoginPageConfig {
    loginFailedError: string;
}

function getDefaultUseLoginPageConfig(): IUseLoginPageConfig {
    return {
        loginFailedError: "Login failed",
    };
}

export const useLoginPage = (
    baseRouter: string,
    config: IUseLoginPageConfig = getDefaultUseLoginPageConfig()
) => {
    const location = useLocation();
    const ref = new URLSearchParams(location.search).get("ref");

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState("");
    const { mutate } = useUserInfo();
    const registerLink = `${baseRouter}${RegisterRoute}`;

    async function handleLogin() {
        const res = await login({ email, password });
        if (res.error) {
            setError(config.loginFailedError);
        } else {
            await mutate();
            if (ref) {
                window.location.href = ref;
            }
        }
    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        handleLogin,
        ref,
        registerLink,
    };
};