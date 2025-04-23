import {useParams} from "react-router-dom";
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {useEffect, useState} from "react";
import {useActivities, deleteActivity as $deleteActivity} from "../services/activities";
import {ActivityField} from "../types/util";

export function useActivityListPage(){
    //entrance
    const {type} = useParams()
    const initQs = location.search.replace("?", "");

    //data
    const stateManager = useDataTableStateManager('activity' + type, ActivityField('id'), 8, [], initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data: activityResponse, error, isLoading,mutate} =  useActivities(type!,qs);
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    return {
        type,
        activityResponse, error, isLoading,
        stateManager,
        deleteActivity,errorMessage
    };
    async function deleteActivity(id: number) {
        const {error} = await $deleteActivity(id);
        setErrorMessage(error?.message);
        await mutate()
    }
}