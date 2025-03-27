import { useRoles } from "../services/accounts";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export const New = "__new";

// Interface for configuration with no optional properties
interface IUseRoleListPageConfig {
    nameHeader: string;
}

function getDefaultUseRoleListPageConfig(): IUseRoleListPageConfig {
    return {
        nameHeader: "Name",
    };
}

export function useRoleListPage(
    baseRouter: string,
    config: IUseRoleListPageConfig = getDefaultUseRoleListPageConfig()
) {
    const navigate = useNavigate();
    const { data: roles, isLoading } = useRoles();
    const data = roles?.map((x: string) => ({ name: x }));

    const emailTemplate = (record: { name: string }) => {
        return <Link to={record.name}>{record.name}</Link>;
    };

    function RoleListPageMain() {
        return (
            <div className="card">
                <DataTable loading={isLoading} dataKey={"name"} value={data} paginator rows={100}>
                    <Column
                        header={config.nameHeader}
                        field={"name"}
                        sortable
                        filter
                        body={emailTemplate}
                    />
                </DataTable>
            </div>
        );
    }

    function handleNavigateToNewRolePage() {
        navigate(`${baseRouter}/${New}`);
    }

    return { RoleListPageMain, handleNavigateToNewRolePage };
}