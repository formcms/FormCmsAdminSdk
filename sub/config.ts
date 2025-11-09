let apiBaseURL = "";

export function setSubBaseUrl(v: string) {
    apiBaseURL = v;
}
export function fullSubUrl (subPath :string){
    return apiBaseURL + subPath
}