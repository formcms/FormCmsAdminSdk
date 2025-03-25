import {
    deleteRole,
    saveRole,
    useEntities,
    useSingleRole,
} from "../services/accounts";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import {useConfirm} from "../../components/useConfirm";
import {New} from "./useRoleListPage";
import {MultiSelectInput} from "../../components/inputs/MultiSelectInput";
import {FetchingStatus} from "../../components/FetchingStatus";
import { entityPermissionColumns } from "../types/utils";
import { useCheckError } from "../../components/useCheckError";

export function useRoleDetailPage(baseRouter:string) {
    const {name} = useParams()
    const {data: roleData, isLoading: loadingRole, error: errorRole, mutate: mutateRole} = useSingleRole(name==New?'':name!);
    const {data: entities, isLoading: loadingEntity, error: errorEntities} = useEntities();
    const {confirm,Confirm} = useConfirm('roleDetailPage');
    const {handleErrorOrSuccess, CheckErrorStatus} = useCheckError();
    const { register, handleSubmit, control } = useForm()
    const isNewRole = name === New ;

    return {isNewRole, roleData, handleDelete,RoleDetailPageMain}

    async function handleDelete ()  {
        confirm('Do you want to delete this role?', async () => {
            const {error} = await deleteRole(name!);
            await handleErrorOrSuccess(error, 'Delete Succeed', ()=> {
                window.location.href = baseRouter + '/roles/' ;
            })
        });
    }
    async function onSubmit   (formData: any)  {
        if (name != New){
            formData.name = name;
        }
        const {error} = await saveRole(formData);
        await handleErrorOrSuccess(error, 'Successfully Saved Role', ()=> {
            if ( name == New) {
                window.location.href = baseRouter + '/roles/' + formData.name;
            }else{
                mutateRole();
            }
        });
    }
    function RoleDetailPageMain(){
        return <>
            <FetchingStatus isLoading={loadingRole || loadingEntity} error={errorRole || errorEntities}/>
            <Confirm/>
            <CheckErrorStatus/>
            <form onSubmit={handleSubmit(onSubmit)} id="form">
                <div className="formgrid grid">
                    {isNewRole && <div className={'field col-12  md:col-4'}>
                        <label>Name</label>
                        <input type={'text'} className="w-full p-inputtext p-component" id={'name'}
                               {...register('name', {required: 'name is required'})}
                        />
                    </div>}
                    {
                        entityPermissionColumns.map(x => (
                            <MultiSelectInput
                                data={roleData ?? {}}
                                column={x}
                                register={register}
                                className={'field col-12  md:col-4'}
                                control={control}
                                id={name}
                                options={entities ?? []}
                            />)
                        )
                    }
                </div>
            </form>
        </>
    }
}