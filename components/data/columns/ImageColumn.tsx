import {AvatarGroup} from "primereact/avatargroup";
import {Avatar} from "primereact/avatar";
import {Column} from "primereact/column";

//have to return a <Column>, can not be Function Component
export function imageColumn( field: string,
                             header: string,
                             getFullAssetsURL?: (arg: string) => string | undefined) {
    const bodyTemplate = (item: any) => {
        const value = item[field];
        const urls: string[] = Array.isArray(value) ? value : [value];
        const fullURLs = getFullAssetsURL ? urls.map(x => getFullAssetsURL(x)) : urls;

        return <AvatarGroup>
            {
                fullURLs.map(x => <Avatar key={x} image={x} size="large" shape="circle"/>)
            }
        </AvatarGroup>
    };
    return <Column key={field} field={field} header={header} body={bodyTemplate}></Column>
}