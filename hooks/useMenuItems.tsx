import {useTopMenuBar} from "../auth/services/menu";
import {ChangePasswordRoute, RoleRoute, UserRoute} from "../auth/AccountRouter";
import {useAssetEntity} from '../cms/services/asset';
import {useTaskEntity} from "../cms/services/task";
import {logout, useUserInfo} from "../auth/services/auth";
import {UserAccess} from "../auth/types/userAccess";

//have to pass access to canAccess(), otherwise got 'Do not call Hooks inside conditions or loops.',https://react.dev/warnings/invalid-hook-call-warning
function canAccess(entityName: string, access?: UserAccess) {
    return access?.roles.includes('sa') ||
        access?.readWriteEntities?.includes(entityName)
        || access?.restrictedReadWriteEntities?.includes(entityName)
        || access?.readonlyEntities?.includes(entityName)
        || access?.restrictedReadonlyEntities?.includes(entityName)
}

export function useEntityMenuItems(entityRouterPrefix: string) {
    const {data: userAccess} = useUserInfo();
    let items = useTopMenuBar();
    const entityPrefix = 'entities'

    items = items.filter(x => {
        const parts = x.url.split('?')[0].split('/');
        return parts.length > 2 && parts[1] === entityPrefix && canAccess(parts[2], userAccess);
    })

    return items.map((x: any) => {
            const parts = x.url.split('?')[0].split('/');
            const link = x.url.replaceAll('/' + entityPrefix, entityRouterPrefix);
            return {
                key: parts[2],
                icon: 'pi ' + x.icon,
                label: x.label,
                link
            };
        }
    );
}

export function useAssetMenuItems(entityRouterPrefix: string) {
    const {data: asset} = useAssetEntity()
    const {data: userAccess} = useUserInfo();
    if (!canAccess(asset?.name ?? "", userAccess)) return [];
    return asset ? [
        {
            icon: 'pi pi-images',
            label: 'Asset',
            link: `${entityRouterPrefix}/${asset?.name}`
        },
    ] : []
}

export interface SystemMenuLabels {
    menu_schema_builder: string
    menu_users: string,
    menu_roles: string,
    menu_audit_log: string
    menu_tasks: string
}

export function useSystemMenuItems(
    entityRouterPrefix: string,
    authRouterPrefix: string,
    auditLogRouterPrefix: string,
    schemaBuilderRouter: string,
) {

    const {data: task} = useTaskEntity()
    const {data: userAccess} = useUserInfo();

    function sysMenu(key: keyof SystemMenuLabels) {
        return key
    }

    return [
        {
            key: sysMenu('menu_tasks'),
            icon: 'pi pi-clock',
            label: 'Tasks',
            link: `${entityRouterPrefix}/${task?.name}`
        },
        {
            key: sysMenu('menu_roles'),
            icon: 'pi pi-sitemap',
            label: 'Roles',
            link: (`${authRouterPrefix}${RoleRoute}`)
        },
        {
            key: sysMenu('menu_users'),
            icon: 'pi pi-users',
            label: 'Users',
            link: `${authRouterPrefix}${UserRoute}`
        },
        {
            key: sysMenu('menu_audit_log'),
            icon: 'pi pi-file-edit',
            label: 'Audit Logs',
            link: `${auditLogRouterPrefix}`
        },
        {
            key: sysMenu('menu_schema_builder'),
            icon: 'pi pi-cog',
            label: "Schema Builder",
            url: schemaBuilderRouter,
            isExternal: true
        },
    ].filter(x => userAccess?.allowedMenus.includes(x.key));
}

export type UserProfileMenuLabels = {
    changePassword: string,
    logout: string
}

export function useUserProfileMenu(authRouterPrefix: string) {
    function profileMenu(key: keyof UserProfileMenuLabels) {
        return key
    }

    const {mutate} = useUserInfo();
    const handleLogout = async () => {
        await logout();
        await mutate();
        window.location.href = '/';
    }
    return [
        {
            key: profileMenu('changePassword'),
            label: 'Change Password',
            icon: 'pi pi-lock',
            link: `${authRouterPrefix}${ChangePasswordRoute}`,
        },
        {
            key: profileMenu('logout'),
            label: `Logout`,
            icon: 'pi pi-sign-out',
            command: handleLogout
        }
    ];
}