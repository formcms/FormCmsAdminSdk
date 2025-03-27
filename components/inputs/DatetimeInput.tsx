import React from "react";
import {Calendar} from "primereact/calendar";
import {InputPanel} from "./InputPanel";
export type DatetimeInputProps = {
    showTime:boolean,
    data: any,
    column: { field: string, header: string },
    register: any
    className: any
    control: any
    id: any
    inline:boolean
    parseDate:(date:string)=>Date
    formatDate:(date:any)=>any
}

export function DatetimeInput( props: DatetimeInputProps) {
    return <InputPanel  {...props} childComponent={(field: any) => {
        const d = field.value && typeof(field.value) === "string" 
            ? props.parseDate(field.value)
            : field.value;
        
        return <Calendar
            inline={props.inline}
            id={field.name}
            showTime ={props.showTime}
            hourFormat="24"
            value={d}
            className={'w-full'}
            readOnlyInput={false}
            onChange={
                e => {
                    field.onChange(props.formatDate(e.value));
                }
            }/>
    }}/>
}