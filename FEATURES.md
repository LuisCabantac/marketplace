# Features Documentation

This document provides comprehensive documentation of all features in the Facebook Marketplace Clone application.

## Table of Contents

- [Overview](#overview)
- [User Interface Features](#user-interface-features)
- [Listing Management](#listing-management)
- [Messaging System](#messaging-system)
- [Search and Filtering](#search-and-filtering)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Technical Features](#technical-features)

## Overview

The Facebook Marketplace Clone is a modern web application that provides a platform for users to buy and sell items locally. It features a clean, responsive design inspired by Facebook Marketplace with robust functionality for listing management and user communication.

## User Interface Features

### Layout and Navigation

#### Header Component

- **Location**: `src/components/layout/header.tsx`
- **Features**:
  - Facebook-inspired logo and branding
  - Global search bar with placeholder text
  - Navigation icons (menu, messages, notifications)
  - Real-time message count badge
  - Responsive design for mobile and desktop

#### Sidebar Navigation

- **Location**: `src/components/layout/sidebar.tsx`
- **Features**:
  - Location display ("Quezon City · 65 km")
  - Quick action buttons:
    - Browse all listings
    - Your listings (placeholder)
    - Saved items (placeholder)
    - Recently viewed (placeholder)
  - "Create new listing" button
  - Category browsing with icons
  - Active route highlighting

#### Responsive Design

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoint support**: sm, md, lg, xl screen sizes
- **Adaptive sidebar**: Hidden on mobile, sheet overlay on tablet
- **Touch-friendly**: Large tap targets for mobile interaction

### Theme and Styling

#### Color Scheme

- **Primary**: Facebook blue (#1877F2)
- **Background**: Light gray (#F9FAFB)
- **Cards**: White with subtle shadows
- **Text**: Gray scale (900, 700, 600, 500)

#### Typography

- **Font Family**: Geist Sans (system fallback)
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Font Sizes**: Responsive scaling from sm to 2xl

#### Components

- **Buttons**: Multiple variants (default, ghost, outline)
- **Cards**: Consistent styling with headers and content
- **Forms**: Clean input styling with proper validation states
- **Icons**: Lucide React icon library

## Listing Management

### Browse Listings

#### Home Page

- **Location**: `src/app/page.tsx` → `src/app/home-client.tsx`
- **Features**:
  - Grid layout of listing cards
  - Category filtering
  - Search functionality
  - Responsive card grid (1-4 columns)
  - Loading states and error handling

#### Listing Cards

- **Component**: Used in multiple pages
- **Display Information**:
  - Item image with fallback
  - Title and price
  - Location information
  - Category badge
  - Creation date
- **Interactions**:
  - Click to view details
  - Hover effects
  - Mobile-optimized layout

#### Category Pages

- **Location**: `src/app/category/[slug]/page.tsx`
- **Features**:
  - Category-specific listings
  - Dynamic routing based on category slug
  - Same card layout as home page
  - Breadcrumb navigation

### Create Listings

#### Create Listing Page

- **Location**: `src/app/create/item/page.tsx`
- **Form Fields**:
  - **Title**: Required text input
  - **Description**: Textarea for detailed description
  - **Price**: Number input with currency formatting
  - **Category**: Dropdown selection
  - **Location**: Text input for seller location
  - **Image**: File upload with preview
  - **Seller Email**: Required email input

#### Form Validation

- **Client-side validation**: Real-time feedback
- **Required fields**: Title, price, seller email
- **Email format**: Proper email validation
- **File upload**: Image file type validation
- **Price validation**: Positive number validation

#### Image Upload

- **File handling**: Local file system storage
- **Supported formats**: JPG, JPEG, PNG, WebP
- **File size limits**: Configurable maximum size
- **Preview functionality**: Show selected image before upload
- **Error handling**: Clear error messages for upload failures

### View Listing Details

#### Item Detail Page

- **Location**: `src/app/item/[id]/page.tsx`
- **Features**:
  - Large image display
  - Complete item information
  - Seller contact details
  - Related items (placeholder)
  - Message form integration

#### Item Information Display

- **Image**: Full-width responsive image
- **Title**: Large, prominent heading
- **Price**: Formatted currency display
- **Description**: Full text with proper formatting
- **Category**: Linked category badge
- **Location**: Seller location with icon
- **Date**: Creation date with relative formatting
- **Seller**: Email contact information

## Messaging System

### Send Messages

#### Message Form Component

- **Location**: `src/components/ui/message-form.tsx`
- **Features**:
  - Always visible on item detail pages
  - Buyer email input field
  - Message textarea
  - Form validation and error handling
  - Success confirmation with auto-close
  - Loading states during submission

#### Message Validation

- **Required fields**: Buyer email, message text
- **Email format**: Proper email validation
- **Message length**: Minimum/maximum character limits
- **Spam prevention**: Basic rate limiting

#### Success Feedback

- **Visual confirmation**: Green checkmark icon
- **Success message**: "Message sent successfully!"
- **Auto-clear**: Form fields reset after submission
- **Auto-close**: Success state disappears after 2 seconds

### View Messages

#### Messages Page

- **Location**: `src/app/messages/page.tsx`
- **Features**:
  - All conversations grouped by listing
  - Message thread display
  - Chronological message ordering
  - Responsive layout for mobile and desktop

#### Message Display

- **Conversation grouping**: Messages grouped by listing
- **Message cards**: Individual message display
- **Timestamp**: Relative time formatting
- **Participant info**: Buyer and seller identification
- **Message content**: Full message text display

#### Message Count System

- **Real-time counting**: Automatic count updates
- **Badge display**: Header and sidebar indicators
- **Batch processing**: Efficient count calculation
- **Periodic refresh**: Regular count updates (60 seconds)
- **Context integration**: Global message count state

### Message Count Features

#### useMessageCount Hook

- **Location**: `src/hooks/useMessageCount.ts`
- **Features**:
  - Fetches total message count across all listings
  - Batch processing to avoid API overload
  - Periodic refresh (60-second intervals)
  - Error handling and fallback states
  - Increment function for real-time updates

#### MessageContext

- **Location**: `src/contexts/MessageContext.tsx`
- **Provides**:
  - Global message count state
  - Loading state management
  - Increment function for immediate updates
  - Context provider for app-wide access

#### Count Display

- **Header badge**: Red circular badge with count
- **Sidebar integration**: Count display in navigation
- **Auto-update**: Increments when messages sent
- **99+ display**: Shows "99+" for large counts

## Search and Filtering

### Global Search

- **Location**: Header search bar
- **Features** (Placeholder):
  - Search across all listings
  - Auto-complete suggestions
  - Search history
  - Advanced filtering options

### Category Filtering

- **Category List**: Predefined marketplace categories
- **Navigation**: Sidebar category links
- **Dynamic routing**: `/category/[slug]` pages
- **Category Icons**: Visual category identification

### Categories Available

1. **Electronics**: Phones, computers, gadgets
2. **Vehicles**: Cars, motorcycles, bicycles
3. **Home & Garden**: Furniture, appliances, decor
4. **Clothing**: Fashion, accessories, shoes
5. **Sports**: Equipment, outdoor gear
6. **Books**: Literature, textbooks, magazines
7. **Toys & Games**: Children's toys, board games
8. **Music**: Instruments, audio equipment
9. **Other**: Miscellaneous items

## API Endpoints

### Listings API

#### GET /api/listings

- **Purpose**: Fetch all listings with optional filtering
- **Query Parameters**:
  - `category`: Filter by category
  - `search`: Search term
  - `limit`: Number of results
  - `offset`: Pagination offset
- **Response**: Array of listing objects
- **Caching**: Configurable cache headers

#### GET /api/listings/[id]

- **Purpose**: Fetch specific listing by ID
- **Parameters**: Listing ID in URL
- **Response**: Single listing object
- **Error handling**: 404 for non-existent listings

#### POST /api/listings

- **Purpose**: Create new listing
- **Body**: Listing data (title, description, price, etc.)
- **Validation**: Server-side input validation
- **Response**: Created listing object with generated ID

### Messages API

#### GET /api/messages

- **Purpose**: Fetch messages with optional filtering
- **Query Parameters**:
  - `listing_id`: Filter by listing
  - `buyer_email`: Filter by buyer
  - `seller_email`: Filter by seller
- **Response**: Array of message objects
- **Sorting**: Chronological order (newest first)

#### POST /api/messages

- **Purpose**: Send new message
- **Body**: Message data (listing_id, buyer_email, seller_email, message)
- **Validation**: Input validation and spam prevention
- **Response**: Created message object

### Upload API

#### POST /api/upload

- **Purpose**: Upload image files
- **Body**: FormData with image file
- **File validation**: Type and size checks
- **Storage**: Local file system (configurable)
- **Response**: File URL and metadata

### Seed API

#### POST /api/seed

- **Purpose**: Populate database with sample data
- **Features**: Development and testing data
- **Safety**: Protected for development environments
- **Response**: Success confirmation and counts

## Database Schema

### Listings Table

```sql
CREATE TABLE listings (
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
```

### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

- **Listings**: category, seller_email, created_at
- **Messages**: listing_id, buyer_email, seller_email

### Row Level Security

- **Enabled**: Both tables have RLS enabled
- **Policies**: Allow all operations for anonymous users (development)
- **Future**: User-specific policies for production

## Technical Features

### Next.js App Router

- **App Directory**: Modern Next.js 13+ structure
- **Server Components**: Default server-side rendering
- **Client Components**: Marked with "use client"
- **Dynamic Routes**: File-based routing with parameters
- **API Routes**: Server-side API endpoints

### TypeScript Integration

- **Strict Mode**: Full TypeScript strict mode enabled
- **Type Safety**: Complete type coverage
- **Interfaces**: Well-defined data structures
- **Generic Types**: Reusable type definitions

### State Management

- **React Context**: Global state for message count
- **Custom Hooks**: Reusable stateful logic
- **Server State**: API data fetching and caching
- **Local State**: Component-specific state

### Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Bundle Analysis**: Build-time optimization
- **Caching**: API response caching
- **Lazy Loading**: Component and image lazy loading

### Error Handling

- **API Errors**: Structured error responses
- **Client Errors**: User-friendly error messages
- **Validation Errors**: Real-time form validation
- **Network Errors**: Retry mechanisms and fallbacks
- **404 Handling**: Custom not found pages

### Security Features

- **Input Validation**: Server and client-side validation
- **SQL Injection**: Parameterized queries
- **XSS Prevention**: React's built-in protection
- **File Upload**: Secure file handling
- **Rate Limiting**: API request throttling (configurable)

### Accessibility

- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG compliant color schemes
- **Focus Management**: Proper focus indicators

### Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation
- **Polyfills**: Automatic polyfill injection

---

For more technical details, see the [Development Guide](./DEVELOPMENT_GUIDE.md).
