import {Route, Routes} from "react-router-dom";
import React from "react";


export const ChangePasswordRoute= "/password";
export const ChangeAvatarRoute= "/avatar";

export interface BaseRouterProps {
    baseRouter:string;
}

interface ProfileRouterProps {
    baseRouter: string;
    ChangePasswordPage: React.FC<BaseRouterProps>;
    SetAvatarPage: React.FC<BaseRouterProps>;
}

export function ProfileRouter(
    {
        baseRouter,
        ChangePasswordPage,
        SetAvatarPage,

    }:ProfileRouterProps) {
    return <Routes>
       <Route path={ChangePasswordRoute} element={<ChangePasswordPage baseRouter={baseRouter}/>}/>
       <Route path={ChangeAvatarRoute} element={<SetAvatarPage baseRouter={baseRouter}/>}/>
    </Routes>
}