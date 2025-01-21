package com.chex_ai;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.bluetooth.BluetoothDevice;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.pixida.safetytagapi.data.dto.SafetyTagInfo;

public class MySafetyTagReceiver extends BroadcastReceiver {
    private static final String TAG = "MySafetyTagReceiver";
    private static final String EXTRA_FOUND_SAFETY_TAG_INFO = "com.pixida.safetytagapi.EXTRA_FOUND_SAFETY_TAG_INFO";
    private final ReactApplicationContext reactContext;

    public MySafetyTagReceiver(ReactApplicationContext context) {
        this.reactContext = context;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "onReceive called with intent action: " + intent.getAction());

        SafetyTagInfo foundSafetyTagInfo = intent.getParcelableExtra(EXTRA_FOUND_SAFETY_TAG_INFO);

        if (foundSafetyTagInfo != null) {
            BluetoothDevice tag = foundSafetyTagInfo.getTag();
            String address = tag != null ? tag.getAddress() : "unknown";

            Log.i(TAG, "Found Safety Tag in background - Address: " + address +
                      ", Bonded: " + foundSafetyTagInfo.isBonded() +
                      ", RSSI: " + foundSafetyTagInfo.getRssi() +
                      ", Mode: " + foundSafetyTagInfo.getAdvertisementMode());

            // Create event data
            WritableMap params = Arguments.createMap();
            params.putString("tag", address);
            params.putBoolean("isBonded", foundSafetyTagInfo.isBonded());
            params.putInt("rssi", foundSafetyTagInfo.getRssi());
            params.putString("advertisementMode", foundSafetyTagInfo.getAdvertisementMode().toString());

            try {
                // Send event to React Native
                Log.d(TAG, "Attempting to emit event to React Native");
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onBackgroundDeviceFound", params);
                Log.i(TAG, "Successfully emitted event to React Native");
            } catch (Exception e) {
                Log.e(TAG, "Error emitting event to React Native: " + e.getMessage());
            }
        } else {
            Log.w(TAG, "Received null SafetyTagInfo in onReceive");
        }
    }
}
