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
            const parts = x.url.split('?')[0].split('/');
            const url = x.url.replaceAll('/' + entityPrefix, entityRouterPrefix);
            return {
                key: parts[2],
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

export function useAssetMenuItems(entityRouterPrefix: string, assetMenuLabel:string = "Assets") {
    const navigate = useNavigate();
    const {data: asset} = useAssetEntity()
    const {data:userAccess} = useUserInfo();
    if (!canAccess(asset?.name ?? "", userAccess )) return [];
    return [
        {
            key : asset?.name,
            icon: 'pi pi-images',
            label: assetMenuLabel,
            command: () => {
                navigate(`${entityRouterPrefix}/${asset!.name}`)
            }
        },
    ]
}

export type SystemMenuLabels = {
    schemaBuilder : string,
    users: string;
    roles: string;
    auditLog : string;
    tasks:string
}

export function useSystemMenuItems(
    entityRouterPrefix: string,
    authRouterPrefix: string,
    auditLogRouterPrefix: string,
    schemaBuilderRouter: string,
    labels :SystemMenuLabels = {
        schemaBuilder: "Schema Builder",
        users: "Users",
        roles: "Roles",
        auditLog: "Audit Log",
        tasks: "Tasks"
    }
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
            label: labels.tasks,
            command: () => {
                navigate(`${entityRouterPrefix}/${task?.name}`)
            }
        },
        {
            key: MenuRoles,
            icon: 'pi pi-sitemap',
            label: labels.roles,
            command: () => {
                navigate(`${authRouterPrefix}${RoleRoute}`)
            }
        },
        {
            key: MenuUsers,
            icon: 'pi pi-users',
            label: labels.users,
            command: () => {
                navigate(`${authRouterPrefix}${UserRoute}`)
            }
        },
        {
            key: MenuAuditLog,
            icon: 'pi pi-file-edit',
            label: labels.auditLog,
            command: () => {
                navigate(`${auditLogRouterPrefix}`)
            }
        },
        {
            key: MenuSchemaBuilder,
            icon: 'pi pi-cog',
            label: labels.schemaBuilder,
            url: schemaBuilderRouter
        },
    ].filter(x => userAccess?.allowedMenus.includes(x.key));
}

export type UserProfileMenuLabels = {
    changePassword: string,
    logout:string
}
export function useUserProfileMenu(authRouterPrefix: string, labels :UserProfileMenuLabels = {
    changePassword: "Change Password",
    logout: "Logout",
}) {
    const navigate = useNavigate();
    const {mutate} = useUserInfo();
    return[
        {
            label: labels.changePassword,
            icon: 'pi pi-lock',
            command: ()=>navigate(`${authRouterPrefix}${ChangePasswordRoute}`)
        },
        {
            label: labels.logout,
            icon: 'pi pi-sign-out',
            command: async () => {
                await logout();
                await mutate();
                window.location.href = '/';
            }
        }
    ];
}