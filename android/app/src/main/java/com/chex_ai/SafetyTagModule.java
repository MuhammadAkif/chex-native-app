package com.chex_ai;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.pixida.safetytagapi.SafetyTagApi;

import timber.log.Timber;


public class SafetyTagModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private SafetyTagApi tagApi;

    public SafetyTagModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Timber.plant(new Timber.DebugTree()); // Initialize Timber
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SafetyTag";
    }

    @ReactMethod
    public void getApiInfo(Promise promise) {
        try {
            tagApi = SafetyTagApi.getInstance(reactContext);

            WritableMap info = Arguments.createMap();
            info.putString("version", tagApi.getClass().getName());
            info.putBoolean("isInitialized", tagApi != null);

            // Get available methods
            WritableMap methods = Arguments.createMap();
            for (java.lang.reflect.Method method : tagApi.getClass().getDeclaredMethods()) {
                methods.putString(method.getName(), method.toString());
            }
            info.putMap("availableMethods", methods);

            promise.resolve(info);
        } catch (Exception e) {
            Log.e("SafetyTagModule", "Error getting API info: " + e.getMessage());
            promise.reject("API_INFO_ERROR", e.getMessage());
        }
    }
}
