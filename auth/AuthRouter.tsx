import {Route, Routes} from "react-router-dom";
import React from "react";
import {LoginRoute, RegisterRoute} from "./AccountRouter";

export interface BaseRouterProps {
    baseRouter:string;
}
interface AuthRouterProps {
    baseRouter: string;
    LoginPage: React.FC<BaseRouterProps>;
    RegisterPage: React.FC<BaseRouterProps>;
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