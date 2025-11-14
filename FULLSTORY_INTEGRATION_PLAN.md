# FullStory React Native Integration Plan

## 📚 Research Summary

### Official Integration Paths
- **Web SDK**: For web applications (not applicable here)
- **Native SDKs**: For native iOS and Android applications
- **React Native Plugin**: `@fullstory/react-native` bridges React Native apps with FullStory's native SDKs

### Minimum Supported Versions
- **React Native**: ≥ 0.66.0 ✅ (Your version: 0.78.0 - Compatible)
- **iOS SDK**: ≥ 1.44.0
- **Android SDK**: ≥ 1.44.0
- **iOS**: iOS 11.0 or later
- **Android**: API level 17 (Android 4.2) or later ✅ (Your minSdkVersion: 28 - Compatible)

### Known Issues and Fixes

#### 1. iOS Native View Commands Bug
- **Affects**: React Native versions ≥ 0.74.1 and < 0.77.0, and version 0.78.x with New Architecture active
- **Status**: Your app uses RN 0.78.0 - monitor for this issue if New Architecture is enabled
- **Workaround**: Patch React Native library if issues occur (FullStory provides guidance)

#### 2. Metro Server Compatibility
- **Issue**: FullStory has limited support for Metro Server
- **Solution**: Conditionally disable FullStory during development builds using Metro
- **Implementation**: Use environment variable check to skip initialization in development

#### 3. Android Release Build / ProGuard/R8
- **Issue**: ProGuard may strip FullStory classes in release builds
- **Solution**: Add ProGuard keep rules (see `android/app/proguard-rules.pro`)
- **Status**: Your app has `enableProguardInReleaseBuilds = false` currently, but rules should be added for future-proofing

#### 4. Missing Data on Android
- **Issue**: Some Android sessions may lack interaction data
- **Solution**: Call `FullStory.restart()` after app initialization (already handled in implementation)

### Runtime and Privacy Limitations

#### Default Data Capture
- FullStory captures **all user interactions** by default:
  - Screen views and navigation
  - Touch events and gestures
  - Text input (including passwords - must be masked!)
  - Network requests
  - Console logs
  - Device information

#### Privacy Compliance Requirements
- **GDPR/CCPA Compliance**: Must redact/mask sensitive data
- **Sensitive Fields to Mask**:
  - Passwords and authentication tokens
  - Credit card numbers
  - Social Security Numbers
  - Personal Identifiable Information (PII)
  - Any other sensitive user data

## 🎯 Best Practices

### 1. Initialization
- **Location**: Initialize in `App.tsx` or `index.js` (entry point)
- **Timing**: As early as possible, before any user interactions
- **Environment**: Disable in development/Metro builds to avoid issues

### 2. User Identification
- **Identify on Login**: Call `FullStory.identify(userId, userVars)` after successful authentication
- **User Variables**: Include `displayName`, `email`, and other non-sensitive metadata
- **Anonymize on Logout**: Call `FullStory.anonymize()` when user signs out or session expires

### 3. Privacy Controls (Redacting/Masking)
- **Privacy Classes**:
  - `fs-mask`: Masks sensitive text (passwords, credit cards, etc.)
  - `fs-exclude`: Completely excludes component from recording
  - `fs-unmask`: Explicitly allows recording (overrides parent masking)
- **Implementation**: Apply `fsClass` prop to React Native components
- **Example**: `<TextInput fsClass="fs-mask" />` for password fields

### 4. Offline and Background Sessions
- **Automatic Handling**: FullStory automatically queues events when offline and uploads when online
- **Background**: Sessions pause when app goes to background, resume on foreground
- **Manual Control**: Use `FullStory.shutdown()` and `FullStory.restart()` if needed

### 5. Screen Tracking
- **React Navigation**: FullStory can automatically track screen views
- **Custom Events**: Use `FullStory.event(eventName, properties)` for custom analytics

## ⚠️ Common Integration Pitfalls and Workarounds

### Pitfall 1: Android Build Fails with Metro
- **Symptom**: Build fails when importing FullStory native module
- **Root Cause**: Metro Server compatibility issues
- **Workaround**: Conditionally initialize FullStory only in production builds
- **Code**: `if (!__DEV__) { FullStory.start(); }`

### Pitfall 2: Missing Session Data on Android
- **Symptom**: Sessions recorded but lack interaction data
- **Root Cause**: FullStory not properly initialized or restarted
- **Workaround**: Explicitly call `FullStory.restart()` after app initialization
- **Implementation**: Added in `App.tsx` initialization

### Pitfall 3: ProGuard Strips FullStory Classes
- **Symptom**: Release builds crash or FullStory doesn't work
- **Root Cause**: ProGuard/R8 obfuscation removes required classes
- **Workaround**: Add ProGuard keep rules (see implementation)
- **Prevention**: Rules added to `proguard-rules.pro`

### Pitfall 4: Sensitive Data Leakage
- **Symptom**: Passwords, tokens, or PII visible in session replays
- **Root Cause**: Not applying privacy classes to sensitive components
- **Workaround**: Systematically review and mask all sensitive inputs
- **Implementation**: Examples provided for password fields and sensitive data

### Pitfall 5: User Identification Not Working
- **Symptom**: Sessions not associated with user accounts
- **Root Cause**: `identify()` not called or called incorrectly
- **Workaround**: Ensure identify is called after successful login, with correct user ID
- **Implementation**: Integrated into auth actions

## 📋 Implementation Checklist

- [x] Research complete
- [ ] Install `@fullstory/react-native` (already in package.json v1.8.0)
- [ ] Create FullStory service utility
- [ ] Initialize FullStory in App.tsx
- [ ] Integrate user identification with auth flow
- [ ] Add ProGuard rules for Android
- [ ] Configure environment variable for org ID
- [ ] Add privacy masking to sensitive components
- [ ] Test in development (should be disabled)
- [ ] Test in production build
- [ ] Verify session recording works
- [ ] Verify user identification works
- [ ] Verify sensitive data is masked

## 🔧 Required Configuration

### Environment Variables
- `FULLSTORY_ORG_ID`: Your FullStory organization ID (required)
- `FULLSTORY_ENABLED`: Enable/disable FullStory (default: true in production)

### Native Dependencies
- **iOS**: Auto-linked via CocoaPods (React Native autolinking)
- **Android**: Auto-linked via Gradle (React Native autolinking)

## 📝 Next Steps After Implementation

1. **Obtain FullStory Org ID**: Get your organization ID from FullStory dashboard
2. **Add to Environment**: Add `FULLSTORY_ORG_ID` to your `.env` file
3. **Test Integration**: 
   - Verify initialization in production build
   - Test user identification on login
   - Verify anonymization on logout
   - Check session replay in FullStory dashboard
4. **Privacy Audit**: Review all screens and mask sensitive data
5. **Monitor**: Check FullStory dashboard for session data and errors

