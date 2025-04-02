import {deleteJunctionItems, saveJunctionItems, useJunctionData} from "../services/entity";
import {useCheckError} from "../../hooks/useCheckError";
import {createConfirm} from "../../hooks/createConfirm";
import {XAttr, XEntity} from "../../types/xEntity";
import {useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {encodeDataTableState} from "../../types/dataTableStateUtil";
import {useState} from "react";
import {getListAttrs, toDataTableColumns} from "../../types/attrUtils";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {formater} from "../../types/formatter";
import {GeneralComponentConfig} from "../../ComponentConfig";

export function Picklist({column, data, schema, getFullAssetsURL, componentConfig}: {
    data: any,
    column: XAttr,
    schema: XEntity,
    getFullAssetsURL: (arg: string) => string
    componentConfig: GeneralComponentConfig & CmsComponentConfig
}) {
    const [visible, setVisible] = useState(false);
    const id = (data ?? {})[schema?.primaryKey ?? '']
    const targetSchema = column.junction;
    const listColumns = getListAttrs(targetSchema?.attributes);
    const [existingItems, setExistingItems] = useState(null)
    const [toAddItems, setToAddItems] = useState(null)

    const tableColumns = listColumns.map(x => toDataTableColumns(x));

    const existingStateManager = useDataTableStateManager(schema.primaryKey, 10, listColumns, "");
    const {data: subgridData, mutate: subgridMutate} = useJunctionData(schema.name, id, column.field, false,
        encodeDataTableState(existingStateManager.state));

    const excludedStateManager = useDataTableStateManager(schema.primaryKey, 10, listColumns, "");
    const {data: excludedSubgridData, mutate: execMutate} = useJunctionData(schema.name, id, column.field, true,
        encodeDataTableState(excludedStateManager.state));

    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const {confirm, Confirm} = createConfirm("picklist" + column.field, componentConfig);
    const LazyDataTable = componentConfig.dataComponents.lazyTable;
    const Button = componentConfig.etc.button;
    const Dialog = componentConfig.etc.dialog;

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
            <Button label={componentConfig.picklist.cancelButtonLabel} icon="pi pi-times" onClick={() => setVisible(false)} type={'button'}/>
            <Button label={componentConfig.picklist.saveButtonLabel} icon="pi pi-check" onClick={handleSave} type={"button"}/>
        </>
    );

    return <div className={'card col-12'}>
        <label id={column.field} className="font-bold">
            {column.header}
        </label><br/>
        <CheckErrorStatus/>
        <Confirm/>
        <Button outlined label={componentConfig.picklist.selectButtonLabel(column.header)}
                onClick={() => setVisible(true)} type={"button"} icon={''}/>
        {' '}
        <Button outlined type={'button'} label={componentConfig.picklist.deleteButtonLabel}  onClick={onDelete} icon={''} />
        {targetSchema && subgridData && <LazyDataTable
            dataKey={targetSchema.primaryKey}
            formater={formater}
            getFullAssetsURL={getFullAssetsURL}
            selectionMode={'multiple'}
            data={subgridData}
            columns={tableColumns}
            selectedItems={existingItems}
            setSelectedItems={setExistingItems}
            stateManager={existingStateManager}
        />}
        <Dialog
            modal className="p-fluid"
            visible={visible}
            onHide={() => setVisible(false)}
            footer={footer}
            header={componentConfig.picklist.dialogHeader(column.header)}>
            {targetSchema && excludedSubgridData && <LazyDataTable
                dataKey={targetSchema.primaryKey}
                formater={formater}
                selectionMode={'multiple'}
                columns={tableColumns}
                data={excludedSubgridData}
                stateManager={excludedStateManager}
                selectedItems={toAddItems}
                setSelectedItems={setToAddItems}
            />
            }
        </Dialog>
    </div>
}
