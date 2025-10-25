# Social Media Manager

A comprehensive Next.js application that integrates Clerk authentication, Ayrshare social media management, Stripe payments, and Supabase database to provide a unified social media management platform.

## Features

- 🔐 **Authentication**: Secure user authentication with Clerk
- 📱 **Social Media Management**: Post to multiple platforms using Ayrshare API
- 💳 **Payments**: Stripe integration for subscription management
- 📊 **Analytics**: Track social media performance
- 🗄️ **Database**: Supabase for data storage and real-time features
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Social Media**: Ayrshare API
- **Payments**: Stripe
- **Database**: Supabase
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account
- Supabase account
- Stripe account
- Ayrshare account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-media-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   Required environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Ayrshare
   AYRSHARE_API_KEY=your_ayrshare_api_key
   AYRSHARE_API_URL=https://app.ayrshare.com/api

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Database Setup

1. **Create a new Supabase project**
2. **Run the migration**
   ```sql
   -- Copy and run the SQL from supabase/migrations/001_initial_schema.sql
   ```

### Service Setup

#### Clerk Setup
1. Create a new Clerk application
2. Configure authentication settings
3. Add your domain to allowed origins
4. Copy the API keys to your environment variables

#### Supabase Setup
1. Create a new Supabase project
2. Run the database migration
3. Enable Row Level Security (RLS)
4. Copy the project URL and API keys

#### Stripe Setup
1. Create a Stripe account
2. Create products and prices for your subscription plans
3. Set up webhook endpoints pointing to `/api/webhooks/stripe`
4. Copy the API keys and webhook secret

#### Ayrshare Setup
1. Sign up for an Ayrshare account
2. Get your API key from the dashboard
3. Connect your social media accounts
4. Copy the API key to your environment variables

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
social-media-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   ├── stripe/
│   │   │   ├── ayrshare/
│   │   │   └── users/
│   │   ├── dashboard/
│   │   │   ├── posts/
│   │   │   ├── analytics/
│   │   │   ├── accounts/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   └── ayrshare.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local
└── README.md
```

## API Endpoints

### Authentication
- All dashboard routes are protected by Clerk middleware

### Social Media
- `POST /api/ayrshare/posts` - Create new posts
- `GET /api/ayrshare/posts` - Get user's posts

### Payments
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### User Management
- `POST /api/users/sync` - Sync Clerk user with Supabase

## Database Schema

### Tables
- `users` - User profiles linked to Clerk
- `subscriptions` - Stripe subscription data
- `social_accounts` - Connected social media accounts
- `posts` - User's social media posts
- `post_analytics` - Analytics data for posts
- `webhooks` - Stripe webhook events

## Features Overview

### Dashboard
- **Posts**: Create and schedule social media posts
- **Analytics**: View performance metrics across platforms
- **Accounts**: Manage connected social media accounts
- **Settings**: Configure user preferences and billing

### Social Media Management
- Post to multiple platforms simultaneously
- Schedule posts for optimal engagement
- Auto-schedule based on platform algorithms
- Media attachment support

### Analytics
- Real-time performance metrics
- Cross-platform comparison
- Engagement rate tracking
- Historical data visualization

### Billing
- Stripe-powered subscription management
- Multiple plan tiers
- Automatic billing
- Webhook-based status updates

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy**

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `AYRSHARE_API_KEY` | Ayrshare API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Content calendar
- [ ] AI-powered content suggestions
- [ ] Multi-language support
- [ ] Mobile app
- [ ] White-label solutions
"# stunning-winner" 
"# stunning-winner" 
