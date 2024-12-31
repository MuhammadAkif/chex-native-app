package com.chex_ai;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.pixida.safetytagapi.SafetyTagApi;
import com.pixida.safetytagapi.data.dto.SafetyTagScanResult;
import com.pixida.safetytagapi.interfaces.OnSafetyTagFoundListener;
import com.pixida.safetytagapi.interfaces.SafetyTagFinder;
import com.pixida.safetytagapi.data.dto.SafetyTagInfo;

public class SafetyTagModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public SafetyTagModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "SafetyTagModule";
    }

    @ReactMethod
    public void connectToFirstDiscoveredTag(final Promise promise) {
        SafetyTagApi safetyTagApi = SafetyTagApi.getInstance(reactContext);
        SafetyTagFinder tagFinder = safetyTagApi.getFinder();

        tagFinder.startDiscoveringTags(true, new OnSafetyTagFoundListener() {
            @Override
            public void onResult(SafetyTagScanResult scanResult) {
                if (scanResult instanceof SafetyTagScanResult.Success) {
                    SafetyTagInfo safetyTagInfo = ((SafetyTagScanResult.Success) scanResult).getSafetyTag();
                    safetyTagApi.getConnection().connectToTag(safetyTagInfo, false, false);
                    promise.resolve("Connected to tag: " + safetyTagInfo.getTag().getName());
                } else if (scanResult instanceof SafetyTagScanResult.Error) {
                    Log.e("SafetyTagModule", "Error discovering tags: " + ((SafetyTagScanResult.Error) scanResult).getError());
                    promise.reject("Error", "Could not discover tags.");
                }
            }
        });
    }
}
