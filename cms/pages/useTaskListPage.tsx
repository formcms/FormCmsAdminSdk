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
import {CmsComponentConfig, getDefaultCmsComponentConfig} from "../cmsComponentConfig";

interface ITaskListPageConfig {
    exportSuccess: string;
    importSuccess:  string;
    archiveSuccess:  string;
    uploadImportDialogHeader : string
}

export function getDefaultTaskListPageConfig(): ITaskListPageConfig {
    return  {
        exportSuccess:  `Export task added!`,
        importSuccess:  `Task added!`,
        archiveSuccess:  `Export task archived!`,
        uploadImportDialogHeader: 'Upload a file to import'
    };
}

export function useTaskListPage(
    { schema }: { schema: XEntity },
    config: ITaskListPageConfig = getDefaultTaskListPageConfig() ,
    componentConfig : CmsComponentConfig = getDefaultCmsComponentConfig()
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

    const tableColumns = columns.map(x => createColumn(x, componentConfig, undefined, undefined));
    tableColumns.push(
        <Column
            key={'action'}
            body={actionBodyTemplate}
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