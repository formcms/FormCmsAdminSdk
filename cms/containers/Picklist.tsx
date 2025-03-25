import {deleteJunctionItems, saveJunctionItems, useJunctionData} from "../services/entity";
import {Button} from "primereact/button";
import {useCheckError} from "../../components/useCheckError";
import {useConfirm} from "../../components/useConfirm";
import {usePicklist} from "./usePicklist";
import {SelectDataTable} from "../../components/data/SelectDataTable";
import { XAttr, XEntity } from "../types/xEntity";
import { useDataTableStateManager } from "../../components/data/useDataTableStateManager";
import { encodeDataTableState } from "../../components/data/dataTableStateUtil";
import { createColumn } from "../../components/data/columns/createColumn";
import {useState} from "react";
import {Dialog} from "primereact/dialog";

export function Picklist({column, data, schema, getFullAssetsURL}: {
    data: any,
    column: XAttr,
    schema: XEntity,
    getFullAssetsURL : (arg:string) =>string
}) {
    const [visible, setVisible] = useState(false);
    const {
        id, listColumns,
        existingItems, setExistingItems,
        toAddItems, setToAddItems
    } = usePicklist(data, schema, column)
    
    const tableColumns = listColumns.map(x=>createColumn(x,getFullAssetsURL));
    
    const existingStateManager= useDataTableStateManager(schema.primaryKey,10, listColumns,"");
    const {data: subgridData, mutate: subgridMutate} = useJunctionData(schema.name, id, column.field, false, 
        encodeDataTableState(existingStateManager.state));

    const excludedStateManager= useDataTableStateManager(schema.primaryKey,10, listColumns,"");
    const {data: excludedSubgridData, mutate: execMutate} = useJunctionData(schema.name, id, column.field, true,
        encodeDataTableState(excludedStateManager.state));
    
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const {confirm,Confirm} = useConfirm("picklist" +column.field);
    
    const mutateDate = () => {
        setExistingItems(null);
        setToAddItems(null)
        subgridMutate()
        execMutate()

    }

    const handleSave = async () => {
        const {error} = await saveJunctionItems(schema.name, id, column.field, toAddItems)
        await handleErrorOrSuccess(error, 'Save success', () => {
            mutateDate()
            setVisible(false)
        })
    }

    const onDelete = async () => {
        confirm('Do you want to delete these item?', async () => {
            const {error} = await deleteJunctionItems(schema.name, id, column.field, existingItems)
            await handleErrorOrSuccess(error, 'Delete Succeed', () => {
                mutateDate()
            })
        })
    }

    const footer = (
        <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={()=>setVisible(false)}/>
            <Button label="Save" icon="pi pi-check" onClick={handleSave}/>
        </>
    );

    return <div className={'card col-12'}>
        <label id={column.field} className="font-bold">
            {column.header}
        </label><br/>
        <CheckErrorStatus/>
        <Confirm/>
        <Button outlined label={'Select ' + column.header} onClick={()=>setVisible(true)} size="small"/>
        {' '}
        <Button type={'button'} label={"Delete "} severity="danger" onClick={onDelete} outlined size="small"/>
        <SelectDataTable
            selectionMode={'multiple'}
            data={subgridData}
            columns={tableColumns}
            selectedItems={existingItems}
            setSelectedItems={setExistingItems}
            stateManager={existingStateManager}
        />
        <Dialog
            modal className="p-fluid"
            visible={visible}
            onHide={()=>setVisible(false)}
            footer={footer}
            header={'Select ' + column.header}>
            <SelectDataTable
                selectionMode={'multiple'}
                columns={tableColumns}
                data={excludedSubgridData}
                stateManager={excludedStateManager}
                
                selectedItems={toAddItems}
                setSelectedItems={setToAddItems}
            />
        </Dialog>
    </div>
}
