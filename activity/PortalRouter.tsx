import React from "react";
import {Navigate, Route, Routes} from "react-router-dom";

interface PortalRouterProps {
    baseRouter: string;
    ActivityListPage: React.FC;
    BookmarkPage: React.FC;
}

export function PortalRouter(
    {
        ActivityListPage,
        BookmarkPage,
        baseRouter
    }: PortalRouterProps
) {
    return <Routes>
        <Route path={`/activities/:type`} element={ <ActivityListPage/> }/>
        <Route path={`/bookmarks/:folderId`} element={ <BookmarkPage/> }/>
        <Route path='' element={ <Navigate to={`${baseRouter}/activities/view`}/> }/>
    </Routes>
}