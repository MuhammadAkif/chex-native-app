package com.chex_ai;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import com.pixida.safetytagapi.SafetyTagApi;
import com.pixida.safetytagapi.data.SafetyTagInfo;

public class SafetyTagModule extends ReactContextBaseJavaModule {

    private SafetyTagApi safetyTagApi;

    public SafetyTagModule(ReactApplicationContext reactContext) {
        super(reactContext);
        safetyTagApi = SafetyTagApi.getInstance(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "SafetyTag";
    }

    @ReactMethod
    public void discoverDevices(final Promise promise) {
        safetyTagApi.finder.startDiscoveringTags(tag -> {
            // Stop discovery after finding a device
            safetyTagApi.finder.stopDiscoveringTags();

            // Pass the tag information back to React Native
            promise.resolve(tag.getDeviceName());
        }, error -> {
            // Handle errors
            promise.reject("DISCOVERY_ERROR", error.getMessage());
        });
    }

    @ReactMethod
    public void connectToDevice(String deviceName, final Promise promise) {
        safetyTagApi.connection.connectToTag(deviceName, result -> {
            if (result.isSuccessful()) {
                promise.resolve("Connected to: " + deviceName);
            } else {
                promise.reject("CONNECTION_ERROR", "Failed to connect to: " + deviceName);
            }
        });
    }
}
