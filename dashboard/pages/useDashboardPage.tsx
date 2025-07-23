import {useAuditLogDailyCounts} from '../../auditLog/services/auditLog'
import {ActionType} from "../../auditLog/types/auditLog";
import {useActivityCounts, usePageVisitCount, useVisitCounts} from "../../activity/services/activities";

export function useDashboardPage(n:number) {
    const pastDays = getPastDayLabels(n);
    const dataActions = useDailyDataAction(n);
    const activities = useDailyActivity(n);
    const visits  = useDailyVisit(n);
    const {pageNames, pageData} = usePageData(10);
    return {pastDays,activities,dataActions, pageNames, pageData,visits};
}

function usePageData(n:number){
    const {data:pages} = usePageVisitCount(n);
    if (pages) {

        const pageNames = pages?.map(x => x.name);
        const pageData = pages && {
            label: 'Page',
            data: pages.map(x => x.count)
        }
        return {pageNames, pageData};
    }
    return {pageNames: undefined, pageData: undefined};
}

function useDailyVisit(n:number) {
    const {data: authed} = useVisitCounts(n,true);
    const {data: anonymous} = useVisitCounts(n,false);
    const pastDays = getPastDays(n);
    if (authed && anonymous) {
        return [
            {
                label:'Authorized User',
                data: pastDays.map(day =>
                    authed.find(c => dateEqual(c.day, day))?.count ?? 0
                )
            },
            {
                label:'Anonymous User',
                data: pastDays.map(day =>
                    anonymous.find(c => dateEqual(c.day, day))?.count ?? 0
                )
            }
        ]
    }
}

function useDailyActivity(n: number) {
    const {data: dailyActivityCount} = useActivityCounts(n);
    if (dailyActivityCount) {
        const activityTypes = ['view', 'like', 'share', 'save','comment'];
        const pastDays = getPastDays(n);
        return activityTypes.map(activityType => ({
            label: activityType,
            data: pastDays.map(day =>
                dailyActivityCount.find(c => c.activityType === activityType && dateEqual(c.day, day))?.count ?? 0
            )
        }));
    }
}

function useDailyDataAction(n: number) {
    const { data: dailyActionCounts} = useAuditLogDailyCounts(n);
    if (dailyActionCounts) {
        const actions = [ActionType.Create, ActionType.Update, ActionType.Delete];
        const pastDays = getPastDays(n);

        return actions.map(action => ({
            label: action,
            data: pastDays.map(day =>
                dailyActionCounts.find(c => c.action === action && dateEqual(c.day, day))?.count ?? 0
            )
        }));
    }
}

function formatDate(date:Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function dateEqual(d1: string|Date, d2: Date): boolean {
    d1 = typeof d1 === 'string' ? d1 : formatDate(d1);
    return d1 == formatDate(d2);
}

function getPastDays(n: number) {
    const dates: Date[] = [];
    for (let i = n - 1; i >= 0; i--) {
        dates.push(getPastDate(i));
    }
    return dates;
}

function getPastDayLabels(n: number) {
    return getPastDays(n).map(item => item.toLocaleDateString());
}

function getPastDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
}