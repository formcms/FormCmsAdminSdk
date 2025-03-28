import {Column} from "primereact/column";


export type FileColumnProps = {
    field: string,
    header: string,
    getFullAssetsURL?: (arg: string) => string | undefined
}

//have to return a <Column>, can not be Function Component
export function fileColumn({field, header, getFullAssetsURL}: FileColumnProps) {
    const bodyTemplate = (item: any) => {
        const fullURL =getFullAssetsURL ? getFullAssetsURL(item[field]): item[field];
        return <a href={ fullURL}>Download</a>;
    };
    return <Column key={field} field={field} header={header} body={bodyTemplate}></Column>
}
