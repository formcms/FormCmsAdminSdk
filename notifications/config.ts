let apiBaseURL = "";
export function setNotificationBaseUrl(v: string) {
    apiBaseURL = v;
}
export function fullNotificationUrl (subPath :string){
    return apiBaseURL + subPath
}