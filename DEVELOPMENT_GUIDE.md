# Development Guide

This guide covers the development workflow, architecture decisions, coding standards, and best practices for the Facebook Marketplace Clone project.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [API Development](#api-development)
- [Database Management](#database-management)
- [Testing Strategy](#testing-strategy)
- [Performance Guidelines](#performance-guidelines)
- [Deployment Process](#deployment-process)
- [Contributing Guidelines](#contributing-guidelines)

## Development Workflow

### Getting Started

1. **Setup Development Environment**

   ```bash
   # Clone and setup
   git clone <repository-url>
   cd marketplace
   npm install
   cp .env.example .env.local
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open Development Tools**
   - Browser: [http://localhost:3000](http://localhost:3000)
   - React DevTools
   - Browser DevTools
   - VS Code or preferred editor

### Daily Development Process

1. **Pull Latest Changes**

   ```bash
   git pull origin main
   npm install  # If package.json changed
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Development Cycle**

   - Write code
   - Test locally
   - Run linting: `npm run lint`
   - Check types: `npm run type-check`
   - Commit changes

4. **Before Pushing**

   ```bash
   # Run all checks
   npm run build
   npm run lint
   npm run type-check

   # Commit and push
   git add .
   git commit -m "feat: descriptive commit message"
   git push origin feature/your-feature-name
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking

# Database
npm run db:migrate       # Run database migrations (if configured)
npm run db:seed          # Seed database with test data
```

## Project Architecture

### Directory Structure

```
marketplace/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── listings/      # Listings endpoints
│   │   │   ├── messages/      # Messages endpoints
│   │   │   ├── upload/        # File upload endpoint
│   │   │   └── seed/          # Database seeding
│   │   ├── category/          # Category pages
│   │   │   └── [slug]/        # Dynamic category routes
│   │   ├── create/            # Create listing flow
│   │   │   └── item/          # Create item page
│   │   ├── item/              # Item detail pages
│   │   │   └── [id]/          # Dynamic item routes
│   │   ├── messages/          # Messages page
│   │   ├── seed/              # Database seeding page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/               # Base UI components
│   │   │   ├── button.tsx     # Button component
│   │   │   ├── card.tsx       # Card components
│   │   │   ├── input.tsx      # Input components
│   │   │   ├── message-form.tsx # Message form
│   │   │   └── ...            # Other UI components
│   │   └── layout/           # Layout components
│   │       ├── header.tsx     # Main header
│   │       ├── sidebar.tsx    # Navigation sidebar
│   │       └── conditional-sidebar.tsx
│   ├── contexts/             # React contexts
│   │   └── MessageContext.tsx # Message count context
│   ├── hooks/                # Custom React hooks
│   │   └── useMessageCount.ts # Message count hook
│   ├── lib/                  # Utility libraries
│   │   ├── api.ts            # API client functions
│   │   ├── categories.ts     # Category definitions
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript definitions
│       └── database.ts       # Database type definitions
├── public/                   # Static assets
│   ├── uploads/             # Uploaded images
│   └── *.svg               # Icon files
├── database/               # Database schema and migrations
├── docs/                   # Documentation
└── config files           # Various config files
```

### Architectural Decisions

#### 1. Next.js App Router

- **Why**: Modern Next.js architecture with better performance
- **Benefits**: Server components, improved routing, better SEO
- **Trade-offs**: Learning curve, bleeding edge features

#### 2. TypeScript

- **Why**: Type safety and better developer experience
- **Benefits**: Compile-time error detection, better IDE support
- **Trade-offs**: Additional build complexity

#### 3. Supabase

- **Why**: Rapid development, built-in authentication, real-time features
- **Benefits**: Managed database, automatic API generation, real-time subscriptions
- **Trade-offs**: Vendor lock-in, potential cost at scale

#### 4. Tailwind CSS

- **Why**: Utility-first approach, consistent design system
- **Benefits**: Fast development, small bundle size, consistent spacing
- **Trade-offs**: Learning curve, verbose class names

#### 5. Radix UI

- **Why**: Accessible, unstyled components
- **Benefits**: Accessibility out of the box, customizable styling
- **Trade-offs**: Larger bundle size, complex API for some components

## Coding Standards

### TypeScript Guidelines

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface Listing {
  id: string;
  title: string;
  price: number;
  seller_email: string;
}

// Use type aliases for unions and primitives
type Status = "active" | "inactive" | "pending";
type ID = string;

// Use generics for reusable types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
```

#### Function Signatures

```typescript
// Prefer explicit return types for public functions
export async function getListings(params?: {
  category?: string;
  limit?: number;
}): Promise<Listing[]> {
  // Implementation
}

// Use proper error types
export function processPayment(amount: number): Promise<void> {
  // Can throw PaymentError
}
```

### React Component Guidelines

#### Component Structure

```typescript
// 1. Imports (external libs first, then internal)
import React from "react";
import { Button } from "@/components/ui/button";

// 2. Types and interfaces
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component definition
export function MyComponent({ title, onSubmit }: Props) {
  // 4. Hooks (in order: state, effects, custom hooks)
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect logic
  }, []);

  // 5. Event handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handler logic
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
}
```

#### Naming Conventions

- **Components**: PascalCase (`MessageForm`, `ListingCard`)
- **Files**: kebab-case (`message-form.tsx`, `listing-card.tsx`)
- **Functions**: camelCase (`handleSubmit`, `fetchListings`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`Listing`, `ApiResponse`)

### CSS and Styling

#### Tailwind Usage

```typescript
// Prefer utility classes
<div className="bg-white rounded-lg shadow-md p-6">

// Use consistent spacing scale
<div className="mb-4 px-6 py-3">

// Group related utilities
<button className="
  bg-blue-600 hover:bg-blue-700
  text-white font-medium
  px-4 py-2 rounded-md
  transition-colors duration-200
">
```

#### Custom CSS

```css
/* Only for complex animations or global styles */
.custom-animation {
  @apply transition-all duration-300 ease-in-out;
}

/* Use CSS custom properties for theme values */
:root {
  --color-primary: #1877f2;
  --border-radius: 0.5rem;
}
```

## Component Guidelines

### UI Components

#### Design Principles

1. **Composition over Configuration**: Small, composable components
2. **Accessibility First**: ARIA labels, keyboard navigation
3. **Responsive Design**: Mobile-first approach
4. **Consistent API**: Similar props across components

#### Component Categories

##### 1. Base Components (`components/ui/`)

- **Purpose**: Fundamental building blocks
- **Examples**: Button, Input, Card, Badge
- **Guidelines**:
  - No business logic
  - Highly reusable
  - Well-documented props
  - Accessibility built-in

##### 2. Composite Components

- **Purpose**: Combinations of base components
- **Examples**: MessageForm, ListingCard
- **Guidelines**:
  - Encapsulate related functionality
  - Accept business data as props
  - Handle local state and events

##### 3. Layout Components (`components/layout/`)

- **Purpose**: Page structure and navigation
- **Examples**: Header, Sidebar, Footer
- **Guidelines**:
  - Handle global state
  - Manage routing and navigation
  - Responsive behavior

##### 4. Page Components (`app/*/page.tsx`)

- **Purpose**: Route-specific logic and layout
- **Guidelines**:
  - Fetch and manage page data
  - Handle URL parameters
  - Compose other components

### State Management

#### Local Component State

```typescript
// Use useState for component-specific state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>({});

// Use useReducer for complex state logic
const [state, dispatch] = useReducer(reducer, initialState);
```

#### Global State (Context)

```typescript
// Create typed context
interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Use custom hook for context consumption
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
```

#### Server State

```typescript
// Use custom hooks for API data
export function useListings(category?: string) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings(category)
      .then(setListings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  return { listings, loading, error };
}
```

## API Development

### Endpoint Structure

#### RESTful Design

```typescript
// GET /api/listings - List all listings
// GET /api/listings/[id] - Get specific listing
// POST /api/listings - Create new listing
// PUT /api/listings/[id] - Update listing
// DELETE /api/listings/[id] - Delete listing
```

#### Request/Response Format

```typescript
// Request
interface CreateListingRequest {
  title: string;
  description?: string;
  price: number;
  category: string;
  seller_email: string;
}

// Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Error Handling

#### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **422**: Unprocessable Entity (business logic errors)
- **500**: Internal Server Error

#### Error Response Format

```typescript
// Consistent error structure
interface ErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>; // Validation errors
}

// Example validation error
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "title": ["Title is required"],
    "price": ["Price must be positive"]
  }
}
```

### Input Validation

#### Server-side Validation

```typescript
import { z } from "zod"; // Recommended validation library

const createListingSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string(),
  seller_email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = createListingSchema.parse(body);
    // Process valid data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          details: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
  }
}
```

## Database Management

### Schema Design

#### Naming Conventions

- **Tables**: Plural nouns (`listings`, `messages`)
- **Columns**: Snake_case (`seller_email`, `created_at`)
- **Indexes**: Descriptive (`idx_listings_category`)

#### Data Types

```sql
-- Use appropriate types
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
price DECIMAL(10,2)
created_at TIMESTAMPTZ DEFAULT NOW()
is_active BOOLEAN DEFAULT true
```

#### Relationships

```sql
-- Use foreign keys for data integrity
listing_id UUID REFERENCES listings(id) ON DELETE CASCADE

-- Add indexes for foreign keys
CREATE INDEX idx_messages_listing_id ON messages(listing_id);
```

### Migrations

#### Migration Files

```sql
-- 001_create_listings.sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  -- ... other columns
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 002_add_listings_indexes.sql
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_created_at ON listings(created_at);
```

#### Migration Strategy

1. **Version Control**: All migrations in version control
2. **Sequential**: Numbered migration files
3. **Rollback**: Include rollback scripts
4. **Testing**: Test migrations on staging first

### Query Optimization

#### Efficient Queries

```typescript
// Use specific columns
const listings = await supabase
  .from("listings")
  .select("id, title, price, image_url")
  .eq("category", category)
  .order("created_at", { ascending: false })
  .limit(20);

// Use proper indexes
const messages = await supabase
  .from("messages")
  .select("*")
  .eq("listing_id", listingId) // Indexed column
  .order("created_at", { ascending: false });
```

## Testing Strategy

### Testing Philosophy

- **Test Pyramid**: More unit tests, fewer integration tests, minimal E2E
- **Test Behavior**: Test what the user sees and does
- **Fast Feedback**: Quick test execution for development

### Unit Testing

```typescript
// Test utility functions
import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats USD currency correctly", () => {
    expect(formatPrice(1299.99)).toBe("$1,299.99");
  });

  it("handles zero price", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});
```

### Component Testing

```typescript
// Test component behavior
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageForm } from "@/components/ui/message-form";

describe("MessageForm", () => {
  it("submits form with valid data", async () => {
    const onSubmit = jest.fn();

    render(
      <MessageForm
        listingId="123"
        sellerEmail="seller@example.com"
        onMessageSent={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Your Email"), {
      target: { value: "buyer@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Interested in this item" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
```

### API Testing

```typescript
// Test API endpoints
import { POST } from "@/app/api/listings/route";

describe("/api/listings", () => {
  it("creates listing with valid data", async () => {
    const request = new Request("http://localhost:3000/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Item",
        price: 100,
        seller_email: "test@example.com",
        category: "electronics",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty("id");
  });
});
```

## Performance Guidelines

### Frontend Performance

#### Bundle Optimization

```typescript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import("./LazyComponent"));

// Use Next.js dynamic imports
const DynamicComponent = dynamic(() => import("./DynamicComponent"), {
  loading: () => <p>Loading...</p>,
});
```

#### Image Optimization

```typescript
// Use Next.js Image component
import Image from "next/image";

<Image
  src="/uploads/image.jpg"
  alt="Product image"
  width={300}
  height={200}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>;
```

#### Caching Strategy

```typescript
// API Response caching
export async function GET() {
  const listings = await getListings();

  return Response.json(listings, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
```

### Database Performance

#### Query Optimization

```sql
-- Use proper indexes
CREATE INDEX CONCURRENTLY idx_listings_category_created_at
ON listings(category, created_at DESC);

-- Use EXPLAIN to analyze queries
EXPLAIN ANALYZE SELECT * FROM listings WHERE category = 'electronics';
```

#### Connection Pooling

```typescript
// Configure Supabase client
const supabase = createClient(url, key, {
  db: {
    schema: "public",
  },
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
  global: {
    headers: { "x-my-custom-header": "my-app-name" },
  },
});
```

## Deployment Process

### Environment Configuration

#### Environment Variables

```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

#### Build Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["your-domain.com"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

### Deployment Steps

#### 1. Pre-deployment Checklist

- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] ESLint checks passed
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build succeeds locally

#### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 3. Manual Deployment

```bash
# Build application
npm run build

# Start production server
npm start

# Or use PM2
pm2 start npm --name "marketplace" -- start
```

### Monitoring and Maintenance

#### Health Checks

```typescript
// Create health check endpoint
export async function GET() {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from("listings")
      .select("count")
      .limit(1);

    if (error) throw error;

    return Response.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    return Response.json(
      {
        status: "unhealthy",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

#### Error Tracking

```typescript
// Configure error reporting
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Report to error tracking service
});
```

## Contributing Guidelines

### Code Review Process

#### Before Submitting PR

1. **Self Review**: Review your own code first
2. **Testing**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Description**: Write clear PR description

#### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] No console errors

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### Git Workflow

#### Commit Messages

```bash
# Format: type(scope): description
feat(api): add message count endpoint
fix(ui): resolve mobile layout issue
docs(readme): update setup instructions
refactor(hooks): extract message count logic
test(api): add listing creation tests
```

#### Branch Naming

```bash
feature/message-system
bugfix/mobile-layout
hotfix/security-vulnerability
docs/api-documentation
```

### Code Standards Enforcement

#### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

#### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build
```

---

This development guide should be updated as the project evolves and new patterns emerge. Always prioritize code quality, maintainability, and user experience in development decisions.
