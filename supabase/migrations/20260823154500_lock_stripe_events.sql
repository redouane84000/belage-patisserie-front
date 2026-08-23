revoke all on public.stripe_events from anon, authenticated, public;
revoke all on function public.claim_stripe_event(text, text) from anon, authenticated, public;
grant execute on function public.claim_stripe_event(text, text) to service_role;
