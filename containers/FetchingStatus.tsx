import {GeneralComponentConfig} from "../ComponentConfig";

export function FetchingStatus(
    {
        isLoading, error, componentConfig}:
    {
        isLoading:boolean, error:string, componentConfig:GeneralComponentConfig
    }
) {
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