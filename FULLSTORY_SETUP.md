# FullStory Setup Instructions

## Prerequisites

1. FullStory account with organization ID
2. React Native 0.78.0 (already installed ✅)
3. `@fullstory/react-native` package (already in package.json v1.8.0 ✅)

## Step 1: Get Your FullStory Organization ID

1. Log in to your FullStory dashboard: https://app.fullstory.com
2. Navigate to Settings → Integrations
3. Copy your Organization ID (format: `XXXX-XXXX`)

## Step 2: Configure Environment Variables

Create or update your `.env` file in the project root:

```bash
FULLSTORY_ORG_ID=your-org-id-here
```

**Important**: 
- Add `.env` to `.gitignore` if not already there
- Never commit your FullStory org ID to version control
- Use different org IDs for development/staging/production if needed

## Step 3: Install Native Dependencies

### iOS

The React Native package uses autolinking, so CocoaPods will automatically link FullStory. Run:

```bash
cd ios
pod install
cd ..
```

### Android

Android autolinking will handle the native module automatically. No manual configuration needed.

## Step 4: Verify Installation

### Check Package Installation

```bash
npm list @fullstory/react-native
```

Should show version `1.8.0` or higher.

### Verify Native Linking

**iOS:**
- Open `ios/Chex_AI.xcworkspace` in Xcode
- Check that `FullStory` appears in Pods

**Android:**
- Build the app: `npm run android`
- Check build logs for FullStory initialization

## Step 5: Test Integration

### Development Mode

FullStory is **disabled** in development mode to avoid Metro Server compatibility issues. You should see:
```
[FullStory] Disabled in development mode
```

### Production Build

1. Build a release version:
   ```bash
   # Android
   npm run release-android
   
   # iOS
   npm run ios --configuration Release
   ```

2. Check logs for FullStory initialization:
   ```
   [FullStory] Initialized successfully
   ```

3. Perform actions in the app (login, navigate, etc.)

4. Check FullStory dashboard for recorded sessions

## Step 6: Verify User Identification

1. Log in to the app
2. Check FullStory dashboard → Users
3. Verify user is identified with correct user ID and metadata

## Step 7: Verify Privacy Masking

1. Navigate to login screen
2. Enter password
3. Check FullStory replay
4. Verify password field shows as `[Masked]`

## Troubleshooting

### FullStory Not Initializing

**Check:**
- Environment variable `FULLSTORY_ORG_ID` is set correctly
- Running production build (not development)
- Check console logs for errors

### Missing Session Data on Android

**Solution:** The implementation includes `FullStory.restart()` call for Android. If issues persist:
1. Check that `initializeFullStory()` is called early in app lifecycle
2. Verify ProGuard rules are applied (if using ProGuard)

### Build Errors

**iOS:**
- Run `pod install` again
- Clean build folder: `cd ios && xcodebuild clean`

**Android:**
- Clean build: `cd android && ./gradlew clean`
- Rebuild: `npm run android`

### User Not Identified

**Check:**
- `identifyUser()` is called after successful login
- User ID is correctly extracted from login response
- Check `src/Store/Actions/AuthAction.js` for correct field mapping

## Next Steps

1. ✅ Complete setup steps above
2. ✅ Test in production build
3. ✅ Verify session recording
4. ✅ Verify user identification
5. ✅ Review privacy masking (see `FULLSTORY_PRIVACY_GUIDE.md`)
6. ✅ Monitor FullStory dashboard for errors

## Support

- [FullStory React Native Documentation](https://github.com/fullstorydev/fullstory-react-native)
- [FullStory Support](https://help.fullstory.com/hc/en-us)

