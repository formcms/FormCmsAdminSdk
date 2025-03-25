import {deleteUser, saveUser, useEntities, useSingleUser, useRoles} from "../services/accounts";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useConfirm} from "../../components/useConfirm";
import {FetchingStatus} from "../../components/FetchingStatus";
import {MultiSelectInput} from "../../components/inputs/MultiSelectInput";
import {entityPermissionColumns} from "../types/utils";
import { useCheckError } from "../../components/useCheckError";

export function useUserDetailPage(baseRouter: string ) {
    const {id} = useParams()
    const {data: userData, isLoading: loadingUser, error: errorUser, mutate: mutateUser} = useSingleUser(id!);
    const {data: roles, isLoading: loadingRoles, error: errorRoles} = useRoles();
    const {data: entities, isLoading: loadingEntity, error: errorEntities} = useEntities();
    const {confirm, Confirm} = useConfirm('userDetailPage');
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const { register, handleSubmit, control } = useForm()
    
    const onSubmit = async (formData: any) => {
        formData.id = id;
        const {error} = await saveUser(formData);
        await handleErrorOrSuccess(error, 'Successfully Updated User',mutateUser);
    }

    const formId = "UserDetailPage" + id;

    async function handleDelete ()  {
        confirm('Do you want to delete this user?', async () => {
            const {error} = await deleteUser(id!);
            await handleErrorOrSuccess(error, 'Delete User',()=>{
                window.location.href = baseRouter + "/users";
            });
        });
    }
    function UserDetailPageMain(){
        return <>
            <Confirm/>
            <FetchingStatus isLoading={loadingUser || loadingRoles || loadingEntity}
                            error={errorUser || errorRoles || errorEntities}/>
            {
                userData && roles && <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                    <CheckErrorStatus/>
                    <div className="formgrid grid">
                        <MultiSelectInput
                            column={{
                                field: 'roles',
                                header: "Roles"
                            }} options={roles}
                            register={register}
                            className={'field col-12  md:col-4'}
                            control={control}
                            id={id}
                            data={userData}/>

                        {entityPermissionColumns.map(x => (
                            <MultiSelectInput
                                data={userData}
                                options={entities ?? []}
                                column={x}
                                register={register}
                                className={'field col-12  md:col-4'}
                                control={control}
                                id={id}/>))
                        }
                    </div>
                </form>
            }

        </>
    }

    return {formId, userData, handleDelete, UserDetailPageMain}
}