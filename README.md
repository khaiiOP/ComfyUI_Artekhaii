# Artekhaii AI Studio

A responsive React + Vite prototype for an AI media-creation workspace.

## Run locally

```bash
npm install
npm run dev
```

## Included prototype flows

- Tool selection for image, video, animation, character, enhancement, and effects workflows.
- Prompt interface with a demo generation queue message.
- Local demo profile and mock subscription plans; demo plans add sample credits in the current browser.
- The configured admin email `artekhaiidesign@gmail.com` displays a 1,000,000-credit demo allowance.

## Important: demo only

Authentication, plan activation, and credits currently use browser `localStorage`. This is intentionally a UI prototype: it is not secure authentication, a real payment, a real subscription, or a trustworthy credit ledger. The admin email check is visible in frontend code and can be spoofed. **Do not use these client-side values for production access or billing.**

Before launch, add a server-side authentication provider, a database-backed credit ledger and generation jobs, and a payment provider with signed webhook verification. Grant the admin allowance only after verifying the account server-side. Connect image/video generation through server-side provider adapters so API keys are never shipped to browsers.
