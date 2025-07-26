# Eplanner - Event Planning App with Firebase Authentication

A modern event planning application built with Next.js 14, Firebase Authentication, Tailwind CSS, and Shadcn/ui components.

## 🚀 Features

- ✅ **Firebase Authentication** with Email/Password and Google Sign-in
- ✅ **Protected Routes** with automatic redirects
- ✅ **Modern UI** using Shadcn/ui components
- ✅ **Responsive Design** with Tailwind CSS
- ✅ **TypeScript** for type safety
- ✅ **Session Persistence** across browser sessions
- ✅ **Password Reset** functionality
- ✅ **User Profile Storage** in Firestore

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Language**: TypeScript
- **Deployment**: Ready for Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- A Firebase project (free tier is sufficient)
- Git

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication:
   - Go to **Authentication** > **Sign-in method**
   - Enable **Email/Password** and **Google** providers
4. Enable Firestore:
   - Go to **Firestore Database**
   - Create database in test mode
5. Get your configuration:
   - Go to **Project Settings** > **General**
   - Scroll down to "Your apps"
   - Add a web app or select existing one
   - Copy the Firebase config object

### 3. Environment Variables

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Authentication Pages

- **Sign In**: `/auth` - Email/password and Google sign-in
- **Sign Up**: `/auth/signup` - Create new account with email
- **Password Reset**: `/auth/reset` - Send password reset email

### Protected Pages

- **Dashboard**: `/dashboard` - Protected route, requires authentication
- **Home**: `/` - Public landing page, redirects authenticated users

### Key Components

- **AuthProvider**: Context provider for authentication state
- **ProtectedRoute**: HOC for protecting routes
- **UI Components**: Reusable Shadcn/ui components

## 🔒 Security Features

- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Persistence**: User stays logged in across browser sessions
- **Secure Firebase Rules**: Ready for production Firestore security rules
- **Input Validation**: Client-side form validation
- **Error Handling**: Proper error messages for auth failures

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   └── ProtectedRoute.tsx # Route protection component
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication functions
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # Utility functions
└── docs/                  # Documentation
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy to Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🛡️ Production Firestore Rules

Update your Firestore security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 🎨 Customization

### Styling

- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Customize Shadcn/ui components in `components/ui/`

### Authentication

- Add more providers in `lib/auth.ts`
- Customize user profile fields in Firestore
- Add role-based access control

### UI Components

- All UI components are in `components/ui/`
- Based on Shadcn/ui for consistency
- Fully customizable with Tailwind CSS

## 🐛 Troubleshooting

### Common Issues

1. **Firebase errors**: Check your environment variables and Firebase project settings
2. **Import errors**: Ensure all dependencies are installed
3. **Build errors**: Make sure TypeScript types are correct

### Debug Mode

Add these to your `.env.local` for debugging:

```env
NEXT_PUBLIC_DEBUG=true
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you need help setting up or customizing this application:

1. Check the documentation
2. Review the code comments
3. Open an issue on GitHub
4. Check Firebase documentation

## 🎉 What's Next?

This authentication setup provides a solid foundation. Consider adding:

- User profile management
- Role-based permissions
- Email verification flow
- Social media authentication providers
- Two-factor authentication
- Admin dashboard

---

Built with ❤️ using Next.js, Firebase, and Shadcn/ui 