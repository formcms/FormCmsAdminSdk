import useSWR from "swr";
import { fullCmsApiUrl } from "../configs";
import {catchResponse, decodeError, fetcher, swrConfig } from "../../utils/apiUtils";
import axios from "axios";
import {XEntity} from "../../types/xEntity";
import {ListResponse} from "../../types/listResponse";

export  function useTaskEntity() {
    let res = useSWR<XEntity>(fullCmsApiUrl(`/tasks/entity`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}
export  function useTasks(qs:string) {
    let res = useSWR<ListResponse>(fullCmsApiUrl(`/tasks?${qs}`), fetcher,swrConfig);
    return {...res, error:decodeError(res.error)}
}

export  function addExportTask() {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/tasks/export`)));
}

export  function addEmitMessageTask(data:any) {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/tasks/emit`), data));
}

export  function importDemoData() {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/tasks/import/demo`)));
}
export  function archiveExportTask(id:number) {
    return catchResponse(()=>axios.post(fullCmsApiUrl(`/tasks/export/archive/${id}`),{}));
}

export  function getExportTaskDownloadFileLink(id:number) {
    return fullCmsApiUrl(`/tasks/export/download/${id}`);
}

export  function getAddImportTaskUploadUrl() {
    return fullCmsApiUrl(`/tasks/import`);
}