# Setup Guide

This guide will walk you through setting up the Facebook Marketplace Clone from scratch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Application Configuration](#application-configuration)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or any preferred editor

### Accounts Required

- **Supabase Account**: For database and authentication
- **GitHub Account**: For version control (optional)
- **Vercel Account**: For deployment (optional)

## Environment Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd marketplace

# Or if downloading as ZIP
unzip marketplace.zip
cd marketplace
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the following environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
UPLOAD_DIR=./public/uploads

# Optional: Analytics and Monitoring
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Database Configuration

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: marketplace-clone
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
4. Wait for project creation (2-3 minutes)

### 2. Get Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Set Up Database Schema

#### Option A: Using Supabase Dashboard

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy and paste the following schema:

```sql
-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  seller_email TEXT NOT NULL,
  category TEXT,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_seller_email ON listings(seller_email);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_buyer_email ON messages(buyer_email);
CREATE INDEX IF NOT EXISTS idx_messages_seller_email ON messages(seller_email);

-- Enable Row Level Security (RLS)
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for listings (allow all operations for now)
CREATE POLICY "Allow all operations on listings"
ON listings FOR ALL
TO anon
USING (true)
WITH CHECK (true);

-- Create policies for messages (allow all operations for now)
CREATE POLICY "Allow all operations on messages"
ON messages FOR ALL
TO anon
USING (true)
WITH CHECK (true);
```

4. Click **Run** to execute the SQL

#### Option B: Using Migration Files

If you have migration files in the `database/` folder:

```bash
# Apply migrations using Supabase CLI (if installed)
supabase db push

# Or manually run each migration file in Supabase Dashboard
```

### 4. Set Up Storage (Optional)

If using Supabase storage for images:

1. Go to **Storage** in Supabase Dashboard
2. Create a new bucket named `marketplace-images`
3. Set bucket to **Public**
4. Update your API endpoints to use Supabase storage

## Application Configuration

### 1. Create Upload Directory

```bash
# Create uploads directory for local file storage
mkdir -p public/uploads
touch public/uploads/.gitkeep
```

### 2. Configure Next.js

The application is already configured with the following:

- **TypeScript**: Strict mode enabled
- **Tailwind CSS**: Custom configuration
- **ESLint**: Extended configuration
- **Prettier**: Code formatting (optional)

### 3. Verify Configuration

```bash
# Check if all environment variables are loaded
npm run dev

# Check if TypeScript compiles
npm run build
```

## Development Setup

### 1. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 2. Seed Database (Optional)

To populate your database with sample data:

1. Navigate to [http://localhost:3000/seed](http://localhost:3000/seed)
2. Click "Seed Database" button
3. Wait for completion message

### 3. Test Core Features

1. **Browse Listings**: Visit homepage
2. **Create Listing**: Go to `/create/item`
3. **View Item**: Click on any listing
4. **Send Message**: Use message form on item page
5. **View Messages**: Go to `/messages`

### 4. Development Workflow

```bash
# Start development
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm run start
```

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**:

   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:

   - In Vercel project settings
   - Add all environment variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your domain

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Option 2: Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "marketplace" -- start
```

### Option 3: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t marketplace .
docker run -p 3000:3000 marketplace
```

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Error

```bash
Error: Invalid API key or URL
```

**Solution**:

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check if Supabase project is active
- Ensure API keys are copied correctly

#### 2. Database Permission Error

```bash
Error: permission denied for table listings
```

**Solution**:

- Check Row Level Security policies
- Verify table creation was successful
- Ensure anon role has proper permissions

#### 3. File Upload Error

```bash
Error: ENOENT: no such file or directory, open 'public/uploads/...'
```

**Solution**:

- Create uploads directory: `mkdir -p public/uploads`
- Check file permissions
- Verify `UPLOAD_DIR` environment variable

#### 4. Build Errors

```bash
Type error: Property 'X' does not exist on type 'Y'
```

**Solution**:

- Run `npm run type-check` to see all TypeScript errors
- Check if all dependencies are installed
- Verify import paths are correct

#### 5. Environment Variable Not Found

```bash
Error: Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution**:

- Ensure `.env.local` file exists in root directory
- Check variable names match exactly
- Restart development server after changes

### Getting Help

1. **Check Console**: Browser dev tools console for client-side errors
2. **Check Terminal**: Server logs for backend errors
3. **Database Logs**: Supabase dashboard for database errors
4. **Network Tab**: Check API requests and responses

### Performance Optimization

1. **Database Indexes**: Ensure proper indexes are created
2. **Image Optimization**: Use Next.js Image component
3. **Bundle Analysis**: Run `npm run analyze` (if configured)
4. **Caching**: Implement proper caching strategies

### Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Use read-only keys where possible
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Implement API rate limiting
5. **CORS**: Configure proper CORS policies

---

For additional help, refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
