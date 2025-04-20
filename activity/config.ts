let apiBaseURL = "";
export function setActivityBaseUrl(v: string) {
    apiBaseURL = v;
}
export function fullActivityUrl (subPath :string){
    return apiBaseURL + subPath
}