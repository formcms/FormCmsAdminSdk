import {Route, Routes} from "react-router-dom";
import React from "react";

export const LoginRoute= "/login";
export const RegisterRoute= "/register";

interface AuthRouterProps {
    baseRouter: string;
    LoginPage: React.FC< { baseRouter:string; }>;
    RegisterPage: React.FC< { baseRouter:string; }>;
}
export function AuthRouter(
    {
        baseRouter,
        LoginPage,
        RegisterPage,
    }:AuthRouterProps
) {
    return <Routes>
        <Route path={`${LoginRoute}`} element={<LoginPage baseRouter={baseRouter}/>}/>
        <Route path={`${RegisterRoute}`} element={<RegisterPage baseRouter={baseRouter}/>}/>
        <Route path={`*`} element={<LoginPage baseRouter={baseRouter}/>}/>
    </Routes>
}