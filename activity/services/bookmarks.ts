import useSWR from "swr";
import {fullActivityUrl} from "../config";
import {catchResponse, decodeError, fetcher, swrConfig} from "../../utils/apiUtils";
import {BookmarkFolder} from "../types/bookmarkFoder";
import {ListResponse} from "../../types/listResponse";
import axios from "axios";

export function useBookmarkFolders() {
    let res = useSWR<BookmarkFolder[]>(
        fullActivityUrl(`/bookmarks/folders`), fetcher, swrConfig);
    return {...res, error: decodeError(res.error)}
}

export function useBookmarks(folderId: number, qs: string) {
    let res = useSWR<ListResponse>(
        fullActivityUrl(`/bookmarks/list/${folderId}?${qs}`), fetcher, swrConfig);
    return {...res, error: decodeError(res.error)}
}

export function updateBookmarkFolder(id: number, folder: BookmarkFolder) {
    return catchResponse(() => axios.post(fullActivityUrl(`/bookmarks/folders/update/${id}`), folder))
}

export function deleteBookmarkFolder(id: number) {
    return catchResponse(() => axios.post(fullActivityUrl(`/bookmarks/folders/delete/${id}`)))
}

export function deleteBookmark(id: number) {
    return catchResponse(() => axios.post(fullActivityUrl(`/bookmarks/delete/${id}`)))
}