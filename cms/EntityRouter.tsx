import {Route, Routes,} from "react-router-dom";
import {useTaskEntity} from "./services/task";
import {useAssetEntityWithLink} from "./services/asset";
import React from "react";
import {EntityPageWrapper} from "./pages/EntityPageWrapper";
import {XEntity} from "./types/xEntity";

export const NewItemRoute = "new";

interface EntityRouterProps {
    baseRouter: string;
    DataListPage: React.FC<{schema:XEntity,baseRouter:string}>;
    NewDataItemPage:React.FC<{schema:XEntity,baseRouter:string}> ;
    DataItemPage: React.FC<{schema:XEntity,baseRouter:string}>;
    TaskListPage: React.FC<{schema:XEntity,baseRouter:string}>;
    AssetListPage:React.FC<{schema:XEntity,baseRouter:string}>;
    AssetEditPage: React.FC<{schema:XEntity,baseRouter:string}>;
}

export function EntityRouter(
    {
        baseRouter,
        DataListPage,
        NewDataItemPage,
        DataItemPage,
        TaskListPage,
        AssetListPage,
        AssetEditPage
    }: EntityRouterProps
) {
    const {data: asset} = useAssetEntityWithLink()
    const {data: task} = useTaskEntity()

    return task && asset && <Routes>
        <Route path={'/:schemaName'} element={ <EntityPageWrapper baseRouter={baseRouter} page={DataListPage}/> }> </Route>
        <Route path={`/:schemaName/${NewItemRoute}`} element={<EntityPageWrapper baseRouter={baseRouter} page={NewDataItemPage}/>}> </Route>
        <Route path={'/:schemaName/:id'} element={<EntityPageWrapper baseRouter={baseRouter} page={DataItemPage}/>}> </Route>
        <Route path={`/${task.name}`} element={<TaskListPage schema={task} baseRouter={baseRouter}/>}> </Route>
        <Route path={`/${asset.name}`} element={<AssetListPage schema={asset} baseRouter={baseRouter}/>}> </Route>
        <Route path={`/${asset.name}/:id`} element={<AssetEditPage schema={asset} baseRouter={baseRouter}/>}> </Route>
    </Routes>
}