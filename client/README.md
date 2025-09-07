# Parking Reservation System - Frontend

A comprehensive parking management system built with Next.js 14, TypeScript, and TanStack Query. Features real-time updates via WebSocket, role-based authentication, and a responsive design.

## 🚀 Features

- **Gate Management**: Real-time zone availability with visitor/subscriber check-ins
- **Checkpoint System**: Employee ticket validation and checkout processing
- **Admin Dashboard**: User management, reports, and system controls
- **Real-time Updates**: WebSocket integration for live zone status updates
- **Role-based Access**: Admin and employee authentication with protected routes
- **Responsive Design**: Mobile-friendly interface with accessibility features
- **Rate Management**: Dynamic pricing with normal/special rate modes
- **Subscription System**: Subscriber verification and car plate matching

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **State Management**: Zustand + TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Real-time**: WebSocket API
- **Testing**: Jest + React Testing Library
- **Authentication**: JWT Bearer tokens

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- Backend API server running on `http://localhost:3000`

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parking-reservation-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   API_BASE_URL=http://localhost:3000/api/v1
   WS_URL=ws://localhost:3000/api/v1/ws
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🎮 Demo Credentials

### Admin Users
- **Username**: `admin` **Password**: `adminpass`
- **Username**: `superadmin` **Password**: `superpass`

### Employee Users
- **Username**: `emp1` **Password**: `pass1`
- **Username**: `checkpoint1` **Password**: `checkpoint1`

### Demo Subscriptions
- **sub_001**: Premium subscriber (Ali - ABC-123)
- **sub_002**: Regular subscriber (Sara - XZY-456) 
- **sub_003**: Economy subscriber (Mohammed - DEF-789, GHI-012)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── admin/              # Admin dashboard pages
│   ├── checkpoint/         # Employee checkpoint
│   ├── gate/[gateId]/     # Gate check-in interface
│   └── login/             # Authentication
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── checkpoint/        # Checkout components
│   ├── common/            # Shared components
│   └── gate/              # Gate interface components
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # TanStack Query hooks
│   ├── useAuth.ts         # Authentication logic
│   └── useWebSocket.ts    # WebSocket management
├── services/              # External services
│   ├── api.ts             # API client utilities
│   └── websocket.ts       # WebSocket service
├── store/                 # Zustand stores
│   ├── authStore.ts       # Authentication state
│   └── uiStore.ts         # UI state management
├── types/                 # TypeScript definitions
└── utils/                 # Helper functions
```

## 🎯 Key Features Demo

### 1. Gate Check-in Flow
1. Navigate to any gate (e.g., `/gate/gate_1`)
2. **Visitor Mode**: Select zone → Click "Check In as Visitor" → Get ticket
3. **Subscriber Mode**: Enter subscription ID (e.g., `sub_001`) → Select zone → Check in

### 2. Employee Checkpoint
1. Login as employee (`emp1` / `pass1`)
2. Navigate to `/checkpoint`
3. Enter demo ticket ID (`t_025` for visitor, `t_010` for subscriber)
4. Process checkout with calculated fees

### 3. Admin Dashboard
1. Login as admin (`admin` / `adminpass`)
2. **Dashboard**: View system overview and activity log
3. **Employees**: Create/manage user accounts
4. **Reports**: Real-time parking state with auto-refresh
5. **Control Panel**: 
   - Open/close zones
   - Update category rates
   - Manage rush hours and vacations

### 4. Real-time Updates
- Open multiple browser windows/tabs
- Perform check-in at gate → See zone counts update in admin reports
- Close zone in admin → See gate interface reflect changes immediately

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Test Structure
- **Component Tests**: `/src/__tests__/components/`
- **Hook Tests**: `/src/__tests__/hooks/`
- **Integration Tests**: Key user flows

### Manual Testing Checklist
- [ ] Login with different user roles
- [ ] Gate check-in for visitors and subscribers  
- [ ] Real-time WebSocket updates across tabs
- [ ] Employee checkout process
- [ ] Admin zone management
- [ ] Responsive design on mobile devices
- [ ] Error handling and loading states

## 🔌 API Integration

The frontend consumes a REST API with WebSocket support:

### Authentication
```typescript
POST /auth/login
Authorization: Bearer <token>
```

### Key Endpoints
- `GET /master/gates` - Gate listings
- `GET /master/zones?gateId=X` - Zone data by gate
- `POST /tickets/checkin` - Process check-in
- `POST /tickets/checkout` - Process checkout  
- `GET /subscriptions/:id` - Subscription verification
- `GET /admin/reports/parking-state` - Live parking data

### WebSocket Events
```typescript
// Subscribe to gate updates
{ "type": "subscribe", "payload": { "gateId": "gate_1" } }

// Receive zone updates  
{ "type": "zone-update", "payload": { /* Zone object */ } }

// Admin action notifications
{ "type": "admin-update", "payload": { /* Admin action */ } }
```

## 🎨 UI/UX Features

- **Responsive Grid Layouts**: Mobile-first design approach
- **Real-time Indicators**: Live connection status and data updates  
- **Loading States**: Skeleton loaders and spinners
- **Error Boundaries**: Graceful error handling with retry options
- **Toast Notifications**: User feedback for actions
- **Print-friendly Tickets**: Optimized layouts for printing
- **Accessibility**: Semantic HTML, keyboard navigation, screen reader support

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
API_BASE_URL=https://your-api-domain.com/api/v1
WS_URL=wss://your-websocket-domain.com/api/v1/ws
```

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check backend server is running
   - Verify WS_URL in environment variables
   - Check browser console for connection errors

2. **API Authentication Errors**
   - Ensure backend API is accessible
   - Check API_BASE_URL configuration
   - Verify demo credentials are seeded in backend

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript configuration and dependencies

4. **Real-time Updates Not Working**
   - Verify WebSocket connection in browser DevTools
   - Check if backend WebSocket service is running
   - Ensure proper CORS configuration on backend

5. **Mobile Responsiveness Issues**
   - Test on actual devices, not just browser dev tools
   - Check Tailwind CSS responsive classes
   - Verify viewport meta tag in layout

## 📊 Performance Optimization

### Code Splitting
- Automatic route-based splitting with Next.js App Router
- Dynamic imports for heavy components
- Lazy loading of admin modules

### State Management
- Zustand for lightweight global state
- TanStack Query for server state caching
- Optimistic updates for better UX

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

## 🔒 Security Considerations

### Authentication
- JWT token storage in memory (not localStorage)
- Automatic token refresh handling
- Protected route middleware

### Data Validation
- TypeScript for compile-time safety
- Runtime validation with Zod schemas
- Input sanitization for user data

### CORS & CSP
- Configured for specific domains
- Content Security Policy headers
- HTTPS enforcement in production

## 📈 Monitoring & Analytics

### Error Tracking
- Error boundaries for graceful failures
- Console error logging
- User action tracking

### Performance Metrics
- Core Web Vitals monitoring
- Bundle size tracking
- API response time monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Follow TypeScript strict mode
- Use Prettier for code formatting
- Write tests for new features
- Update documentation for API changes

### Pull Request Guidelines
- Clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update README if needed

## 📝 Changelog

### Version 1.0.0
- Initial release with core features
- Gate management system
- Employee checkpoint interface
- Admin dashboard
- Real-time WebSocket integration
- Role-based authentication

### Planned Features
- [ ] Mobile app integration
- [ ] Advanced reporting analytics
- [ ] Multi-language support
- [ ] Payment gateway integration
- [ ] Email/SMS notifications

## 📞 Support

### Documentation
- API documentation: `/docs/api`
- Component library: `/docs/components`
- Deployment guide: `/docs/deployment`

### Contact
- Technical issues: Create GitHub issue
- Feature requests: Use GitHub discussions
- Security concerns: Email security@company.com


---

**Built using Next.js, TypeScript, and modern web technologies.**