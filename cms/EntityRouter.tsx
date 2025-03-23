import {Route, Routes,} from "react-router-dom";
import {DataListPage, NewItemRoute} from "./pages/DataListPage";
import {DataItemPage} from "./pages/DataItemPage";
import {NewDataItemPage} from "./pages/NewDataItemPage";
import { useTaskEntity } from "./services/task";
import { TaskList } from "./pages/TaskList";
import { AssetList } from "./pages/AssetList";
import {useAssetEntity} from "./services/asset";
import { AssetEdit } from "./pages/AssetEdit";

export function EntityRouter({baseRouter}:{baseRouter:string}) {
    const {data:asset} = useAssetEntity()
    const {data:task} = useTaskEntity()

    return task && asset && <Routes>
        <Route path={'/:schemaName'} element={<DataListPage baseRouter={baseRouter}/>}> </Route>
        <Route path={`/:schemaName/${NewItemRoute}`} element={<NewDataItemPage baseRouter={baseRouter}/>}> </Route>
        <Route path={'/:schemaName/:id'} element={<DataItemPage baseRouter={baseRouter}/>}> </Route>
        <Route path={`/${task.name}`} element={<TaskList schema={task} />} >  </Route>
        <Route path={`/${asset.name}`} element={<AssetList schema={asset} baseRouter={baseRouter}/>} > </Route>
        <Route path={`/${asset.name}/:id`} element={<AssetEdit schema={asset} baseRouter={baseRouter}/>} > </Route>
    </Routes>
}