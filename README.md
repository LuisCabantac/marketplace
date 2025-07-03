# Marketplace

A modern, full-featured marketplace application built with Next.js 15, TypeScript, and Supabase. This project replicates the core functionality of Facebook Marketplace with a clean, responsive design and real-time messaging capabilities.

## 🚀 Features

- **Browse Listings**: View all marketplace items with category filtering
- **Create Listings**: Post new items for sale with image uploads
- **Search & Filter**: Find items by category, search terms, and location
- **Messaging System**: Real-time messaging between buyers and sellers
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, Facebook-inspired interface using Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Local file system (configurable)
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase account** (for database)

## ⚡ Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd marketplace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials and other required variables.

4. **Set up the database**
   Run the SQL scripts in the `database/` folder in your Supabase dashboard.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [**Setup Guide**](./SETUP.md) - Detailed setup instructions
- [**Features**](./FEATURES.md) - Complete feature documentation
- [**Development Guide**](./DEVELOPMENT_GUIDE.md) - Development workflow and best practices

## 🏗️ Project Structure

```
marketplace/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── api/               # API routes
│   │   ├── category/          # Category pages
│   │   ├── create/            # Create listing page
│   │   ├── item/              # Item detail pages
│   │   ├── messages/          # Messages page
│   │   └── ...
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   └── layout/           # Layout components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and API client
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── database/                 # Database schema and migrations
```

## 🎯 Core Features

### Listings Management

- Create, read, update listings
- Image upload and management
- Category-based organization
- Search and filtering capabilities

### Messaging System

- Real-time messaging between users
- Message count indicators
- Conversation grouping by listing
- Email-based user identification

### User Interface

- Responsive design for mobile and desktop
- Facebook-inspired UI/UX
- Dark/light mode support (configurable)
- Accessible components using Radix UI

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### API Endpoints

- `GET /api/listings` - Fetch all listings
- `GET /api/listings/[id]` - Fetch specific listing
- `POST /api/listings` - Create new listing
- `GET /api/messages` - Fetch messages
- `POST /api/messages` - Send message
- `POST /api/upload` - Upload images

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔗 Links

- [Live Demo](https://marketplace-john-luis.vercel.app)
- [Documentation](./docs/)
- [Issue Tracker](https://github.com/LuisCabantac/marketplace/issues)

## 📞 Support

If you have any questions or need help, please:

- Check the [documentation](./FEATURES.md)
- Open an [issue](https://github.com/LuisCabantac/marketplace/issues)
- Contact the maintainers

---

Made with ❤️ using Next.js and React
