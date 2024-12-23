package com.chex_ai;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.pixida.safetytagapi.SafetyTagApi;
import com.pixida.safetytagapi.models.SafetyTagInfo;

public class Safety_Tag_Module extends ReactContextBaseJavaModule {

    private static final String TAG = "Safety_Tag_Module";
    private final ReactApplicationContext reactContext;
    private SafetyTagApi tagApi;

    public Safety_Tag_Module(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.tagApi = SafetyTagApi.getInstance(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "Safety_Tag";
    }

    @ReactMethod
    public void connectToFirstDiscoveredTag(Promise promise) {
        SafetyTagApi.Finder tagFinder = tagApi.getFinder();
        SafetyTagApi.Connection tagConnection = tagApi.getConnection();

        try {
            tagFinder.startDiscoveringTags(new SafetyTagApi.Finder.DiscoveryCallback() {
                @Override
                public void onTagDiscovered(SafetyTagInfo safetyTag) {
                    tagFinder.stopDiscoveringTags();
                    tagConnection.connectToTag(safetyTag);

                    Log.d(TAG, "Connected to tag: " + safetyTag.getTag().getName());
                    promise.resolve("Connected to tag: " + safetyTag.getTag().getName());
                }
            });
        } catch (Exception e) {
            Log.e(TAG, "Error connecting to Safety Tag", e);
            promise.reject("CONNECT_ERROR", "Failed to connect to Safety Tag");
        }
    }
}
