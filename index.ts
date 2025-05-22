//configuration
export {setCmsApiBaseUrl} from "./cms/configs";
export {setAuditLogBaseUrl} from "./auditLog/config";
export {setAuthApiBaseUrl} from "./auth/configs";
export {setActivityBaseUrl} from './activity/config'

//dashboard
export {useDashboardPage} from "./dashboard/pages/useDashboardPage"
//cms
export type {DataItemPageConfig} from "./cms/pages/useDataItemPage";
export {useDataItemPage,getDefaultDataItemPageConfig} from "./cms/pages/useDataItemPage";

export type {DataListPageConfig}  from "./cms/pages/useDataListPage";
export {useDataListPage,getDefaultDataListPageConfig} from "./cms/pages/useDataListPage";

export type {NewDataItemPageConfig} from "./cms/pages/userNewDataItemPage";
export {userNewDataItemPage,getDefaultNewDataItemPageConfig} from "./cms/pages/userNewDataItemPage";

// asset management
export  type { AssetListPageConfig } from "./cms/pages/useAssetListPage";
export  { useAssetListPage,getDefaultAssetListPageConfig } from "./cms/pages/useAssetListPage";

export type {AssetEditPageConfig} from "./cms/pages/useAssetEditPage";
export {useAssetEditPage,getDefaultAssetEditPageConfig} from "./cms/pages/useAssetEditPage";

//auth and account management pages
export {useUserInfo} from "./auth/services/auth";

export type {ChangePasswordPageConfig} from "./auth/pages/useChangePasswordPage";
export {useChangePasswordPage,getDefaultUseChangePasswordPageConfig} from "./auth/pages/useChangePasswordPage";

export type {LoginPageConfig} from "./auth/pages/useLoginPage";
export {useLoginPage,getDefaultUseLoginPageConfig} from "./auth/pages/useLoginPage";

export type {RegisterPageConfig} from "./auth/pages/useRegisterPage";
export {useRegisterPage,getDefaultUseRegisterPageConfig} from "./auth/pages/useRegisterPage";

export type {RoleDetailPageConfig} from "./auth/pages/useRoleDetailPage";
export {useRoleDetailPage,getDefaultUseRoleDetailPageConfig} from "./auth/pages/useRoleDetailPage";

export {useRoleListPage} from "./auth/pages/useRoleListPage";

export type {UserDetailPageConfig} from "./auth/pages/useUserDetailPage";
export {useUserDetailPage,getDefaultUseUserDetailPageConfig} from "./auth/pages/useUserDetailPage";

export type {UserListPageConfig} from "./auth/pages/useUserListPage";
export {useUserListPage,getDefaultUseUserListPageConfig} from "./auth/pages/useUserListPage";

//system task
export type {TaskListPageConfig} from "./cms/pages/useTaskListPage"
export {useTaskListPage,getDefaultTaskListPageConfig} from "./cms/pages/useTaskListPage";

//audit log
export type {AuditLogListPageConfig}from "./auditLog/pages/useAuditLogListPage";
export {useAuditLogListPage,getDefaultAuditLogPageConfig} from "./auditLog/pages/useAuditLogListPage";
export {useAuditLogDetailPage} from "./auditLog/pages/useAuditLogDetailPage";

//menu and layout
export type {SystemMenuLabels} from "./hooks/useMenuItems"
export {useUserProfileMenu, useAssetMenuItems, useEntityMenuItems, useSystemMenuItems} from "./hooks/useMenuItems";
export {EntityRouter} from "./cms/EntityRouter";
export {AccountRouter} from "./auth/AccountRouter";
export {AuditLogRouter} from "./auditLog/AuditLogRouter";
export {AuthRouter} from "./auth/AuthRouter";

//global component config
export type {ComponentConfig} from "./ComponentConfig";

//component props
export type {
    BasicDataTableProps,
    LazyDataTableProps,
    GallerySelectorProps,
    GalleryViewProps} from './components/data'
export type {
    ButtonProps,
    DialogProps,
    IconProps,
    ImageProps,
    MessageProps,
    ToastProps,
    UploadProps,
    SelectButtonProps,
    ConfirmDialogProps} from './components/etc'
export type {
    DatetimeInputProps,
    DictionaryInputProps,
    DropDownInputProps,
    EditorInputProps,
    FileInputProps,
    GalleryInputProps,
    LookupInputProps,
    MultiSelectInputProps,
    NumberInputProps,
    TextAreaInputProps,
    TextInputProps, TreeInputProps, TreeSelectInputProps
} from './components/inputs'

//for user portal
export type {Activity} from './activity/types/activity'
export type {Bookmark} from './activity/types/bookmark'
export {useActivityListPage} from './activity/pages/useActivityListPage';
export {useBookmarkListPage} from './activity/pages/useBookmarkListPage';
export {PortalRouter} from './activity/PortalRouter';
export {useBookmarkFolders} from './activity/services/bookmarks';

//utils
export {toDatetimeStr, utcStrToDatetimeStr} from './types/formatter'
export {keywordFilters} from './hooks/useDataTableStateManager'
export type {XEntity} from './types/xEntity'
