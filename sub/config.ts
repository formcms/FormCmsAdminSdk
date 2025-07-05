let apiBaseURL = "";
let stripeKey = "";

export function setSubBaseUrl(v: string) {
    apiBaseURL = v;
}
export function fullSubUrl (subPath :string){
    return apiBaseURL + subPath
}

export function getStripeKey (){
    return stripeKey;
}

export function setStripeKey (key :string){
    stripeKey = key;
}