import {addCollectionItem, useCollectionData} from "../services/entity";
import {XAttr, XEntity} from "../../types/xEntity";
import {useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {encodeDataTableState} from "../../types/dataTableStateUtil";
import {getFileUploadURL} from "../services/asset";
import {useCheckError} from "../../hooks/useCheckError";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {toDataTableColumns, getInputAttrs, getListAttrs} from "../../types/attrUtils";
import {createInput} from "./createInput";
import {useForm} from "react-hook-form";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {formater} from "../../types/formatter";

export function EditTable(
    {
        baseRouter,
        column,
        data,
        schema,
        getFullAssetsURL,
        componentConfig
    }: {
        baseRouter: string,
        schema: XEntity,
        column: XAttr,
        data: any,
        getFullAssetsURL: (arg: string) => string
        componentConfig:CmsComponentConfig
    }
) {

    //data
    const targetSchema = column.collection;
    const listAttrs = getListAttrs(targetSchema?.attributes);
    const stateManager = useDataTableStateManager(schema.primaryKey, 8, listAttrs, "");

    const id = (data ?? {})[schema.primaryKey ?? '']
    const { data: collectionData, mutate } = useCollectionData(schema.name, id, column.field, encodeDataTableState(stateManager.state));

    //state
    const [visible, setVisible] = useState(false);

    //ui variables
    const inputAttrs = getInputAttrs(targetSchema?.attributes);
    const dataTableCols = listAttrs.map(x =>
        toDataTableColumns(x, x.field == schema.labelAttributeName ? onEdit : undefined));

    const formId = "edit-table" + column.field;
    const LazyDataTable = componentConfig.dataComponents.lazyTable;

    //ref
    const navigate = useNavigate();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const { register, handleSubmit, control } = useForm()
    const Button = componentConfig.etc.button;
    const Dialog = componentConfig.etc.dialog;

    function onEdit(rowData: any) {
        const id = rowData[targetSchema!.primaryKey];
        const url = `${baseRouter}/${targetSchema!.name}/${id}?ref=${encodeURIComponent(window.location.href)}`;
        navigate(url);
    }

    async function onSubmit(formData: any) {
        const {error} = await addCollectionItem(schema.name, id, column.field, formData);
        await handleErrorOrSuccess(error, componentConfig.editTable.submitSuccess(column.header), () => {
            mutate();
            setVisible(false);
        });
    }


    const footer = (
        <>
            <Button
                label={componentConfig.editTable.cancelButtonLabel}
                icon="pi pi-times"
                outlined
                type="button"
                onClick={() => setVisible(false)}
            />
            <Button
                label={componentConfig.editTable.saveButtonLabel}
                icon="pi pi-check"
                type="submit"
                form={formId}
            />
        </>
    );

    return (
        <div className={'card col-12'}>
            <label id={column.field} className="font-bold">
                {column.header}
            </label><br/>
            <Button
                type="button"
                outlined
                label={componentConfig.editTable.addButtonLabel(column.header)}
                onClick={() => setVisible(true)}
                size="small"
            />
            {' '}
            <LazyDataTable
                dataKey={schema.primaryKey}
                columns={dataTableCols}
                data={collectionData}
                stateManager={stateManager}
                formater={formater}
                getFullAssetsURL={getFullAssetsURL}
            />
            <Dialog
                maximizable
                visible={visible}
                onHide={() => setVisible(false)}
                modal
                className="p-fluid"
                footer={footer}
                header={componentConfig.editTable.dialogHeader(column.header)}
            >
                <>
                    <CheckErrorStatus/>
                    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <div className="formgrid grid">
                            {
                                inputAttrs.map((column: any) => createInput({
                                    data:{},
                                    column,
                                    register,
                                    control,
                                    id,
                                    uploadUrl:getFileUploadURL(),
                                    getFullAssetsURL,
                                    fullRowClassName:'field col-12',
                                    partialRowClassName:'field col-12 md:col-4'
                                }, componentConfig))
                            }
                        </div>
                    </form>
                </>
            </Dialog>
        </div>
    );
}