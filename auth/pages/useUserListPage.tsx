import { useUsers } from "../services/accounts";
import { Link } from "react-router-dom";
import {ComponentConfig} from "../../ComponentConfig";

export interface UseUserListPageConfig {
    emailHeader: string;
    roleHeader: string;
}

export function getDefaultUseUserListPageConfig()  {
    return {
        emailHeader:  "Email",
        roleHeader:  "Role",
    };
}

export function useUserListPage(
    componentConfig : ComponentConfig,
    pageConfig: UseUserListPageConfig = getDefaultUseUserListPageConfig(),
) {
    const { data } = useUsers();

    const roleTemplate = (record: { roles: string[] }) => {
        return record.roles.join(",");
    };

    const emailTemplate = (record: { email: string; id: string[] }) => {
        return <Link to={record.id.toString()}>{record.email}</Link>;
    };

    const tableColumns = [
        {
            header: pageConfig.emailHeader,
            field: "email",
            body: emailTemplate,
        },
        {
            header:pageConfig.roleHeader,
            field: "roles",
            body: roleTemplate,
        }
    ]
    const BasicDataTable = componentConfig.dataComponents.basicTable

    return { UserListPageMain };

    function UserListPageMain() {
        return data && <BasicDataTable pageSize={10} data={data} dataKey={'id'} tableColumns={tableColumns}/>
    }
}
