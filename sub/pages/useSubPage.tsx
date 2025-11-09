import {useSubscriptionPrices} from "../services/prices";
import {createSubSession, useSubBilling, useSubsKey} from "../services/sub";
import {loadStripe} from "@stripe/stripe-js";


export function useSubPage() {
    const {error:pricesErr, data: prices} = useSubscriptionPrices();
    const {error:billingError, data: billing} = useSubBilling();
    const {error:subsKeyError, data: subsKey} = useSubsKey();
    return {prices, pricesErr, billing, billingError, subscribe};

    async function subscribe(priceId:string) {
        const {data:session, } = await createSubSession(priceId)
        const stripe = await loadStripe(subsKey??"");
        if (stripe && session){
            await stripe.redirectToCheckout({sessionId:session.id});
        }
    }
}