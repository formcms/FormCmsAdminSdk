import useSWR from "swr";

import {fetcher, swrConfig} from "../../api-util.ts/util";
import { Menu,MenuItem } from "../types/menu";
import { fullAuthApiUrl } from "../configs";

export function useTopMenuBar (): MenuItem[]{
    const { data} = useSWR<Menu>(fullAuthApiUrl('/schemas/menu/top-menu-bar'), fetcher, swrConfig)
    return data?.menuItems ?? [] as MenuItem[];
}