import React from "react";
import {Route, Routes} from "react-router-dom";

interface PortalRouterProps {
    baseRouter: string;
    ActivityListPage: React.FC;
    BookmarkPage: React.FC;
}

export function PortalRouter(
    {
        ActivityListPage,
        BookmarkPage,
    }: PortalRouterProps
) {
    return <Routes>
        <Route path={`/activities/:type`} element={ <ActivityListPage/> }/>
        <Route path={`/bookmarks/:folderId`} element={ <BookmarkPage/> }/>
    </Routes>
}