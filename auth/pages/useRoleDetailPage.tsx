import {
    deleteRole,
    saveRole,
    useEntities,
    useSingleRole,
} from "../services/accounts";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useConfirm } from "../../components/useConfirm";
import { New } from "./useRoleListPage";
import { MultiSelectInput } from "../../components/inputs/MultiSelectInput";
import { FetchingStatus } from "../../components/FetchingStatus";
import { getEntityPermissionInputs } from "../types/entityPermissionInputs";
import { useCheckError } from "../../components/useCheckError";

// Interface for configuration with no optional properties
interface IUseRoleDetailPageConfig {
    deleteConfirmationMessage: string;
    deleteSuccessMessage: string;
    saveSuccessMessage: string;
    nameIsRequiredMessage:string
}

function getDefaultUseRoleDetailPageConfig(): IUseRoleDetailPageConfig {
    return {
        deleteConfirmationMessage: "Do you want to delete this role?",
        deleteSuccessMessage: "Delete Succeed",
        saveSuccessMessage: "Save Succeed",
        nameIsRequiredMessage: "Name is required"
    };
}

export function useRoleDetailPage(
    baseRouter: string,
    config: IUseRoleDetailPageConfig = getDefaultUseRoleDetailPageConfig()
) {
    const { name } = useParams();
    const { data: roleData, isLoading: loadingRole, error: errorRole, mutate: mutateRole } = useSingleRole(
        name === New ? "" : name!
    );
    const { data: entities, isLoading: loadingEntity, error: errorEntities } = useEntities();
    const { confirm, Confirm } = useConfirm("roleDetailPage");
    const { handleErrorOrSuccess, CheckErrorStatus } = useCheckError();
    const { register, handleSubmit, control } = useForm();
    const isNewRole = name === New;

    return { isNewRole, roleData, handleDelete, RoleDetailPageMain };

    async function handleDelete() {
        confirm(config.deleteConfirmationMessage, async () => {
            const { error } = await deleteRole(name!);
            await handleErrorOrSuccess(error, config.deleteSuccessMessage, () => {
                window.location.href = baseRouter + "/roles/";
            });
        });
    }

    async function onSubmit(formData: any) {
        if (name !== New) {
            formData.name = name;
        }
        const { error } = await saveRole(formData);
        await handleErrorOrSuccess(error,  config.saveSuccessMessage, () => {
            if (name === New) {
                window.location.href = baseRouter + "/roles/" + formData.name;
            } else {
                mutateRole();
            }
        });
    }

    function RoleDetailPageMain() {
        const entityPermissionInputs = getEntityPermissionInputs();
        return (
            <>
                <FetchingStatus isLoading={loadingRole || loadingEntity} error={errorRole || errorEntities} />
                <Confirm />
                <CheckErrorStatus />
                <form onSubmit={handleSubmit(onSubmit)} id="form">
                    <div className="formgrid grid">
                        {isNewRole && (
                            <div className={"field col-12 md:col-4"}>
                                <label>Name</label>
                                <input
                                    type={"text"}
                                    className="w-full p-inputtext p-component"
                                    id={"name"}
                                    {...register("name", { required: config.nameIsRequiredMessage })}
                                />
                            </div>
                        )}
                        {entityPermissionInputs.map((x) => (
                            <MultiSelectInput
                                data={roleData ?? {}}
                                column={x}
                                register={register}
                                className={"field col-12 md:col-4"}
                                control={control}
                                id={name}
                                options={entities ?? []}
                                key={x.field}
                            />
                        ))}
                    </div>
                </form>
            </>
        );
    }
}