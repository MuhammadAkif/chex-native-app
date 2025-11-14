# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# FullStory ProGuard Rules
# These rules prevent ProGuard/R8 from obfuscating or removing FullStory classes
# Required for FullStory to work correctly in release builds
-keep class com.fullstory.** { *; }
-keepclassmembers class com.fullstory.** { *; }
-dontwarn com.fullstory.**

# Keep FullStory React Native bridge classes
-keep class com.fullstory.reactnative.** { *; }
-keepclassmembers class com.fullstory.reactnative.** { *; }
-dontwarn com.fullstory.reactnative.**
