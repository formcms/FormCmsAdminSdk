import {Dropdown} from "primereact/dropdown";
import {InputPanel} from "./InputPanel";
import React, {useState} from "react";
import {AutoComplete} from "primereact/autocomplete";

export type LookupInputProps = {
    data: any,
    column: { field: string, header: string },
    idField: string,
    labelField: string,
    control: any,
    className: any
    register: any,
    items: any[]
    id: any
    search: (s: string) => Promise<any[] | undefined>,
    hasMore: boolean,
}

export function LookupInput(props: LookupInputProps) {
    const {items, search, hasMore, idField, labelField} = props;
    const [filteredItems, setFilteredItems] = useState(items);
    const searchItems = async (event: any) => {
        const items = await search(event.query)
        setFilteredItems(items ?? []);
    }

    return <InputPanel  {...props} childComponent={(field: any) => {
        return hasMore ?
            <AutoComplete
                className={'w-full'}
                dropdown
                id={field.name}
                field={labelField}
                value={field.value}
                suggestions={filteredItems}
                completeMethod={searchItems}
                onChange={(e) => {
                    var selectedItem = typeof (e.value) === "object" ? e.value : {[labelField]: e.value};
                    field.onChange(selectedItem);
                }}
            />
            :
            <Dropdown
                id={field.name}
                value={field.value ? field.value[idField] : null}
                options={items}
                focusInputRef={field.ref}
                onChange={(e) => {
                    field.onChange({[idField]: e.value})
                }}
                className={'w-full'}
                optionValue={idField}
                optionLabel={labelField}
                filter
            />
    }
    }/>
}