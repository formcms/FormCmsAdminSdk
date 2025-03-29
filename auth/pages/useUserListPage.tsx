import { DataTable } from "primereact/datatable";
import { useUsers } from "../services/accounts";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";

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

export function useUserListPage(config: UseUserListPageConfig = getDefaultUseUserListPageConfig()) {
    const { data, isLoading } = useUsers();

    const roleTemplate = (record: { roles: string[] }) => {
        return record.roles.join(",");
    };

    const emailTemplate = (record: { email: string; id: string[] }) => {
        return <Link to={record.id.toString()}>{record.email}</Link>;
    };

    return { UserListPageMain };

    function UserListPageMain() {
        return (
            <DataTable
                loading={isLoading}
                dataKey={"id"}
                value={data}
                paginator
                rows={100}
            >
                <Column
                    header={config.emailHeader}
                    field={"email"}
                    sortable
                    filter
                    body={emailTemplate}
                />
                <Column
                    header={config.roleHeader}
                    field={"role"}
                    body={roleTemplate}
                />
            </DataTable>
        );
    }
}
