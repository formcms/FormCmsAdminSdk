import {useParams} from "react-router-dom";
import {XEntity} from "../../types/xEntity";
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {useEffect} from "react";
import {useActivities} from "../services/activities";

export function useActivityListPage(
    schema: XEntity,
){
    //entrance
    const {type} = useParams()
    const initQs = location.search.replace("?", "");
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.name,schema.primaryKey, schema.defaultPageSize, columns, initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data, error, isLoading} =  useActivities(type!,qs);
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);
    return {type,data, error, isLoading, stateManager};
}