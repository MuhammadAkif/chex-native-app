# FullStory Integration - Quick Start Guide

## 🚀 Quick Start

### 1. Set Environment Variable (REQUIRED)

Add your FullStory Organization ID to your environment:

```bash
# In your .env file or CI/CD environment:
FULLSTORY_ORG_ID=your-org-id-here
```

**Get your Org ID**: https://app.fullstory.com → Settings → Integrations

### 2. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 3. Test in Production Build

```bash
# Android
npm run release-android

# iOS
npm run ios --configuration Release
```

### 4. Verify Integration

1. Check console logs for: `[FullStory] Initialized successfully`
2. Log in to your app
3. Check FullStory dashboard for recorded sessions
4. Verify password fields are masked in replay

---

## ✅ What's Already Done

- ✅ FullStory React Native v1.8.0 installed
- ✅ Service layer implemented (`src/services/fullstoryService.js`)
- ✅ User identification on login
- ✅ User anonymization on logout
- ✅ Password fields masked
- ✅ Screen tracking enabled
- ✅ Background/foreground handling
- ✅ Android Maven repository configured
- ✅ ProGuard rules configured
- ✅ iOS autolinking configured

---

## 📚 Documentation

- **`FULLSTORY_IMPLEMENTATION_PLAN.md`** - Complete implementation guide
- **`FULLSTORY_CHANGES_SUMMARY.md`** - Summary of code changes
- **`FULLSTORY_SETUP.md`** - Detailed setup instructions
- **`FULLSTORY_PRIVACY_GUIDE.md`** - Privacy masking guide
- **`FULLSTORY_IOS_SETUP.md`** - iOS-specific setup

---

## 🔍 Key Features

### Automatic Features
- ✅ Screen tracking (automatic)
- ✅ Background/foreground handling (automatic)
- ✅ Offline session queuing (automatic)
- ✅ User identification (on login)
- ✅ User anonymization (on logout)

### Manual Features Available
- `trackScreenView(screenName, properties)` - Track custom screens
- `logEvent(eventName, properties)` - Log custom events
- `setUserVars(userVars)` - Update user metadata
- `getCurrentSessionURL()` - Get session URL for debugging

---

## ⚠️ Important Notes

1. **Development Mode**: FullStory is **disabled** in development to avoid Metro Server issues
2. **Production Only**: FullStory only works in production/release builds
3. **Environment Variable**: Must set `FULLSTORY_ORG_ID` for FullStory to initialize
4. **Privacy**: Password fields are masked, but review other sensitive fields

---

## 🐛 Troubleshooting

### FullStory Not Initializing
- Check `FULLSTORY_ORG_ID` is set
- Verify running production build (not debug)
- Check console logs for errors

### Missing Session Data on Android
- Already handled with `restart()` call
- If issues persist, check ProGuard rules

### Build Errors
- **iOS**: Run `pod install` again
- **Android**: Clean build and rebuild

---

## 📊 Testing Checklist

- [ ] Set `FULLSTORY_ORG_ID` environment variable
- [ ] Install iOS pods (`pod install`)
- [ ] Build production version
- [ ] Verify FullStory initializes
- [ ] Test user login (should identify user)
- [ ] Test user logout (should anonymize)
- [ ] Navigate between screens (should track)
- [ ] Check FullStory dashboard for sessions
- [ ] Verify password fields are masked

---

## 🎯 Next Steps

1. Set environment variable
2. Test in production build
3. Review privacy guide for additional masking
4. Monitor FullStory dashboard
5. Train team on FullStory usage

---

**Ready to go!** Just set the environment variable and test in production. 🚀

