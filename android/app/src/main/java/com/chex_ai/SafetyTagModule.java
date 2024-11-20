package com.chex_ai;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SafetyTagModule extends ReactContextBaseJavaModule {
    public SafetyTagModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SafetyTag";
    }

    @ReactMethod
    public void connectToSafetyTag() {
        // Logic to scan and connect using Safety Tag SDK
    }
}
