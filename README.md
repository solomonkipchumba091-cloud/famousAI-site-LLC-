# i-DevR Code LLC - FamousAI Site

A modern, production-ready web application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. This project features a robust UI component library (Shadcn/UI), state management with Zustand, and Supabase integration.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd i-devr-code-llc-famousai-site
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Environment Configuration

This project uses environment variables for configuration. You must set these up before running the application.

1. **Local Development**:

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. **Update `.env`**:

   Fill in your specific values.

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > **Security Note**: Never commit your `.env` file to version control. It is already included in `.gitignore`.

### Running Locally

Start the development server:

```bash
npm run dev
```

Access the app at `http://localhost:5173`.

---

## 🛠️ Production Launch Guide

To prepare this application for a production environment, follow these steps.

### 1. Build for Production

Run the build command to generate static assets:

```bash
npm run build
```

This will create a `dist` directory containing:

- Minified HTML/CSS/JS
- Optimized assets
- Hashed filenames for cache busting

### 2. Preview Production Build

Before deploying, strictly test the production build locally:

```bash
npm run preview
```

This serves the contents of the `dist` folder, allowing you to catch any build-specific issues (e.g., missing assets, strict mode behaviors).

### 3. Environment Variables in Production

When deploying to a hosting provider (Vercel, Netlify, AWS, etc.), you **MUST** set the environment variables in their dashboard/configuration settings. Do not rely on the `.env` file for production.

**Required Variables:**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 4. Deployment

#### Option A: Vercel (Recommended)

1. Push your code to a Git provider (GitHub, GitLab, Bitbucket).
2. Import the project in Vercel.
3. Vercel will auto-detect Vite.
4. **Important**: Add the Environment Variables in the "Settings" step before deploying.
5. Click **Deploy**.

#### Option B: Netlify

1. Connect your repository to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add Environment Variables in "Site Settings" > "Build & Deploy" > "Environment".

#### Option C: Traditional Web Server (Nginx/Apache)

1. Run `npm run build`.
2. Upload the contents of the `dist` folder to your server's public web root.
3. **SPA Configuration**: Ensure all requests allow client-side routing.
   - **Nginx Example**:

     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

### 5. Quality & Performance Checklist

- **Linting**: Ensure code quality by running `npm run lint`.
- **SEO**: Verify `index.html` meta tags (Title, Description, OG tags) are accurate for the live site.
- **Assets**: Ensure images are optimized (WebP format recommended).
- **Security Control**:
  - Restrict Supabase Row Level Security (RLS) policies to allow only necessary access.
  - Enable Postgres RLS immediately if not already done.

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Shadcn/UI, etc.)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and library configurations (e.g., supabase.ts)
├── pages/          # Route page components
├── styles/         # Global styles
├── App.tsx         # Main application component
└── main.tsx        # Entry point
```

## 📄 License

Proprietary - i-DevR Code LLC. All rights reserved.
