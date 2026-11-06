This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Homepage hero video

The homepage hero uses its local analytics image as a fallback on mobile and when motion is reduced. To enable the optional desktop video, add a watermark-free MP4 to `public/videos/ism-corporate-hero.mp4` and set `NEXT_PUBLIC_HERO_VIDEO_SRC=/videos/ism-corporate-hero.mp4` in `.env.local`.

## Admin access and email notifications

The Careers Admin Portal uses the server-side `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` settings shown in `.env.local.example`. Keep these values server-only. Career application notifications use Resend with the server-side `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL` settings. Set the server-side `APP_BASE_URL` to the canonical site origin (for example, `https://ismdatatech.com`) to create absolute links in these emails; it defaults to that production origin when unset. The resume download link requires an authenticated Admin Portal session and does not expose a public storage URL. The initial sender is `onboarding@resend.dev`; Resend's onboarding sender is for testing and may restrict recipient addresses until a sending domain is verified. Resend acceptance does not confirm inbox delivery. The contact form continues to use server-side `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`. Application submissions remain successful if an email notification cannot be sent.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
