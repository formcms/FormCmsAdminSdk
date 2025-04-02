import { useRoles } from "../services/accounts";
import { Link, useNavigate } from "react-router-dom";
import {ComponentConfig} from "../../ComponentConfig";
import {RoleRoute} from "../AccountRouter";

export const New = "__new";

export function useRoleListPage(
    componentConfig: ComponentConfig,
    baseRouter: string,
) {
    const navigate = useNavigate();
    const { data: roles } = useRoles();
    const items = roles?.map((x: string) => ({ name: x }));
    const emailTemplate = (record: { name: string }) => {
        return <Link to={record.name}>{record.name}</Link>;
    };
    const BasicDataTable = componentConfig.dataComponents.basicTable;

    function RoleListPageMain() {
        return items &&<BasicDataTable
            pageSize={10}
            data={items}
            dataKey={'name'}
            tableColumns={[]}
            actionBodyTemplate={emailTemplate}
        />
    }

    function handleNavigateToNewRolePage() {
        navigate(`${baseRouter}${RoleRoute}/${New}`);
    }

    return { RoleListPageMain, handleNavigateToNewRolePage };
}