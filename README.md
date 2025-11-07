# CSI NMAMIT Website v2.0

A modern, feature-rich website for the Computer Society of India - NMAMIT Student Branch, built with React, Vite, and Tailwind CSS.

## 🚀 Features

### ✨ Modern Design
- **Glassmorphism Effects**: Beautiful glass-like UI components
- **Gradient Animations**: Smooth, eye-catching gradient transitions
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Design**: Mobile-first approach for all devices
- **Micro-interactions**: Subtle animations for better UX
- **Parallax Effects**: 3D card effects and scroll animations

### 🎯 Core Functionality
- **Authentication**: Google Sign-in with Firebase Auth
- **User Profiles**: Complete profile management system
- **Event Management**: Browse and register for events
- **Team Showcase**: Faculty and student team display
- **Membership System**: Online registration with payment integration
- **Payment Gateway**: Razorpay integration for membership fees
- **Certificate Generation**: Download membership certificates

### 🛠️ Technical Stack

#### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React (replaced all emojis)
- **Animations**: Framer Motion, GSAP
- **3D Effects**: React Parallax Tilt
- **Routing**: React Router v6

#### Backend
- **Runtime**: Node.js with Express.js
- **Payment Gateway**: Razorpay SDK
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan

#### Database & Services
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage & Cloudinary
- **Email**: EmailJS
- **Payments**: Razorpay

## 📦 Installation

### Frontend Setup

1. **Clone the repository**
```bash
cd website-version-2
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Razorpay Configuration (Public Key only)
VITE_RAZORPAY_KEY_ID=your-razorpay-key-id

# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Security
VITE_CORE_MEMBERS_DATA=base64_encoded_data
VITE_SECURITY_SALT=your_security_salt
VITE_APP_ENV=development
```

4. **Run the development server**
```bash
npm run dev
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Set up backend environment variables**
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Razorpay Credentials (REQUIRED)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Firebase Admin SDK (Optional)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

4. **Run the backend server**
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Quick Start (Both Servers)

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run backend:dev
```

### Build for Production
```bash
npm run build
```

For detailed backend setup and API documentation, see:
- [Backend README](./backend/README.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- [Quick Start Guide](./backend/QUICK_START.md)

## 🎨 Design Improvements

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Cyber Blue**: #00d4ff
- **Cyber Purple**: #a855f7
- **Cyber Pink**: #ec4899
- **Gradients**: Smooth transitions between colors

### Typography
- **Display Font**: Orbitron (futuristic headers)
- **Body Font**: Inter (clean, readable)
- **Mono Font**: JetBrains Mono (code blocks)

### Components
- Glass-morphic cards with backdrop blur
- Neon glow effects on hover
- Animated gradient backgrounds
- Particle.js interactive background
- Smooth page transitions
- Loading skeletons for better UX

## 🏗️ Architecture

### Frontend Architecture
- **React 18** with hooks and functional components
- **React Router** for client-side routing
- **Context API** for state management (Auth, Theme, Admin)
- **Custom hooks** for business logic encapsulation
- **Service layer** for API and Firebase interactions
- **Component library** with reusable UI primitives

### Backend Architecture
```
backend/
├── config/           # Configuration files (Firebase, Razorpay)
├── controllers/      # Request handlers and business logic
├── middleware/       # Authentication, validation, error handling
├── routes/          # API route definitions
├── services/        # Business logic layer (Payment service)
└── utils/           # Helper functions and utilities
```

### API Endpoints
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment signature
- `GET /api/payments/payment/:id` - Get payment details
- `GET /api/payments/order/:id` - Get order details
- `POST /api/payments/webhook` - Razorpay webhook handler
- `GET /health` - Health check endpoint

## 📱 Pages

1. **Home**: Hero section, About, Features, Highlights, Testimonials, CTA
2. **Events**: Event listing with filters, search, and categories
3. **Team**: Faculty and student team with modal views
4. **Profile**: User dashboard with membership status
5. **Recruit**: Membership registration with payment
6. **Admin**: Dashboard, Users, Events, Members, Payments management
7. **404**: Custom not found page

## 🔧 Key Components

### Layout
- `Navbar`: Modern navigation with glassmorphism
- `Footer`: Comprehensive footer with newsletter
- `ScrollToTop`: Smooth scroll to top button
- `ParticlesBackground`: Interactive particle animation

### Home Components
- `Hero`: Animated hero with typing effect
- `About`: 3D card effects with tilt
- `Features`: Technology showcase grid
- `Highlights`: Image gallery with lightbox
- `Testimonials`: Carousel with animations
- `CTA`: Call-to-action with gradient background

### UI Components
- Glass cards with blur effects
- Animated buttons with hover states
- Custom input fields with icons
- Loading states and skeletons
- Toast notifications

## 🔐 Security

### Frontend Security
- Firebase Authentication for secure sign-in
- Protected routes for authenticated users
- Environment variables for sensitive data
- Input validation and sanitization
- CSP headers and security middleware
- Rate limiting and CSRF protection

### Backend Security
- HMAC SHA256 signature verification for payments
- Express Validator for input validation
- Helmet.js for security headers
- CORS protection with configurable origins
- Rate limiting (100 requests/15 min)
- Firebase Admin SDK for secure authentication
- Transaction tracking and audit logging
- Secure webhook signature verification

## 🚀 Performance

- Vite for fast development and optimized builds
- Lazy loading for images and components
- Code splitting for better load times
- Optimized animations with Framer Motion
- Responsive images with proper sizing

## 📈 Future Enhancements

- [ ] PWA support for offline access
- [ ] Push notifications for events
- [ ] Advanced search and filters
- [ ] Social media integration
- [ ] Blog/News section
- [ ] Forum for discussions
- [ ] Project showcase gallery
- [ ] Alumni network
- [ ] Job board
- [ ] Resource library

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Credits

Developed by the CSI NMAMIT Tech Team with ❤️

---

**Note**: This is version 2.0 of the CSI NMAMIT website, featuring a complete redesign with modern technologies and enhanced user experience.

## 🔧 Console Statement Cleanup

All console statements have been commented out for production. The following files were modified:

### Modified Files (36 total):

#### Hooks (5 files)
- `src/hooks/useEvents.js`
- `src/hooks/useRecruit.js`
- `src/hooks/useProfileFirestore.js`
- `src/hooks/useProfile.js`
- `src/hooks/useSecureRecruit.js`

#### Contexts (2 files)
- `src/contexts/AuthContext.jsx`
- `src/contexts/AdminAuthContext.jsx`

#### Config (5 files)
- `src/config/emailjs.js`
- `src/config/coreMembers.js`
- `src/config/cloudinary.js`
- `src/config/firebase.js`
- `src/config/firebase-secure.js`

#### Services (3 files)
- `src/services/paymentService.js`
- `src/services/eventService.js`
- `src/services/emailService.js`

#### Pages - Admin (10 files)
- `src/pages/NotFound.jsx`
- `src/pages/Admin/Payments/AdminPayments.jsx`
- `src/pages/Admin/Payments/services/paymentDataService.js`
- `src/pages/Admin/Payments/components/OTPModal.jsx`
- `src/pages/Admin/Members/utils/helpers.js`
- `src/pages/Admin/Members/AdminEMembers.jsx`
- `src/pages/Admin/AdminUsers-clean.jsx`
- `src/pages/Admin/AdminLogin.jsx`
- `src/pages/Admin/AdminEvents.jsx`
- `src/pages/Admin/AdminDashboard.jsx`
- `src/pages/Admin/AdminEMembers-clean.jsx`

#### Components (5 files)
- `src/components/Layout/Navbar.jsx`
- `src/components/Events/EventCard.jsx`
- `src/components/Admin/EventForm.jsx`
- `src/components/Profile/QuickActions.jsx`
- `src/components/Profile/ProfileCompletionModal.jsx`

#### Utils (4 files)
- `src/utils/emailDiagnostics.js`
- `src/utils/secureCoreMembersUtils.js`
- `src/utils/securityUtils.js`
- `src/utils/testCoreMembers.js`

#### Main (1 file)
- `src/main.jsx`

**Total console statements commented**: 271 statements across 36 files

To re-enable console statements for development, uncomment the relevant lines in the files listed above.
