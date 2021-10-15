import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
    priceId: string,
}

type SessionId = {
    data: {
        sessionId: string
    }
}

//Lugares para execução e armazenamento de informações sensiveis
//getServerSideProps (SSR)
//getStaticProps (SSG)
// API routes

export function SubscribeButton( { priceId }: SubscribeButtonProps ) {
    const [session] = useSession()
    
    async function handleSubscribe() {
        if(!session){
            signIn('github')
            return
        }

        try {
            const response:SessionId = await api.post('/subscribe')

            const { sessionId } = response.data
  
             const stripe = await getStripeJs()

            await stripe.redirectToCheckout({ sessionId }) 
        }catch (err) {
            alert(err.message)
        }
    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}