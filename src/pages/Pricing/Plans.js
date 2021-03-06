import React from 'react'
import { Query } from 'react-apollo'
import cx from 'classnames'
import Toggle from '@santiment-network/ui/Toggle'
import Plan from './Plan'
import {
  findSanbasePlan,
  getCurrentSanbaseSubscription,
  noBasicPlan
} from '../../utils/plans'
import { USER_SUBSCRIPTIONS_QUERY, PLANS_QUERY } from '../../queries/plans'
import Enterprise from './Enterprise'
import styles from './Plans.module.scss'

const Billing = ({ selected, onClick }) => {
  const isYearSelected = selected === 'year'
  return (
    <>
      <span
        onClick={() => onClick('month')}
        className={cx(
          styles.billing__option,
          !isYearSelected && styles.billing__option_active
        )}
      >
        Bill monthly
      </span>
      <Toggle
        className={styles.billing__toggle}
        isActive={isYearSelected}
        onClick={() => onClick(isYearSelected ? 'month' : 'year')}
      />
      <span
        className={cx(
          styles.billing__option,
          styles.billing__option_year,
          isYearSelected && styles.billing__option_active
        )}
        onClick={() => onClick('year')}
      >
        Bill yearly
        <span className={styles.billing__save}>save 10%!</span>
      </span>
    </>
  )
}

export default ({ id, classes = {} }) => {
  const [billing, setBilling] = React.useState('year')
  return (
    <>
      <div id={id} className={cx(styles.billing, classes.billing)}>
        <Billing selected={billing} onClick={setBilling} />
      </div>
      <Query query={USER_SUBSCRIPTIONS_QUERY} fetchPolicy='network-only'>
        {({ data: { currentUser } = {} }) => {
          const subscription = getCurrentSanbaseSubscription(currentUser)
          const userPlan = subscription && subscription.plan.id
          const isSubscriptionCanceled =
            subscription && subscription.cancelAtPeriodEnd
          return (
            <Query query={PLANS_QUERY}>
              {({ data: { productsWithPlans = [] } = {} }) => {
                const product = productsWithPlans.find(findSanbasePlan)
                if (!product) {
                  return null
                }

                return (
                  <div className={styles.cards}>
                    {product.plans
                      .filter(noBasicPlan)
                      .filter(
                        ({ name, interval }) =>
                          interval === billing || name === 'FREE'
                      )
                      .sort(({ id: a }, { id: b }) => a - b)
                      .map(plan =>
                        plan.name === 'ENTERPRISE' ? (
                          <Enterprise key={plan.id} />
                        ) : (
                          <Plan
                            key={plan.id}
                            {...plan}
                            isLoggedIn={currentUser}
                            billing={billing}
                            product={product}
                            userPlan={userPlan}
                            subscription={subscription}
                            isSubscriptionCanceled={isSubscriptionCanceled}
                          />
                        )
                      )}
                  </div>
                )
              }}
            </Query>
          )
        }}
      </Query>
    </>
  )
}
