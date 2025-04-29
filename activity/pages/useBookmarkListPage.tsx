import {useParams} from "react-router-dom";
import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {ActivityField} from "../types/util";
import {useEffect, useState} from "react";
import {updateBookmarkFolder as $updateBookmarkFolder,
    deleteBookmark as $deleteBookmark,
    deleteBookmarkFolder as $deleteBookmarkFolder,
    useBookmarkFolders, useBookmarks} from "../services/bookmarks";
import {BookmarkFolder} from "../types/bookmarkFolder";

export function useBookmarkListPage() {
    //entrance
    const params = useParams();
    const folderId = Number(params.folderId);
    //data
    const initQs = location.search.replace("?", "");
    const stateManager = useDataTableStateManager('bookmarks' + folderId, ActivityField('id'), 8, [], initQs)
    const qs = encodeDataTableState(stateManager.state);
    const {data : bookmarkResponse, error, isLoading,mutate:mutateBookmark} =  useBookmarks(+folderId!,qs);
    useEffect(() => window.history.replaceState(null, "", `?${qs}`), [stateManager.state]);

    const {data: folders,mutate: mutateFolder} = useBookmarkFolders();
    const folder = (folders??[]).find(f=>f.id === folderId);

    const [errorMessage, setErrorMessage] = useState<string>();
    return {
        folder,
        bookmarkResponse, error, isLoading,
        stateManager,
        updateBookmarkFolder, deleteBookmark, deleteBookmarkFolder, errorMessage
    };

    async function deleteBookmarkFolder(bookmarkFolderId: number) {
        const  {error} =await $deleteBookmarkFolder(bookmarkFolderId);
        setErrorMessage(error);
        await mutateFolder();
    }

    async function deleteBookmark(bookmarkId:number) {
        const {error} = await $deleteBookmark(bookmarkId);
        setErrorMessage(error);
        await mutateBookmark();
    }

    async function updateBookmarkFolder(id:number,bookmarkFolder: BookmarkFolder){
        const  {error} =await $updateBookmarkFolder(id,bookmarkFolder);

        setErrorMessage(error);
        await mutateFolder();
    }
}