# Website Blueprint Builder

Website Blueprint Builder is a production-ready SaaS starter built with Next.js 14, TypeScript, Tailwind CSS, shadcn-style UI components, and Supabase. It helps users collect website requirements through a flashcard-style wizard and generate a high-quality master prompt they can run manually in AI systems.

## Features

- Marketing landing page with hero, feature cards, CTA, and footer
- Supabase Auth with Google sign-in and verified email/password login
- Email verification flow with resend verification support
- Strong password validation and secure password reset flow
- Flashcard requirement collection flow with progress tracking
- PostgreSQL project persistence in Supabase
- Dashboard to view, copy, and delete saved prompts
- Project detail page for reviewing full prompt output
- Vercel-compatible deployment setup

## Tech Stack

- Next.js 14 App Router (patched 14.2.35 release line)
- TypeScript
- Tailwind CSS
- shadcn-inspired UI component setup
- Supabase Auth + PostgreSQL
- Vercel deployment

## Environment Variables

Create a `.env.local` file using `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Supabase Auth Setup

1. Create a new Supabase project.
2. In Authentication > URL Configuration, set:
   - Site URL: your production app URL
   - Redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.com/auth/callback`
3. In Authentication > Providers, enable Email and Google.
4. In Google Cloud Console, create OAuth web credentials and add the Supabase Google callback URL shown in Supabase provider settings.
5. Keep email confirmation enabled for production.
6. Align Supabase password settings with the app policy: 10+ chars, uppercase, lowercase, number, symbol.

## Deployment Guide for Vercel

1. Push this project to your Git provider.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.local`.
4. Set `NEXT_PUBLIC_APP_URL` to your final production domain.
5. Deploy and then update Supabase Auth redirect URLs with the production callback URL.

## Monitoring and Launch Readiness

Before launch, review:

- Supabase Auth logs for verification, OAuth, and reset-email behavior
- Vercel function logs for callback and auth action failures
- analytics/error monitoring such as Sentry, PostHog, or Vercel Analytics
- Terms of Service and Privacy Policy placeholder pages, replacing them with legal copy
- metadata, preview image, and favicon/app icon assets

## Key Files

- [app/actions.ts](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/app/actions.ts)
- [app/auth/callback/route.ts](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/app/auth/callback/route.ts)
- [components/auth-form.tsx](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/components/auth-form.tsx)
- [components/reset-password-form.tsx](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/components/reset-password-form.tsx)
- [lib/auth.ts](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/lib/auth.ts)
- [db/schema.sql](C:/Users/user/OneDrive/Desktop/Tech/Demo websited/Web_builder/db/schema.sql)