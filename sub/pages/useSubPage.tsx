import {useSubscriptionPrices} from "../services/prices";
import {createSubSession, useSubBilling} from "../services/sub";
import {loadStripe} from "@stripe/stripe-js";
import {getStripeKey} from "../config";


export function useSubPage() {
    const {error:pricesErr, data: prices} = useSubscriptionPrices()
    const {error:billingError, data: billing} = useSubBilling()
    return {prices, pricesErr, billing, billingError, subscribe};

    async   function subscribe(priceId:string) {
        const {data:session, } = await createSubSession(priceId)
        const stripe = await loadStripe(getStripeKey());
        if (stripe && session){
            await stripe.redirectToCheckout({sessionId:session.id});
        }
    }
}