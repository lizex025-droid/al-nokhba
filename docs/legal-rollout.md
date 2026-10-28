# Legal policy rollout — 2026-10-29

This change is prepared for review. It is **not** a record of a production deployment.

## Scope agreed with the site owner

- Add Arabic Privacy Policy (`/privacy`) and Terms (`/terms`) pages dated 29 October 2026, using `bseisoahed@gmail.com` for notices and rights complaints.
- Keep existing university references, branding, admissions calculator, and faculty directory unchanged.
- Include the exact educational-material copyright declaration only in privacy-policy section 4. The join form links to the policy and mentions the declaration; the terms refer to that section without duplicating its wording.
- Require an initially unchecked policy-acceptance checkbox on help and join requests.
- Record policy version and server-side acceptance timestamp in the existing Supabase request JSONB; no database schema change is needed.

## Confirmed release decisions

1. Identify the operator publicly as **النخبة**, with `bseisoahed@gmail.com` as the privacy and copyright contact. The owner did not authorize displaying a personal legal name in the policy.
2. Preserve existing request and rights records rather than schedule an automatic purge. Manual review, legally required erasure and valid rights requests still apply; do not promise indefinite retention after the legal purpose expires.
3. The owner requested direct publication to the production branch without a pull request, subject to verification of deployment access and the actual production endpoint.

## Safe deployment order after approval

1. Ensure the team knows how to handle manual erasure requests in both Supabase and Telegram, while preserving records required for a live legal claim.
2. Deploy the updated `supabase/functions/nokhba-submit/index.ts` and verify required-consent enforcement after the frontends are live. If `workers/nokhba-form-relay.js` is active, update that Worker too.
3. Deploy the frontend to *both* Cloudflare Pages and Vercel where accessible, check `/privacy`, `/terms`, and submit one test help and one test join form with explicit consent. Inspect the private request record for `legalConsentVersion` and `legalConsentAcceptedAt`.
4. Both endpoint source files now reject missing or mismatched consent unconditionally. Keep the accepted version aligned with `LEGAL_VERSION` in `src/lib/legalPolicies.ts`. Previously cached form clients must reload before submitting requests.
5. Verify copyright-removal contact, access controls, manual rights-request response process, and periodic checks that records still have a lawful purpose.

## Important legal limitation

Applicant acceptance does not itself prove that a professor, publisher, or other actual copyright holder authorized public redistribution. A checkbox cannot eliminate every legal obligation of the operator. Review and remove disputed files promptly where warranted, and obtain Jordanian legal review before reliance on these policies.
