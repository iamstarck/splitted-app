# Splitted Application

Splitted is a modern, snappy, and intuitive web application designed to help you split bills and receipts among friends with absolute fairness. Forget about complex math, tax distribution, and tip division—Splitted handles it all for you.

## ✨ Features

- **Bill Splitting**: Create customized bills, add people to them, and easily assign items accurately.
- **Prorated Taxes & Service Fees**: Just input your receipt's tax and service charges. Splitted proportionately applies them based on each person's individual item share.
- **Smart OCR receipt Scanning**: Forget typing! Snap a photo or upload an image of your receipt. We'll automatically identify the items and their prices.
- **Interactive Tour Guide**: Stuck on what to do? Access an interactive step-by-step contextual guide anytime by touching the help button.
- **Friends & Groups Management**: Add new people on the fly or connect with friends you've previously added for lightning-quick splitting. You can easily modify your friends list directly directly inside the app. Create **Groups** to instantly add multiple people (like your family or work colleagues) to a bill in just one click!
- **Offline Persistence**: All your active bills and friends are safely stored directly on your browser via `Zustand` and `Local Storage`.
- **Snappy UI/UX**: Built using cutting edge animations and fluid design language to feel ultra-premium. Fully compatible with Light and Dark themes.

## 🛠️ Technology Stack

- **React + TypeScript + Vite**: Lightning-fast, typed robust frontend architecture.
- **Tailwind CSS + Shadcn UI**: Styling and robust primitive UI components.
- **Framer Motion**: State of the art page transitions, stagger sequences, and interactive elements.
- **Zustand**: Fast and lightweight local state management with persistence capabilities.
- **Driver.js**: Powerful library powering the in-app interactive tutorials.
- **Vercel Serverless Functions**: Powering our highly-performant OCR integration backend.
- **Mindee API**: Cutting edge receipt scanning and parsing technology.

## 🚀 Local Development Setup

To run this application locally, you will need a Mindee API Key to use the "Scan Bill" OCR feature.

### 1. Pre-requisites

Ensure you have Node.js and npm installed.
- [Node.js](https://nodejs.org/en/)

### 2. Getting the Mindee API Key
1. Go to [Mindee](https://mindee.com/) and create a free account.
2. Navigate to your Developer Dashboard and create a new API Key with receipt parsing capabilities.

### 3. Environment Variables
Create a file named `.env` in the root of your project directory. Provide the API key inside this file for the Vercel serverless function to utilize:

```env
MINDEE_API_KEY="your_secret_mindee_api_key_here"
```

### 4. Installation and Running

Run the following commands in your terminal:

```bash
# Install all required dependencies
npm install

# Build the project locally
npm run build

# Start the dev server using Vercel CLI (This automatically wraps serverless functions locally)
vercel dev
```

The app should now be live on `http://localhost:3000` or higher!

## 🚢 Deployment

This project's deployment goes naturally with [Vercel](https://vercel.com).
To deploy it yourself:
1. Initialize a Git repository and push this to GitHub.
2. Link your Vercel account to the repository.
3. **CRITICAL**: Go to your Vercel Project Settings -> Environment Variables. Add `MINDEE_API_KEY` setting the value to your Mindee key.
4. Click Deploy.

## 📝 Recent Version Changes
- Fixed interactive step-by-step guide lagging by making snapping transitions seamless.
- Standardized UI spacing and design aesthetics.
- Quick Friend Management from dropdown select.
- **New Feature: People Groups**: Assemble friends into groups and add them all to a bill simultaneously using a slick new UI embedded inside the people dropdown.
