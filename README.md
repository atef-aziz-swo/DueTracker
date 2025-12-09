# DueTracker - Mobile Payment Dues Tracker

A feature-rich React Native mobile application for tracking payment dues, managing categories, and sending timely reminders. Built based on the [payment-dues-notifier](https://github.com/mayoit/payment-dues-notifier) web app with mobile optimizations.

**Now available for Web!** Run DueTracker in your browser with full offline support.

## Features

### Core Features
- ✅ **Payment Tracking**: Track all your payment dues with detailed information
- ✅ **Categories**: Organize payments into customizable categories with color coding
- ✅ **Category Management**: Add, edit, and delete custom categories with visual color selection
- ✅ **Search & Filter**: Powerful search and filtering to find payments quickly
- ✅ **Payment Details**: View and edit payment details with a comprehensive detail screen
- ✅ **Smart Notifications**: Automated reminders before payment due dates
- ✅ **Date Picker**: Native-style date picker for easy due date selection
- ✅ **Recurring Payments**: Support for recurring payment scheduling
- ✅ **Payment Status**: Track pending, overdue, and paid payments
- ✅ **Offline First**: All data stored locally using AsyncStorage/localStorage
- ✅ **Reports & Analytics**: Visual statistics and insights into your payments
- ✅ **Export/Import**: Backup and restore data with JSON export/import
- ✅ **Templates**: Save payment templates for quick entry

### Mobile Optimizations
- 📱 **Native Performance**: Built with React Native for optimal mobile performance
- 💾 **Offline Support**: Works completely offline with local data persistence
- 🔔 **Push Notifications**: Native push notifications for payment reminders
- 🎨 **Modern UI**: Clean, intuitive interface following mobile design patterns
- ⚡ **Fast & Responsive**: Optimized for smooth scrolling and quick interactions
- 🔄 **Pull to Refresh**: Easy data refresh with native gestures
- 📊 **Visual Dashboard**: Quick overview with statistics cards

### Web Platform
- 🌐 **Web App**: Run in any modern browser
- 🐳 **Docker Support**: Easy deployment with Docker
- 🚀 **CI/CD**: Automated builds and deployments with GitHub Actions
- 📦 **Optimized Build**: Production-ready builds with Vite

## Technology Stack

- **Framework**: React Native 0.72.6 + React Native Web
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage (mobile) / localStorage (web)
- **Notifications**: React Native Push Notification / Web Notifications API
- **Icons**: React Native Vector Icons (Material Community)
- **Date Handling**: date-fns
- **Language**: TypeScript
- **State Management**: React Hooks
- **Build Tool**: Vite (for web)
- **Containerization**: Docker + Nginx

## Installation

### Prerequisites
- Node.js >= 16
- For mobile: React Native development environment setup
- For web: Modern web browser
- For Docker: Docker and Docker Compose

### Running on Mobile

1. Clone the repository
   ```bash
   git clone https://github.com/atef-aziz-swo/DueTracker.git
   cd DueTracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. For iOS (Mac only)
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

4. For Android
   ```bash
   npm run android
   ```

### Running on Web

1. Install dependencies
   ```bash
   npm install
   ```

2. Start development server
   ```bash
   npm run web
   ```

3. Open browser at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

Access the app at `http://localhost:8080`

### Using Docker manually

1. Build the image
   ```bash
   docker build -t duetracker .
   ```

2. Run the container
   ```bash
   docker run -d -p 8080:80 duetracker
   ```

3. Access at `http://localhost:8080`

### GitHub Container Registry

The app is automatically built and pushed to GitHub Container Registry on every commit to main/master branch.

Pull and run:
```bash
docker pull ghcr.io/atef-aziz-swo/duetracker:latest
docker run -d -p 8080:80 ghcr.io/atef-aziz-swo/duetracker:latest
```

## GitHub Actions CI/CD

The project includes automated workflows for:

- ✅ Building Docker images
- ✅ Pushing to GitHub Container Registry  
- ✅ Multi-platform support (linux/amd64, linux/arm64)
- ✅ Automated testing of Docker images
- ✅ Semantic versioning tags

Workflow triggers on:
- Push to main/master branches
- Pull requests
- Manual workflow dispatch

## Key Features

### Offline-First Architecture
All data stored locally using AsyncStorage (mobile) or localStorage (web) for fast performance and data privacy.

### Smart Notifications
Automatic scheduling based on due dates and user preferences.

### Status Management
- **Pending**: Future due date
- **Overdue**: Past due date
- **Paid**: Manually completed

## Project Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── services/        # Business logic (with .web variants)
│   ├── types/           # TypeScript definitions
│   ├── utils/           # Helper functions
│   └── web/             # Web-specific components
├── .github/workflows/   # CI/CD workflows
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── nginx.conf           # Nginx configuration
├── vite.config.js       # Vite build configuration
└── index.web.tsx        # Web entry point
```

## Environment Configuration

The app works out of the box with sensible defaults. For production deployments, consider:

- Customizing nginx.conf for your domain
- Setting up HTTPS with reverse proxy
- Configuring proper CORS if needed
- Adjusting Docker resource limits

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

Inspired by [payment-dues-notifier](https://github.com/mayoit/payment-dues-notifier) by mayoit.

## Recent Improvements

### December 2024 Update
Major feature additions and UI improvements:
- ✅ **Payment Detail Screen** - View and edit payment details
- ✅ **Search & Filter** - Find payments quickly with advanced search
- ✅ **Category Management** - Manage categories with visual color picker
- ✅ **Export/Import** - Backup and restore data
- ✅ **Date Picker** - Native-style date selection
- ✅ **Enhanced UI** - Icons, better layouts, improved user experience

See [FEATURES.md](FEATURES.md) for detailed documentation of all features.
See [SUGGESTIONS.md](SUGGESTIONS.md) for future improvement suggestions.