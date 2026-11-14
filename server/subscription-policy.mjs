// Authorization decision core. Not wired into production until payment/auth backend is validated.
// Accept only server-verified account/subscription data. Never trust client-sent status or role.
export function authorizeSubscription({account,subscriptions,feature,now=new Date()}){
  if(!account || typeof account.userId!=='string' || !account.emailVerified)
    return {allowed:false,reason:'login_required'};
  if(account.disabled===true)return {allowed:false,reason:'account_disabled'};
  const instant=new Date(now).getTime();
  if(!Number.isFinite(instant))return {allowed:false,reason:'invalid_clock'};
  const applicable=(Array.isArray(subscriptions)?subscriptions:[]).filter(s=>{
    if(s?.userId!==account.userId || !['active','trialing'].includes(s.status))return false;
    const from=new Date(s.startsAt).getTime(),to=new Date(s.endsAt).getTime();
    return Number.isFinite(from)&&Number.isFinite(to)&&from<=instant&&to>instant;
  });
  const subscription=applicable.find(s=>Array.isArray(s.features)&&s.features.includes(feature));
  return subscription ? {allowed:true,reason:'active_subscription',subscriptionId:subscription.id}
    : {allowed:false,reason:applicable.length?'feature_not_in_plan':'subscription_required'};
}
