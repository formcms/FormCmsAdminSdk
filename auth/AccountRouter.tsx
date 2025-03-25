import {Route, Routes} from "react-router-dom";
import React from "react";

export const LoginRoute= "/login";
export const RegisterRoute= "/register";

export const UserRoute= "/users";
export const RoleRoute= "/roles";
export const ChangePasswordRoute= "/profile/password";

export interface BaseRouterProps {
    baseRouter:string;
}

interface AccountRouterProps {
    baseRouter: string;
    UserListPage: React.FC<BaseRouterProps>;
    UserDetailPage: React.FC<BaseRouterProps>;
    ChangePasswordPage: React.FC<BaseRouterProps>;
    RoleListPage: React.FC<BaseRouterProps>;
    RoleDetailPage: React.FC<BaseRouterProps>;
}

export function AccountRouter(
    {
        baseRouter,
        UserListPage,
        UserDetailPage,
        ChangePasswordPage,
        RoleListPage,
        RoleDetailPage

    }:AccountRouterProps) {
    return <Routes>
        <Route path={UserRoute} element={<UserListPage baseRouter={baseRouter}/>}/>
        <Route path={`${UserRoute}/:id`} element={<UserDetailPage baseRouter={baseRouter}/>}/>
        <Route path={RoleRoute} element={<RoleListPage baseRouter={baseRouter}/>}/>
        <Route path={`${RoleRoute}/:name`} element={<RoleDetailPage baseRouter={baseRouter}/>}/>
        <Route path={ChangePasswordRoute} element={<ChangePasswordPage baseRouter={baseRouter}/>}/>
    </Routes>
}