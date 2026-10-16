# Security Specification: Vibe Hub

## 1. Data Invariants
1. **Public Read Integrity**: Published articles and public comments are readable by all users to ensure uninterrupted reader experience on the blog.
2. **PII Isolation**: Newsletter subscriber emails (`/subscribers/{subscriberId}`) are strictly isolated; only authenticated admin can list, read, or export subscriber records.
3. **Identity & Comment Integrity**: When creating comments, verified authenticated users or guest comment payloads must validate string lengths, valid article references, and prevent arbitrary field injection (`hasOnly`).
4. **Administrative Exclusivity**: Document mutation on `/articles`, `/settings`, and admin actions are strictly reserved for the designated admin (`antonioestefanoprando@gmail.com`).
5. **Counter Updates**: Public view counts or like counters on articles can only be incremented safely through strictly bounded diffs (`affectedKeys().hasOnly(['views'])` or `affectedKeys().hasOnly(['likes'])`).

## 2. The "Dirty Dozen" Payloads
1. **Payload 1 (Shadow Update)**: User tries to add `isAdmin: true` into a comment or subscriber document. Expected: `PERMISSION_DENIED`.
2. **Payload 2 (Unverified Email Spoof)**: Unverified account claims `antonioestefanoprando@gmail.com` with `email_verified: false` to edit articles. Expected: `PERMISSION_DENIED`.
3. **Payload 3 (PII Blanket Read)**: Non-admin tries to read `/subscribers`. Expected: `PERMISSION_DENIED`.
4. **Payload 4 (Oversized Content Injection)**: Comment with 200,000 characters payload. Expected: `PERMISSION_DENIED`.
5. **Payload 5 (Path Variable Poisoning)**: Malicious document ID containing illegal symbols or path escapes `../bad_id`. Expected: `PERMISSION_DENIED`.
6. **Payload 6 (Admin Impersonation in Articles)**: Non-admin attempting to delete an article. Expected: `PERMISSION_DENIED`.
7. **Payload 7 (Illegal Article Status Transition)**: Attempting to update article fields other than likes/views as a non-admin. Expected: `PERMISSION_DENIED`.
8. **Payload 8 (Invalid Newsletter Frequency)**: Subscriber payload with invalid enum `frequency: "hourly"`. Expected: `PERMISSION_DENIED`.
9. **Payload 9 (Comment Orphanage)**: Posting comment with an invalid non-string or oversized `articleId`. Expected: `PERMISSION_DENIED`.
10. **Payload 10 (Settings Tampering)**: Non-admin trying to overwrite `/settings/branding`. Expected: `PERMISSION_DENIED`.
11. **Payload 11 (Negative Likes/Views Exploitation)**: Manipulating counter fields with unexpected object data. Expected: `PERMISSION_DENIED`.
12. **Payload 12 (Catch-all Leak)**: Attempting to query arbitrary unmapped collection `/internal_secrets`. Expected: `PERMISSION_DENIED`.
