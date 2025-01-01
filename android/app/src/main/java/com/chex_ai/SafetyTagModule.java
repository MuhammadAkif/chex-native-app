package com.chex_ai;

import android.bluetooth.BluetoothDevice;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.pixida.safetytagapi.SafetyTagApi;
import com.pixida.safetytagapi.data.dto.SafetyTagScanResult;
import com.pixida.safetytagapi.data.enums.SafetyTagStatus;
import com.pixida.safetytagapi.interfaces.OnConnectedListener;
import com.pixida.safetytagapi.interfaces.SafetyTagFinder;
import com.pixida.safetytagapi.data.dto.SafetyTagInfo;
import com.pixida.safetytagapi.interfaces.AuthenticationHandler;
import com.pixida.safetytagapi.data.enums.SafetyTagConnectionReasons;
// import com.pixida.safetytagapi.SafetyTagDisconnectReasons;

public class SafetyTagModule extends ReactContextBaseJavaModule {
    private final SafetyTagApi safetyTagApi;
    private final ReactApplicationContext reactContext;

    public SafetyTagModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.safetyTagApi = SafetyTagApi.Companion.getInstance(reactContext.getApplicationContext());
    }

    @Override
    public String getName() {
        return "SafetyTagModule";
    }

    @ReactMethod
    public void connectToFirstDiscoveredTag(Promise promise) {
        // Get the SafetyTagFinder instance
        SafetyTagFinder tagFinder = safetyTagApi.getFinder();
        // Start discovering tags
        tagFinder.startDiscoveringTags(false, scanResult -> {
            if (scanResult instanceof SafetyTagScanResult.Success) {
                try {
                    tagFinder.stopDiscoveringTags();
                    // Connect to the first discovered tag
                    safetyTagApi.getConnection().connectToTag(
                        ((SafetyTagScanResult.Success) scanResult).getSafetyTag(),
                        false,
                        false
                    );
                    promise.resolve("Successfully connected to the first discovered tag.");
                } catch (Exception e) {
                    promise.reject("CONNECTION_ERROR", "Failed to connect to the tag.", e);
                }
            } else if (scanResult instanceof SafetyTagScanResult.Error) {
                // Handle scan error
                String errorDetails = ((SafetyTagScanResult.Error) scanResult).getError().toString();
                Log.e("Foreground scan", "Could not scan, error: " + errorDetails);
                promise.reject("SCAN_ERROR", "Could not scan for tags: " + errorDetails);
            }
        });
    }

    @ReactMethod
    public void autoConnectToBondedTag(Promise promise) {
        // connect to first found tag
        SafetyTagFinder tagFinder = safetyTagApi.getFinder();

        // Start discovering tags
        tagFinder.startDiscoveringTags(false, scanResult -> {
            if (scanResult instanceof SafetyTagScanResult.Success) {
                try {
                    SafetyTagInfo tag = ((SafetyTagScanResult.Success) scanResult).getSafetyTag();

                    if (tag.isBonded()) {
                        tagFinder.stopDiscoveringTags();
                        safetyTagApi.getConnection().connectToTag(tag, false, false);
                    }
                    promise.resolve("Successfully connected to the bonded discovered tag.");
                } catch (Exception e) {
                    promise.reject("CONNECTION_ERROR", "Failed to connect to the bonded tag.", e);
                }
            }
            if (scanResult instanceof SafetyTagScanResult.Error) {
                // Handle scan error
                String errorDetails = ((SafetyTagScanResult.Error) scanResult).getError().toString();
                Log.e("Foreground scan", "Could not scan, error " + ((SafetyTagScanResult.Error) scanResult).getError());
                promise.reject("Foreground scan", "Could not scan, error : " + errorDetails);
            }
        });
    }
    // Method to subscribe to connection events
    @ReactMethod
    public void notifyOnDeviceReady() {
        safetyTagApi.getConnection().notifyOnConnected(new OnConnectedListener() {
            @Override
            public void onConnecting(@NonNull BluetoothDevice tag) {
                // Send connecting event
                sendConnectionEvent("onConnecting", tag.getName(), tag.getAddress(), null);
            }

            @Override
            public void error(@Nullable BluetoothDevice tag, @NonNull SafetyTagConnectionReasons reason) {
                // Send error event
                String tagName = tag != null ? tag.getName() : "Unknown";
                String tagAddress = tag != null ? tag.getAddress() : "Unknown";
                sendConnectionEvent("onConnectionError", tagName, tagAddress, reason.toString());
            }

            @Override
            public void authenticationRequired(@Nullable String tagName, @NonNull String tagAddress, @NonNull AuthenticationHandler authenticateWithKey) {
                // Send authentication required event (if fleet mode is enabled)
                sendConnectionEvent("onAuthenticationRequired", tagName, tagAddress, null);
            }

            @Override
            public void success(@NonNull BluetoothDevice tag) {
                // Send success event
                sendConnectionEvent("onConnected", tag.getName(), tag.getAddress(), null);
            }
        });
    }

    // Utility method to send connection event to React Native
    private void sendConnectionEvent(String eventName, String deviceName, String deviceAddress, String reason) {
        // Create an event map to send to React Native
        WritableMap event = Arguments.createMap();
        event.putString("deviceName", deviceName);
        event.putString("deviceAddress", deviceAddress);
        if (reason != null) {
            event.putString("reason", reason);
        }

        // Emit the event to JavaScript side
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, event);
    }

    // Method to disconnect from the device
    @ReactMethod
    public void disconnectFromDevice() {
        // Listen for disconnection events
        safetyTagApi.getConnection().notifyOnDisconnect((BluetoothDevice tag, SafetyTagConnectionReasons reason) -> {
            // Send disconnection event to React Native
            sendConnectionEvent("onDeviceDisconnected", tag != null ? tag.getName() : "Unknown",
                tag != null ? tag.getAddress() : "Unknown", reason != null ? reason.toString() : "Unknown");
        });

        // Perform disconnection
        safetyTagApi.getConnection().disconnectTag();
    }
}