import {useEffect, useReducer} from "react";
import { DisplayType, XAttr } from "../types/xEntity";
import qs from 'qs';

export function keywordFilters(field:string, keyword:string):Filters{
    return {
        [field]:{
            operator:'and',
            constraints:[
                {
                    matchMode:'contains',
                    value: keyword
                }
            ]
        }
    }
}

export function encodeDataTableState(state: DataTableState | null): string {
    if (!state) return '';
    return qs.stringify(sanitizeState(deepClone(state)), {
        encodeValuesOnly: true,
        skipNulls: true,
        arrayFormat: 'repeat',
    });

    function sanitizeState(payload: DataTableState): SanitizedState {
        const filters = { ...payload.filters };
        sanitizeFilters(filters);
        flattenFilters(filters);
        const state: SanitizedState = {
            offset: payload.first,
            limit: payload.rows,
            ...filters,
            sort: toSortRecord(payload.multiSortMeta),
        };
        cleanEmptyProperties(state);
        return state;

        function sanitizeFilters(filters: Filters): void {
            Object.entries(filters).forEach(([k, item]) => {
                if (item.constraints && item.constraints.length && item.constraints[0].value === null) {
                    delete filters[k];
                } else if (item.constraints && item.constraints.length === 1 || item.operator === 'and') {
                    // @ts-ignore
                    delete item.operator;
                }
            });
        }
        function cleanEmptyProperties(obj: SanitizedState): void {
            Object.keys(obj).forEach((key) => {
                if (obj[key] === null || obj[key] === undefined) delete obj[key];
            });
        }
    }

    function toSortRecord(sorts: SortMeta[] = []): Record<string, 1 | -1> {
        return sorts.reduce((acc, sort) => {
            acc[sort.field] = sort.order;
            return acc;
        }, {} as Record<string, 1 | -1>);
    }


    function deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(deepClone) as T;
        return Object.fromEntries(
            Object.entries(obj as object).map(([k, v]) => [k, deepClone(v)])
        ) as T;
    }
}

//extraKey prevent got wrong state between switch router
export function useDataTableStateManager(
    extraKey:string,
    primaryKey: string,
    rowCount: number,
    cols: XAttr[],
    queryString?: string
): DataTableStateManager {
    const defaultState = createDefaultState(primaryKey, rowCount, cols, queryString);
    const [state, dispatch] = useReducer(reducer, defaultState);

    useEffect(() => {
        const newState = createDefaultState(primaryKey, rowCount, cols, queryString);
        dispatch({ type: 'reset', payload: newState });
    }, [extraKey]);

    return {
        state,
        handlers: {
            onPage: (payload) => dispatch({ type: 'onPage', payload }),
            onFilter: (payload) => dispatch({ type: 'onFilter', payload }),
            onSort: (payload) => dispatch({ type: 'onSort', payload }),
        },
    };

    function reducer(state: DataTableState, action: Action): DataTableState {
        switch (action.type) {
            case 'reset':
                return action.payload;
            case 'onPage':
                return { ...state, first: action.payload.first, rows: action.payload.rows };
            case 'onFilter':
                return { ...state, filters: { ...state.filters, ...action.payload } };
            case 'onSort':
                return { ...state, multiSortMeta: action.payload};
            default:
                return state;
        }
    }

    function createDefaultState(primaryKey: string, rows: number, cols: XAttr[], queryString?: string): DataTableState {
        const state: DataTableState = {
            first: 0,
            rows,
            multiSortMeta: [{ field: primaryKey, order: -1 }],
            filters: createDefaultFilters(cols),
        };
        if (queryString) {
            const parsed = decodeDataTableState(queryString);
            state.first = parsed.first;
            if (parsed.rows > 0) state.rows = parsed.rows;
            state.multiSortMeta = parsed.multiSortMeta;
            Object.assign(state.filters, parsed.filters);
        }
        return state;
    }

    function createDefaultFilters(cols: XAttr[]): Filters {
        return cols.reduce((filters, col) => {
            const field = col.displayType === 'lookup' && col.lookup
                ? `${col.field}.${col.lookup.labelAttributeName}`
                : col.field;
            filters[field] = {
                operator: 'and',
                constraints: [{ value: null, matchMode: displayTypeToMatch[col.displayType] as Match }],
            };
            return filters;
        }, {} as Filters);
    }



    function decodeDataTableState(querystring: string): DataTableState {
        const s = qs.parse(querystring) as {
            offset?: string | number;
            limit?: string | number;
            sort?: Record<string, string>;
            [key: string]: unknown;
        };

        const state: DataTableState = {
            first: Number(s.offset ?? 0),
            rows: Number(s.limit ?? 10),
            multiSortMeta: expendSort(s.sort),
            filters: {},
        };
        Object.entries(s).forEach(([k, v]) => {
            if (!['offset', 'limit', 'sort'].includes(k)) {
                state.filters[k] = expendFilters(v);
            }
        });
        return state;
    }

    function expendSort(sorts?: Record<string, string>): SortMeta[] {
        return Object.entries(sorts ?? []).map(([field, order]) => ({
            field,
            order: order === '1' ? 1 : -1,
        }));
    }
}

export interface DataTableStateManager {
    state: DataTableState;
    handlers: {
        onPage: (payload:  PageAction['payload']) => void;
        onFilter: (payload: FilterAction['payload']) => void;
        onSort: (payload: SortAction['payload']) => void;
    };
}
type Action  = SortAction | FilterAction | PageAction | ResetAction

interface ResetAction {
    type:'reset'
    payload: DataTableState
}

interface SortAction{
    type: 'onSort';
    payload : SortMeta []
}

interface FilterAction{
    type: 'onFilter';
    payload: Filters;
}

interface PageAction{
    type :'onPage',
    payload:{first:number,rows:number},
}

type Match = 'startsWith' | 'contains' | 'notContains' | 'endsWith' | 'equals' | 'notEquals' | 'in' | 'notIn' | 'lt' | 'lte' | 'gt' | 'gte' | 'between' | 'dateIs' | 'dateIsNot' | 'dateBefore' | 'dateAfter' | 'custom' | undefined;


interface Filter {
    constraints: {
        matchMode: Match
        value: unknown;
    }[];
    operator: string;
}

type Filters = Record<string, Filter>;

interface SortMeta {
    field: string;
    order: 1 | -1;
}

interface DataTableState {
    first: number;
    rows: number;
    multiSortMeta: SortMeta[];
    filters: Filters;
}

//the object give to backend, make the url looks shorter
interface SanitizedState {
    offset?: number | string;
    limit?: number | string;
    sort?: Record<string, 1 | -1>;
    [key: string]: unknown;
}

const displayTypeToMatch: Record<DisplayType, Match> = {
    textarea: 'startsWith',
    text: 'startsWith',
    lookup: 'startsWith',
    number: 'equals',
    datetime: 'dateIs',
    localDatetime: 'dateIs',
    date: 'dateIs',
    dictionary: 'startsWith',
    dropdown: 'startsWith',
    editTable: 'startsWith',
    editor: 'startsWith',
    file: 'startsWith',
    gallery: 'startsWith',
    image: 'startsWith',
    multiselect: 'startsWith',
    picklist: 'startsWith',
    tree: 'startsWith',
    treeSelect: 'startsWith',
};

/*
to make qs shorter and more readable
convert
id :{ equals:1 , operator: and}
to
{ id: { operator:and constraints: [ matchMode:'equals' value: 1 ] } }
* */

function expendFilters(condition: unknown): Filter {
    const filter: Filter = { operator:'and', constraints: [] };
    if (condition && typeof condition === 'object' && !Array.isArray(condition)) {
        Object.entries(condition).forEach(([matchMode, val]) => {
            if (matchMode === 'operator') {
                filter.operator = String(val);
            } else if (Array.isArray(val)) {
                filter.constraints = filter.constraints ??[];
                val.forEach((v) => filter.constraints!.push({ matchMode: matchMode as Match, value: v }));
            } else {
                filter.constraints = filter.constraints ??[];
                filter.constraints.push({ matchMode: matchMode as Match, value: val });
            }
        });
    }
    return filter;
}

/*
to make qs shorter and more readable
convert
{ id: { operator:and constraints: [ matchMode:'equals' value: 1 ] } }
to
id :{ equals:1 , operator: and}
* */
function flattenFilters(filters: Filters): void {
    Object.values(filters).forEach((item) => {
        const flat: Record<string, unknown[]> = {};
        (item?.constraints??[]).forEach(({ matchMode, value }) => {
            if (matchMode){
                flat[matchMode] = flat[matchMode] ? [...flat[matchMode], value] : [value];
            }
        });
        Object.assign(item, flat);
        // @ts-ignore
        delete item.constraints;
    });
}
