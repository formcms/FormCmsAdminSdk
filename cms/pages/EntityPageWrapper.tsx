import {useSchema} from "../services/schema";
import React from "react";
import { Message } from "primereact/message";
import {useParams} from "react-router-dom";
import {XEntity} from "../types/xEntity";

interface EntitySchemaContainerProps {
    baseRouter:string,
    page: React.FC<{baseRouter:string,schema:XEntity}>;
}

export function EntityPageWrapper({baseRouter, page:Page}: EntitySchemaContainerProps){
    const {schemaName} = useParams()
    let {data:schema, error} = useSchema(schemaName)
    return <>
        {error && <Message severity={'error'} text={error}/>}
        {schema && <Page baseRouter={baseRouter} schema={schema}/>}
    </>
}