import {fullCmsApiUrl} from "../configs";
import {catchResponse} from "../../utils/apiUtils";
import axios from "axios";
import {ChunkStatus} from "../types/chunkStatus";

export async function uploadChunk(fileId: string, fileName: string, chunkNumber: number, chunk: Blob) {
    const url = fullCmsApiUrl("/chunks/");
    const formData = new FormData();
    formData.append("fileId", fileId);
    formData.append("fileName", fileName);
    formData.append("chunkNumber", chunkNumber.toString());
    formData.append("file", chunk);

    return catchResponse(() => axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }));
}

export async function checkChunkStatus(fileName: string, size: number) {
    const url = fullCmsApiUrl(`/chunks/status?fileName=${encodeURIComponent(fileName)}&size=${size}`);
    return catchResponse(() => axios.get<ChunkStatus>(url));
}

export async function commitChunk(fileId: string, fileName: string) {
    const url = fullCmsApiUrl("/chunks/commit");
    const formData = new FormData();
    formData.append("fileId", fileId);
    formData.append("fileName", fileName);

    return catchResponse(() => axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }));
}