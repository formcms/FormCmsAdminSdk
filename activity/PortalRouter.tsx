import React from "react";
import {Route, Routes} from "react-router-dom";
import {useActivityEntity} from "./services/activities";
import {XEntity} from "../types/xEntity";

interface PortalRouterProps {
    baseRouter: string;
    ActivityListPage: React.FC<{schema:XEntity}>;
}

export function PortalRouter(
    {
        ActivityListPage,
    }: PortalRouterProps
) {
    const {data: activity} = useActivityEntity();

    return activity && <Routes>
        <Route path={`/:type`} element={
            <ActivityListPage schema={activity} />
        }/>
    </Routes>
}