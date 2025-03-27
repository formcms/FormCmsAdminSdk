import React from "react";
import {InputPanel} from "./InputPanel";
import {InputNumber} from "primereact/inputnumber";

export type NumberInputProps = {
    data: any,
    column: { field: string, header: string },
    register: any
    className:any
    control:any
    id:any
}
export function NumberInput( props: NumberInputProps ) {
    return <InputPanel  {...props} childComponent={(field: any) =>
        <><br/>
            <InputNumber
                id={field.name}
                value={field.value ?? 0}
                className={'w-full'}
                onValueChange={(e) => {
                    field.onChange(e.value);
                }}/>
        </>
    }/>
}