# DueTracker - Mobile Payment Dues Tracker

A feature-rich React Native mobile application for tracking payment dues, managing categories, and sending timely reminders. Built based on the [payment-dues-notifier](https://github.com/mayoit/payment-dues-notifier) web app with mobile optimizations.

## Features

### Core Features
- ✅ **Payment Tracking**: Track all your payment dues with detailed information
- ✅ **Categories**: Organize payments into customizable categories with color coding
- ✅ **Smart Notifications**: Automated reminders before payment due dates
- ✅ **Recurring Payments**: Support for recurring payment scheduling
- ✅ **Payment Status**: Track pending, overdue, and paid payments
- ✅ **Offline First**: All data stored locally using AsyncStorage
- ✅ **Reports & Analytics**: Visual statistics and insights into your payments
- ✅ **Templates**: Save payment templates for quick entry

### Mobile Optimizations
- 📱 **Native Performance**: Built with React Native for optimal mobile performance
- 💾 **Offline Support**: Works completely offline with local data persistence
- 🔔 **Push Notifications**: Native push notifications for payment reminders
- 🎨 **Modern UI**: Clean, intuitive interface following mobile design patterns
- ⚡ **Fast & Responsive**: Optimized for smooth scrolling and quick interactions
- 🔄 **Pull to Refresh**: Easy data refresh with native gestures
- 📊 **Visual Dashboard**: Quick overview with statistics cards

## Technology Stack

- **Framework**: React Native 0.72.6
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage (Offline-first)
- **Notifications**: React Native Push Notification
- **Icons**: React Native Vector Icons (Material Community)
- **Date Handling**: date-fns
- **Language**: TypeScript
- **State Management**: React Hooks

## Installation

### Prerequisites
- Node.js >= 16
- React Native development environment setup

### Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. For iOS: `cd ios && pod install && cd ..`
4. Run: `npm run ios` or `npm run android`

## Key Features

### Offline-First Architecture
All data stored locally using AsyncStorage for fast performance and data privacy.

### Smart Notifications
Automatic scheduling based on due dates and user preferences.

### Status Management
- **Pending**: Future due date
- **Overdue**: Past due date
- **Paid**: Manually completed

## Credits

Inspired by [payment-dues-notifier](https://github.com/mayoit/payment-dues-notifier) by mayoit.