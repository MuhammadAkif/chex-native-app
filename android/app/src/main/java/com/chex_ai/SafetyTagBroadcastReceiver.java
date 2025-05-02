package com.chex_ai;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.pixida.safetytagapi.data.dto.SafetyTagInfo;
import com.pixida.safetytagapi.interfaces.SafetyTagFinder;

public class SafetyTagBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "SafetyTagReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        SafetyTagInfo foundSafetyTagInfo = intent.getParcelableExtra("com.pixida.safetytagapi.EXTRA_FOUND_SAFETY_TAG_INFO");
        Log.d(TAG, "Received action: " + action);

        if (foundSafetyTagInfo != null) {
                WritableMap deviceInfo = Arguments.createMap();
                deviceInfo.putString("device_Found", foundSafetyTagInfo.toString());
                sendEvent(context, "onFoundSafetyTagInfo", deviceInfo);
        }

        if (action == null) return;

        Bundle extras = intent.getExtras();
        if (extras == null) return;

        switch (action) {
            case SafetyTagFinder.SAFETY_TAG_API_TAG_FOUND:
                handleTagFound(context, extras);
                break;
            case SafetyTagFinder.SAFETY_TAG_API_TAG_CONNECTED:
                handleTagConnected(context, extras);
                break;
        }
    }

    private void handleTagFound(Context context, Bundle extras) {
        try {
            SafetyTagInfo tagInfo = extras.getParcelable("tag_info");
            if (tagInfo == null) return;

            // Create device info for React Native
            WritableMap deviceInfo = Arguments.createMap();
            deviceInfo.putString("address", tagInfo.getTag().getAddress());
            deviceInfo.putBoolean("isBonded", tagInfo.isBonded());
            deviceInfo.putInt("rssi", tagInfo.getRssi());

            // Create event
            WritableMap event = Arguments.createMap();
            event.putMap("device", deviceInfo);

            // Send event to React Native
            sendEvent(context, "onBackgroundDeviceFound", event);

            Log.d(TAG, "Tag found in background: " + tagInfo.getTag().getAddress());
        } catch (Exception e) {
            Log.e(TAG, "Error handling tag found: " + e.getMessage());
        }
    }

    private void handleTagConnected(Context context, Bundle extras) {
        try {
            SafetyTagInfo tagInfo = extras.getParcelable("tag_info");
            if (tagInfo == null) return;

            // Create event for React Native
            WritableMap event = Arguments.createMap();
            event.putString("address", tagInfo.getTag().getAddress());
            event.putString("status", "CONNECTED");

            // Send event to React Native
            sendEvent(context, "onBackgroundDeviceConnected", event);

            Log.d(TAG, "Tag connected in background: " + tagInfo.getTag().getAddress());
        } catch (Exception e) {
            Log.e(TAG, "Error handling tag connected: " + e.getMessage());
        }
    }

    private void sendEvent(Context context, String eventName, WritableMap params) {
        try {
            ReactContext reactContext = ((MainApplication) context.getApplicationContext()).getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
            if (reactContext != null) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
            }
        } catch (Exception e) {
            Log.e(TAG, "Error sending event to React Native: " + e.getMessage());
        }
    }
}
