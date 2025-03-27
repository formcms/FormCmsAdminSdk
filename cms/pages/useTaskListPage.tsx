import { Button } from "primereact/button";
import { createColumn } from "../containers/createColumn";
import { encodeDataTableState } from "../../components/data/dataTableStateUtil";
import { EditDataTable } from "../../components/data/EditDataTable";
import { useDataTableStateManager } from "../../components/data/useDataTableStateManager";
import { FetchingStatus } from "../../components/FetchingStatus";
import { addExportTask, archiveExportTask, getAddImportTaskUploadUrl, getExportTaskDownloadFileLink, importDemoData, useTasks } from "../services/task";
import { XEntity } from "../types/xEntity";
import { useCheckError } from "../../components/useCheckError";
import { Column } from "primereact/column";
import { SystemTask } from "../types/systemTask";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";
import { useState } from "react";

// Unified interface for TaskListPage prompts and table headers
interface ITaskListPageConfig {
    // Prompts
    exportSuccess: string; // Success message for adding export task
    importSuccess:  string; // Success message for adding import task or demo data
    archiveSuccess:  string; // Success message for archiving export task
    // Table headers (example headers, adjust based on schema.attributes)
    actionHeader: string; // Header for the action column
    uploadImportDialogHeader : string
}

// Immutable default configuration for TaskListPage (prompts and headers)
export function getDefaultTaskListPageConfig(): Readonly<ITaskListPageConfig> {
    const config = {
        exportSuccess:  `Export task added!`,
        importSuccess:  `Task added!`,
        archiveSuccess:  `Export task archived!`,
        actionHeader: 'Actions' ,
        uploadImportDialogHeader: 'Upload a file to import'
    };
    return Object.freeze(config);
}

// Main hook for TaskListPage with unified config
export function useTaskListPage(
    { schema }: { schema: XEntity },
    config: ITaskListPageConfig = getDefaultTaskListPageConfig() // Optional config with defaults
) {
    // Data
    const columns = schema?.attributes?.filter(column => column.inList) ?? [];
    const stateManager = useDataTableStateManager(schema.primaryKey, schema.defaultPageSize, columns, undefined);
    const { data, error, isLoading, mutate } = useTasks(encodeDataTableState(stateManager.state));

    // State
    const [visible, setVisible] = useState(false);

    // Error handling
    const { handleErrorOrSuccess, CheckErrorStatus } = useCheckError();

    async function handleAddExportTask() {
        const { error } = await addExportTask();
        await handleErrorOrSuccess(error, config.exportSuccess, mutate);
    }

    async function handleImportDemoData() {
        const { error } = await importDemoData();
        await handleErrorOrSuccess(error, config.importSuccess, mutate);
    }

    async function onAddImportTaskUpload() {
        await mutate();
        setVisible(false);
    }

    async function handleAddImportTask() {
        setVisible(true);
    }

    async function handleArchiveExportTask(id: number) {
        const { error } = await archiveExportTask(id);
        await handleErrorOrSuccess(error, config.archiveSuccess, mutate);
    }

    const actionBodyTemplate = (item: SystemTask) => {
        if (item.type === 'export' && item.taskStatus === 'finished') {
            return (
                <>
                    <a href={getExportTaskDownloadFileLink(item.id)}>
                        <Button>Download</Button>
                    </a>{' '}
                    <Button onClick={() => handleArchiveExportTask(item.id)}>Delete File</Button>
                </>
            );
        }
        return <></>;
    };

    const tableColumns = columns.map(x => createColumn(x));
    tableColumns.push(
        <Column
            key={'action'}
            body={actionBodyTemplate}
            header={config.actionHeader} // Configurable header
            exportable={false}
            style={{ minWidth: '12rem' }}
        />
    );

    function TaskListMain() {
        return (
            <>
                <FetchingStatus isLoading={isLoading} error={error} />
                <div className="card">
                    {data && columns && (
                        <EditDataTable
                            dataKey={schema.primaryKey}
                            columns={tableColumns}
                            data={data}
                            stateManager={stateManager}
                        />
                    )}
                </div>
                <Dialog
                    visible={visible}
                    header={config.uploadImportDialogHeader}
                    modal
                    className="p-fluid"
                    onHide={() => setVisible(false)}
                >
                    <FileUpload
                        withCredentials
                        mode={"basic"}
                        auto
                        url={getAddImportTaskUploadUrl()}
                        name={'files'}
                        onUpload={onAddImportTaskUpload}
                    />
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