import {encodeDataTableState} from "../../types/dataTableStateUtil";
import {useDataTableStateManager} from "../../hooks/useDataTableStateManager";
import {FetchingStatus} from "../../containers/FetchingStatus";
import {
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

export interface TaskListPageConfig {
    exportSuccess: string;
    importSuccess: string;
    archiveSuccess: string;
    uploadImportDialogHeader: string
    taskLabels: SystemTaskLabels | undefined | null
}

export function getDefaultTaskListPageConfig(): TaskListPageConfig {
    return {
        exportSuccess: `Export task added!`,
        importSuccess: `Task added!`,
        archiveSuccess: `Export task archived!`,
        uploadImportDialogHeader: 'Upload a file to import',
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
    const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, undefined);
    const {data, error, isLoading, mutate} = useTasks(encodeDataTableState(stateManager.state));

    // State
    const [visible, setVisible] = useState(false);

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
        setVisible(false);
    }

    async function handleAddImportTask() {
        setVisible(true);
    }

    async function handleArchiveExportTask(id: number) {
        const {error} = await archiveExportTask(id);
        await handleErrorOrSuccess(error, pageConfig.archiveSuccess, mutate);
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
                    visible={visible}
                    header={pageConfig.uploadImportDialogHeader}
                    modal
                    className="p-fluid"
                    onHide={() => setVisible(false)}
                >
                    <Upload url={getAddImportTaskUploadUrl()} onUpload={onAddImportTaskUpload} />
                </Dialog>
            </>
        );
    }

    return {
        handleAddExportTask,
        handleAddImportTask,
        handleImportDemoData,
        TaskListMain,
        CheckErrorStatus,
    };
}