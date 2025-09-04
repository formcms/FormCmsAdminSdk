import {encodeDataTableState, useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {
    addEmitMessageTask,
    addExportTask,
    archiveExportTask,
    getAddImportTaskUploadUrl,
    getExportTaskDownloadFileLink,
    importDemoData,
    useTasks
} from "../services/task";
import {useCheckError} from "../../hooks/useCheckError";
import {SystemTask} from "../types/systemTask";
import {useState} from "react";
import {CmsComponentConfig} from "../cmsComponentConfig";
import {SystemTaskLabels} from "../types/systemTaskUtil";
import {XEntity} from "../../types/xEntity";
import {formater} from "../../types/formatter";
import {toDataTableColumns} from "../../types/attrUtils";
import {GeneralComponentConfig} from "../../ComponentConfig";
import {useForm} from "react-hook-form";

export interface TaskListPageConfig {
    exportSuccess: string;
    importSuccess: string;
    archiveSuccess: string;
    uploadImportDialogHeader: string
    emitMsgDialogHeader: string
    taskLabels: SystemTaskLabels | undefined | null
    submitEmitMessageLabel:string
}

export function getDefaultTaskListPageConfig(): TaskListPageConfig {
    return {
        exportSuccess: `Export task added!`,
        importSuccess: `Task added!`,
        archiveSuccess: `Export task archived!`,
        uploadImportDialogHeader: 'Upload a file to import',
        emitMsgDialogHeader: 'Input the entity name to emit message',
        submitEmitMessageLabel: 'Submit',
        taskLabels: undefined
    };
}

export function useTaskListPage(
    componentConfig: CmsComponentConfig & GeneralComponentConfig,
    schema:  XEntity ,
    pageConfig: TaskListPageConfig = getDefaultTaskListPageConfig(),
) {
    // Data
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.name,schema.primaryKey, schema.defaultPageSize, columns, undefined);
    const {data, error, isLoading, mutate} = useTasks(encodeDataTableState(stateManager.state));

    // State
    const [importDialogVisible, setImportDialogVisible] = useState(false);
    const [emitMsgDialogVisible, setEmitMsgDialogVisible] = useState(false);

    const {register, handleSubmit, control} = useForm();
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError(componentConfig);
    const LazyDataTable = componentConfig.dataComponents.lazyTable;
    const Dialog = componentConfig.etc.dialog;
    const Button = componentConfig.etc.button;
    const Upload = componentConfig.etc.upload;

    async function handleAddExportTask() {
        const {error} = await addExportTask();
        await handleErrorOrSuccess(error, pageConfig.exportSuccess, mutate);
    }

    async function handleImportDemoData() {
        const {error} = await importDemoData();
        await handleErrorOrSuccess(error, pageConfig.importSuccess, mutate);
    }

    async function onAddImportTaskUpload() {
        await mutate();
        setImportDialogVisible(false);
    }

    async function handleAddImportTask() {
        setImportDialogVisible(true);
    }

    async function handleArchiveExportTask(id: number) {
        const {error} = await archiveExportTask(id);
        await handleErrorOrSuccess(error, pageConfig.archiveSuccess, mutate);
    }

    async function handleAddEmitMessageTask() {
        setEmitMsgDialogVisible(true);
    }

    async function onAddEmitMessageTask(formData:any){
        await addEmitMessageTask(formData);
        setEmitMsgDialogVisible(false);
    }

    const actionBodyTemplate = (item: SystemTask) => {
        if (item.type === 'export' && item.taskStatus === 'finished') {
            return (
                <>
                    <a href={getExportTaskDownloadFileLink(item.id)}>
                        <Button label={'Download'} icon={""} type={"button"}/>
                    </a>{' '}
                    <Button label={'Delete File'} onClick={() => handleArchiveExportTask(item.id)} icon={""} type={"button"}/>
                </>
            );
        }
        return <></>;
    };

    const labels = pageConfig.taskLabels;
    if (labels){
        columns.forEach((column) => {
            if (column.field in labels){
                column.header = labels[column.field as keyof SystemTaskLabels];
            }
        })
    }

    const tableColumns = columns.map(x => toDataTableColumns(x));
    function TaskListMain() {
        return (
            <>
                <FetchingStatus isLoading={isLoading} error={error} componentConfig={componentConfig} />
                <div className="card">
                    {data && columns && (
                        <LazyDataTable
                            formater={formater}
                            dataKey={schema.primaryKey}
                            columns={tableColumns}
                            data={data}
                            stateManager={stateManager}
                            actionTemplate={actionBodyTemplate}
                        />
                    )}
                </div>
                <Dialog
                    visible={importDialogVisible}
                    header={pageConfig.uploadImportDialogHeader}
                    modal
                    className="p-fluid"
                    onHide={() => setImportDialogVisible(false)}
                >
                    <Upload url={getAddImportTaskUploadUrl()} onUpload={onAddImportTaskUpload} />
                </Dialog>
                <Dialog
                    visible={emitMsgDialogVisible}
                    header={pageConfig.emitMsgDialogHeader}
                    modal
                    className="p-fluid"
                    onHide={() => setEmitMsgDialogVisible(false)}
                >
                    <form onSubmit={handleSubmit(onAddEmitMessageTask)} >
                        <div className="formgrid grid">
                            <input className={"w-full p-inputtext p-component"}
                                type="text"
                                placeholder="Enter Entity name"
                                {...register("entityName", { required: true })}
                            />
                            <Button type={'submit'} label={pageConfig.submitEmitMessageLabel}/>
                        </div>
                    </form>
                </Dialog>
            </>
        );
    }

    return {
        handleAddExportTask,
        handleAddImportTask,
        handleImportDemoData,
        handleAddEmitMessageTask,
        TaskListMain,
        CheckErrorStatus,
    };
}