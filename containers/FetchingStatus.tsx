import {ComponentConfig} from "../componentConfig";

export function FetchingStatus({isLoading, error, componentConfig}:{isLoading:boolean, error:string, componentConfig:ComponentConfig}) {
    if (isLoading ) {
        return <>{componentConfig.etc.progressSpinner}</>
    }
    if (error ){
        return <>{componentConfig.etc.progressSpinner}</>
    }
    return null
}