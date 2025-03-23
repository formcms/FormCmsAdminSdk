import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import React from "react";
import {LoginRoute, RegisterRoute} from "./AccountRouter";

export function AuthRouter(
    {baseRouter}:{baseRouter:string}
) {
    return <Routes>
        <Route path={`${LoginRoute}`} element={<LoginPage baseRouter={baseRouter}/>}/>
        <Route path={`${RegisterRoute}`} element={<RegisterPage baseRouter={baseRouter}/>}/>
        <Route path={`*`} element={<LoginPage baseRouter={baseRouter}/>}/>
    </Routes>
}