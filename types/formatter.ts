
export type Formater = {
    datetime: (v: any) => any
    localDatetime: (v: any) => any
    date: (v: any) => any
    csv: (v: any) => any
    dictionary: (v: any) => any
    default: (v: any) => any
}

export const formater :Formater = {
    datetime: toDatetimeStr,
    localDatetime: utcStrToDatetimeStr,
    date: toDateStr,
    csv: (x:any)=>x.join(','),
    dictionary: (x:any)=> Object.entries(x).map(([k,v])=>(`${k}:${v}`)).join(', '),
    default : x =>x
}

export function formatFileSize  (bytes?: number)  {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const toZonelessStr = (date : Date|undefined|null) => {
    if (!date) return null;
    const pad = (num:number) => String(num).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

//str can be 2025-03-18 18:50:22.323 And ISO format 2025-03-18T18:50:22.323
export const toDatetime = (s:string) => {
    return new Date(s.replaceAll(' ', 'T'));
}

export function toDateStr  (s:string)  {
    const d = toDatetime(s);
    return d.toLocaleDateString();
}

export function toDatetimeStr  (s:string|Date)  {
    if (!s) return null;
    const d = typeof(s)==='string' ? toDatetime(s):s;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

export const utcStrToDatetime = (s:string) => {
    s = s.replaceAll(' ', 'T')
    if (!s.endsWith('Z')) {
        s += 'Z';
    }

    return new Date(s);
}

export function utcStrToDatetimeStr  (s:string|Date)  {
    if (!s) return null
    const d = typeof(s) == 'string' ? utcStrToDatetime(s):s;
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
}

export function ArrayToObject(items: any[]){
    return  items.reduce(
        (acc: any, item: any) => {
            if (item.key) acc[item.key] = item.value;
            return acc;
        },
        {}
    );
}