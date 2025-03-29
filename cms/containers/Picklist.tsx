import {deleteJunctionItems, saveJunctionItems, useJunctionData} from "../services/entity";
import {Button} from "primereact/button";
import {useCheckError} from "../../hooks/useCheckError";
import {useConfirm} from "../../hooks/useConfirm";
import {SelectDataTable} from "../../components/data/SelectDataTable";
import { XAttr, XEntity } from "../../types/xEntity";
import { useDataTableStateManager } from "../../hooks/useDataTableStateManager";
import { encodeDataTableState } from "../../types/dataTableStateUtil";
import { createColumn } from "./createColumn";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {getListAttrs} from "../../types/attrUtils";
import {CmsComponentConfig} from "../types/cmsComponentConfig";

export function Picklist({column, data, schema, getFullAssetsURL,componentConfig}: {
    data: any,
    column: XAttr,
    schema: XEntity,
    getFullAssetsURL : (arg:string) =>string
    componentConfig:CmsComponentConfig
}) {
    const [visible, setVisible] = useState(false);
    const id = (data ?? {})[schema?.primaryKey ?? '']
    const targetSchema = column.junction;
    const listColumns = getListAttrs(targetSchema?.attributes);
    const [existingItems, setExistingItems] = useState(null)
    const [toAddItems, setToAddItems] = useState(null)

    const tableColumns = listColumns.map(x=>createColumn(x,componentConfig,getFullAssetsURL));
    
    const existingStateManager= useDataTableStateManager(schema.primaryKey,10, listColumns,"");
    const {data: subgridData, mutate: subgridMutate} = useJunctionData(schema.name, id, column.field, false, 
        encodeDataTableState(existingStateManager.state));

    const excludedStateManager= useDataTableStateManager(schema.primaryKey,10, listColumns,"");
    const {data: excludedSubgridData, mutate: execMutate} = useJunctionData(schema.name, id, column.field, true,
        encodeDataTableState(excludedStateManager.state));
    
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const {confirm,Confirm} = useConfirm("picklist" +column.field, componentConfig);
    
    const mutateDate = () => {
        setExistingItems(null);
        setToAddItems(null)
        subgridMutate()
        execMutate()

    }

    const handleSave = async () => {
        const {error} = await saveJunctionItems(schema.name, id, column.field, toAddItems)
        await handleErrorOrSuccess(error, componentConfig.picklist.saveSuccessMessage, () => {
            mutateDate()
            setVisible(false)
        })
    }

    const onDelete = async () => {
        confirm(componentConfig.picklist.deleteConfirmationMessage, componentConfig.picklist.deleteConfirmationHeader, async () => {
            const {error} = await deleteJunctionItems(schema.name, id, column.field, existingItems)
            await handleErrorOrSuccess(error, componentConfig.picklist.deleteSuccessMessage, () => {
                mutateDate()
            })
        })
    }

    const footer = (
        <>
            <Button label={componentConfig.picklist.cancelButtonLabel} icon="pi pi-times" outlined onClick={()=>setVisible(false)}/>
            <Button label={componentConfig.picklist.saveButtonLabel} icon="pi pi-check" onClick={handleSave}/>
        </>
    );

    return <div className={'card col-12'}>
        <label id={column.field} className="font-bold">
            {column.header}
        </label><br/>
        <CheckErrorStatus/>
        <Confirm/>
        <Button outlined label={componentConfig.picklist.selectButtonLabel(column.header)} onClick={()=>setVisible(true)} size="small"/>
        {' '}
        <Button type={'button'} label={componentConfig.picklist.deleteButtonLabel} severity="danger" onClick={onDelete} outlined size="small"/>
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
            header={componentConfig.picklist.dialogHeader(column.header)}>
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
