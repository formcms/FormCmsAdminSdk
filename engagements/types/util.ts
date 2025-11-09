import {EngagementStatus} from "./engagement";
import {Bookmark} from "./bookmark";

export function EngagementField(key: keyof EngagementStatus) {
    return key as string;
}

export function BookmarkField(key: keyof Bookmark) {
    return key as string;
}