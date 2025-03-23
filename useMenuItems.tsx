import {useTopMenuBar} from "./auth/services/menu";
import {useNavigate} from "react-router-dom";
import {ChangePasswordRoute, RoleRoute, UserRoute} from "./auth/AccountRouter";
import {useAssetEntity} from './cms/services/asset';
import {MenuItem} from "primereact/menuitem";
import {useTaskEntity} from "./cms/services/task";
import {logout, useUserInfo} from "./auth/services/auth";
import {UserAccess} from "./auth/types/userAccess";

//have to pass access to canAccess(), otherwise got 'Do not call Hooks inside conditions or loops.',https://react.dev/warnings/invalid-hook-call-warning
function canAccess(entityName: string, access?: UserAccess) {
    return access?.roles.includes('sa') ||
        access?.readWriteEntities?.includes(entityName)
        || access?.restrictedReadWriteEntities?.includes(entityName)
        || access?.readonlyEntities?.includes(entityName)
        || access?.restrictedReadonlyEntities?.includes(entityName)
}

export function useEntityMenuItems(entityRouterPrefix: string) {
    const {data:userAccess} = useUserInfo();
    let items = useTopMenuBar();
    const navigate = useNavigate();
    const entityPrefix = 'entities'

    items = items.filter(x => {
        const parts = x.url.split('?')[0].split('/');
        return parts.length > 2 && parts[1] === entityPrefix && canAccess(parts[2],userAccess);
    })

    const entityMenuItems: MenuItem[] = items.map((x: any) => {
            const url = x.url.replaceAll('/' + entityPrefix, entityRouterPrefix);
            return {
                icon: 'pi ' + x.icon,
                label: x.label,
                command: () => {
                    navigate(url)
                }
            };
        }
    );
    return entityMenuItems;
}

export function useAssetMenuItems(entityRouterPrefix: string) {
    const navigate = useNavigate();
    const {data: asset} = useAssetEntity()
    const {data:userAccess} = useUserInfo();
    if (!canAccess(asset?.name ?? "", userAccess )) return [];
    return [
        {
            icon: 'pi pi-images',
            label: 'Assets',
            command: () => {
                navigate(`${entityRouterPrefix}/${asset!.name}`)
            }
        },
    ]
}

export function useSystemMenuItems(
    entityRouterPrefix: string,
    authRouterPrefix: string,
    auditLogRouterPrefix: string,
    schemaBuilderRouter: string,
) {

    const MenuSchemaBuilder = "menu_schema_builder";
    const MenuUsers = "menu_users";
    const MenuRoles = "menu_roles";
    const MenuAuditLog = "menu_audit_log";
    const MenuTasks = "menu_tasks";

    const {data: task} = useTaskEntity()
    const {data:userAccess} = useUserInfo();

    const navigate = useNavigate();
    return [
        {
            key: MenuTasks,
            icon: 'pi pi-clock',
            label: 'Tasks',
            command: () => {
                navigate(`${entityRouterPrefix}/${task?.name}`)
            }
        },
        {
            key: MenuRoles,
            icon: 'pi pi-sitemap',
            label: 'Roles',
            command: () => {
                navigate(`${authRouterPrefix}${RoleRoute}`)
            }
        },
        {
            key: MenuUsers,
            icon: 'pi pi-users',
            label: 'Users',
            command: () => {
                navigate(`${authRouterPrefix}${UserRoute}`)
            }
        },
        {
            key: MenuAuditLog,
            icon: 'pi pi-file-edit',
            label: 'Audit Log',
            command: () => {
                navigate(`${auditLogRouterPrefix}`)
            }
        },
        {
            key: MenuSchemaBuilder,
            icon: 'pi pi-cog',
            label: 'Schema Builder',
            url: schemaBuilderRouter
        },
    ].filter(x => userAccess?.allowedMenus.includes(x.key));
}

export function useUserProfileMenu(authRouterPrefix: string) {
    const navigate = useNavigate();
    const {mutate} = useUserInfo();
    return[
        {
            label: 'Change Password',
            icon: 'pi pi-lock',
            command: ()=>navigate(`${authRouterPrefix}${ChangePasswordRoute}`)
        },
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: async () => {
                await logout();
                await mutate();
                window.location.href = '/';
            }
        }
    ];
}