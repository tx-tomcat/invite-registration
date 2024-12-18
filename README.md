# Invite Code Registration System

A Next.js application that implements a secure invite code system with wallet integration.

## Setup Instructions

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/tx-tomcat/invite-registration.git
cd invite-registration
pnpm install
```

2. Create `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Start the development server:

```bash
pnpm dev
```

## Architecture & Design Decisions

### 1. Form Handling Strategy

- **Two-Step Registration**: Split into code verification and user registration to reduce complexity and improve UX
- **Form State Management**: Used React Hook Form for:
  - Efficient form state management
  - Built-in validation
  - Reduced re-renders
  - Type-safe form handling

### 2. API Integration

- **Centralized API Client**:
  - Consistent error handling
  - Type-safe API calls
  - Easy maintenance and updates
  - Reusable across components

### 3. Validation Approach

- **Client-side Validation**:
  - Zod schema validation for type safety
  - Immediate feedback to users
  - Reduced server load
- **API-level Validation**:
  - Email uniqueness check
  - Wallet address verification
  - Invite code validation

### 4. Security Measures

- **Wallet Integration**:
  - Message signing for authentication
  - Secure wallet connection
  - Address verification
- **Rate Limiting**:
  - Prevented multiple submissions
  - Protected against brute force attempts

### 5. Error Handling

- **Comprehensive Error States**:
  - User-friendly error messages
  - Toast notifications
  - Form-level error displays
  - API error handling

## Testing Strategy

1. **Unit Tests**:

- Form validation
- API client methods
- Utility functions

2. **Integration Tests**:

- Form submission flows
- API integration
- Wallet connection

3. **E2E Tests**:

- Complete registration flow
- Error scenarios
- Network conditions

4. **Manual Testing Checklist**:

- Form validation
- Error messages
- Loading states
- Mobile responsiveness
- Wallet integration

## Future Improvements

### 1. Enhanced Security

- Implement CSRF protection
- Add rate limiting middleware
- Add IP-based restrictions
- Implement session management

### 2. Better User Experience

- Add progress indicator
- Implement form persistence
- Add email verification step
- Improve loading states
- Add success animations

### 3. Technical Improvements

- Add comprehensive test coverage
- Implement error boundary
- Add performance monitoring
- Improve TypeScript types
- Add API response caching

### 4. Additional Features

- Add admin dashboard
- Implement audit logging
- Add analytics tracking
- Support multiple wallet providers
- Add invite code management

### 5. Performance Optimization

- Implement code splitting
- Add service worker
- Optimize bundle size
- Add API request batching
- Implement request caching

## Known Limitations

- Limited wallet provider support
- Basic error handling
- No persistent storage
- Limited API functionality
- Basic UI components

## License

This project is licensed under the MIT License.
