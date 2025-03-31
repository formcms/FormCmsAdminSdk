import {ComponentConfig} from "../ComponentConfig";

export function FetchingStatus({isLoading, error, componentConfig}:{isLoading:boolean, error:string, componentConfig:ComponentConfig}) {
    if (isLoading ) {
        const Spinner = componentConfig.etc.spinner;
        return <Spinner/>;
    }
    if (error ){
        const Message = componentConfig.etc.message;
        return <Message text={error} severity={'error'}/>
    }
    return null
}