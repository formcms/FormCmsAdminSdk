import {Button} from "primereact/button";
import {useEditTable} from "./useEditTable";
import {addCollectionItem, useCollectionData} from "../services/entity";
import {ItemForm} from "./ItemForm";
import {EditDataTable} from "../../components/data/EditDataTable";
import {XAttr, XEntity} from "../types/xEntity";
import {useDataTableStateManager} from "../../components/data/useDataTableStateManager";
import {encodeDataTableState} from "../../components/data/dataTableStateUtil";
import {createColumn} from "../../components/data/columns/createColumn";
import {getFileUploadURL} from "../services/asset";
import {useCheckError} from "../../components/useCheckError";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Dialog} from "primereact/dialog";


export function EditTable(
    {
        baseRouter,
        column, 
        data, 
        schema, 
        getFullAssetsURL
    }: {
        baseRouter: string,
        schema: XEntity,
        column: XAttr,
        data: any,
        getFullAssetsURL: (arg: string) => string
    }
) {
    //data
    const {id, listColumns, inputColumns, targetSchema} = useEditTable(data, schema, column)
    const stateManager = useDataTableStateManager(schema.primaryKey, 8, listColumns, "");
    const { data: collectionData, mutate } = useCollectionData(schema.name, id, column.field, encodeDataTableState(stateManager.state));
    const tableColumns = listColumns.map(x => 
        createColumn(x, getFullAssetsURL, x.field == schema.labelAttributeName ? onEdit : undefined));

    const formId = "edit-table" + column.field;

    const navigate = useNavigate();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const [visible, setVisible] = useState(false);

    function onEdit(rowData: any) {
        var id = rowData[targetSchema!.primaryKey];
        const url = `${baseRouter}/${targetSchema!.name}/${id}?ref=${encodeURIComponent(window.location.href)}`;
        navigate(url);
    }

    async function onSubmit(formData: any) {
        const {error} = await addCollectionItem(schema.name, id, column.field, formData)
        await handleErrorOrSuccess(error, "submit success", () => {
            mutate();
            setVisible(false);
        });
    }

    const footer = <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={()=>setVisible(false)}/>
            <Button label="Save" icon="pi pi-check" type="submit" form={formId}/>
        </>
    return <div className={'card col-12'}>
        <label id={column.field} className="font-bold">
            {column.header}
        </label><br/>
        <Button outlined label={'Add ' + column.header} onClick={()=>setVisible(true)} size="small"/>
        {' '}
        <EditDataTable dataKey={schema.primaryKey} 
                       columns={tableColumns} 
                       data={collectionData}
                       stateManager={stateManager}/>
        <Dialog
            maximizable
            visible={visible}
            onHide={()=>setVisible(false)}
            modal className="p-fluid"
            footer={footer}
            header={'Add ' + column.header}>
            <>
                <CheckErrorStatus/>
                <ItemForm
                    id={formId}
                    formId={formId}
                    uploadUrl={getFileUploadURL()}
                    columns={inputColumns}
                    data={{}}
                    getFullAssetsURL={getFullAssetsURL}
                    onSubmit={onSubmit}/>
            </>
        </Dialog>
    </div>
}