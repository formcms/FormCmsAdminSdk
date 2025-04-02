import { deleteUser, saveUser, useEntities, useSingleUser, useRoles } from "../services/accounts";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { createConfirm } from "../../hooks/createConfirm";
import { FetchingStatus } from "../../containers/FetchingStatus";
import { MultiSelectInput } from "../../../../src/components/inputs/MultiSelectInput";
import { useCheckError } from "../../hooks/useCheckError";
import {getEntityPermissionInputs} from "../types/entityPermissionInputs";
import {ComponentConfig} from "../../ComponentConfig";

export interface UserDetailPageConfig {
    rolesHeader: string;
    deleteConfirmHeader:string
    deleteConfirmationMessage: string;
    deleteSuccessMessage: string;
}

export function getDefaultUseUserDetailPageConfig(): UserDetailPageConfig {
    return {
        rolesHeader: "Roles",
        deleteConfirmHeader:"Confirm",
        deleteConfirmationMessage: "Do you want to delete this user?",
        deleteSuccessMessage: "Delete Succeed",
    };
}

export function useUserDetailPage(
    componentConfig : ComponentConfig ,
    baseRouter: string,
    pageConfig: UserDetailPageConfig = getDefaultUseUserDetailPageConfig(),

) {
    const { id } = useParams();
    const { data: userData, isLoading: loadingUser, error: errorUser, mutate: mutateUser } = useSingleUser(id!);
    const { data: roles, isLoading: loadingRoles, error: errorRoles } = useRoles();
    const { data: entities, isLoading: loadingEntity, error: errorEntities } = useEntities();
    const { confirm, Confirm } = createConfirm("userDetailPage",componentConfig);
    const { handleErrorOrSuccess, CheckErrorStatus } = useCheckError(componentConfig);
    const { register, handleSubmit, control } = useForm();

    const onSubmit = async (formData: any) => {
        formData.id = id;
        const { error } = await saveUser(formData);
        await handleErrorOrSuccess(error, "Successfully Updated User", mutateUser);
    };

    const formId = "UserDetailPage" + id;

    async function handleDelete() {
        confirm(pageConfig.deleteConfirmationMessage,pageConfig.deleteConfirmHeader, async () => {
            const { error } = await deleteUser(id!);
            await handleErrorOrSuccess(error, pageConfig.deleteSuccessMessage, () => {
                window.location.href = baseRouter + "/users";
            });
        });
    }

    function UserDetailPageMain() {
        const entityPermissionInputs = getEntityPermissionInputs(componentConfig.entityPermissionLabels);
        return (
            <>
                <Confirm />
                <FetchingStatus
                    isLoading={loadingUser || loadingRoles || loadingEntity}
                    error={errorUser || errorRoles || errorEntities}
                    componentConfig={componentConfig}
                />
                {userData && roles && (
                    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                        <CheckErrorStatus />
                        <div className="formgrid grid">
                            <MultiSelectInput
                                column={{
                                    field: "roles",
                                    header: pageConfig.rolesHeader, // Use configurable header
                                }}
                                options={roles}
                                register={register}
                                className={"field col-12 md:col-4"}
                                control={control}
                                id={id}
                                data={userData}
                            />

                            {entityPermissionInputs.map((x) => (
                                <MultiSelectInput
                                    data={userData}
                                    options={entities ?? []}
                                    column={x} // Use configurable columns
                                    register={register}
                                    className={"field col-12 md:col-4"}
                                    control={control}
                                    id={id}
                                    key={x.field} // Added key for React list rendering
                                />
                            ))}
                        </div>
                    </form>
                )}
            </>
        );
    }

    return { formId, userData, handleDelete, UserDetailPageMain };
}