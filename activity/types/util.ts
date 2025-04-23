import {Activity} from "./activity";
import {Bookmark} from "./bookmark";

export function ActivityField(key: keyof Activity) {
    return key as string;
}

export function BookmarkField(key: keyof Bookmark) {
    return key as string;
}