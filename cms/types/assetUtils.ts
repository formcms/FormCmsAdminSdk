import { Asset,AssetLink } from "./asset";

/** Returns the string representation of a valid key from the `Asset` interface. */
export function AssetField(key: keyof Asset) {
    return key as string;
}

export function AssetLinkField(key: keyof AssetLink) {
    return key as string;
}

export interface AssetLabels{
    path: string;
    url: string;
    name: string;
    title: string;
    size: string;
    type: string;
    metadata: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    linkCount: string;
    id: string;
}