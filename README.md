# Haven Frontend

Frontend application for Haven, a privacy-focused social matching platform.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
cd haven-frontend
npm install
```

## Running the App

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Features

- User authentication (Login/Register)
- Profile setup with photo upload
- View and edit profile
- Discovery page with swipe cards
- Match list and profile viewing
- Real-time chat with WebSocket

## Project Structure

```
src/
├── api/           # API and WebSocket clients
├── components/    # Reusable UI components
├── context/       # React context (Auth)
├── pages/         # Page components
├── types/         # TypeScript interfaces
├── App.tsx        # Main app component
└── main.tsx       # Entry point
```

## Environment Configuration

### Vite Proxy Configuration (vite.config.ts)

The frontend uses Vite's proxy to handle API requests and image loading during development:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
```

This proxy enables:

- API requests to backend at `http://localhost:8080`
- Profile images loaded through `/uploads/*` path

## Troubleshooting & Common Issues

### WebSocket Connection Fails

- Ensure backend is running on port 8080
- Verify JWT token is stored in localStorage after login
- Check browser console for connection errors

### Images Not Loading (403 Error)

- Verify Vite proxy is configured in vite.config.ts
- Restart dev server after any config changes
- Check backend SecurityConfig allows /uploads/\*\* path

### CORS Errors

- Ensure backend CORS configuration allows `http://localhost:5173`
- Check backend SecurityConfig.java for proper CORS settings

### Login/Register Not Working

- Verify backend API is accessible at `http://localhost:8080`
- Check browser console for specific error messages
- Ensure database is running and accessible

### Profile Photo Upload Fails

- Check file size (max ~5MB recommended)
- Ensure file format is supported (jpg, png, gif)
- Verify backend upload endpoint is working

### Swipe Cards Not Working

- Check browser console for JavaScript errors
- Verify profile is marked as complete in database
- Ensure there are available profiles to swipe on

### Chat Messages Not Sending

- Ensure WebSocket connection shows "Connected" indicator
- Check token validity - may need to re-login
- Verify backend WebSocket endpoint is accessible

### App Stuck on Loading

- Check network tab for failed API requests
- Verify database is running
- Check browser console for error messages

---

## Additional Notes

- The frontend communicates with the backend at `http://localhost:8080`
- WebSocket connection is used for real-time chat
- Profile photos are stored on the backend and served through the proxy
