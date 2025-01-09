package com.chex_ai;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.util.Log;
import android.app.Activity;
import androidx.annotation.RequiresApi;
import android.os.Build;
import android.content.IntentFilter;

import com.google.gson.Gson;

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
import com.pixida.safetytagapi.interfaces.OnTripDataListener;
import com.pixida.safetytagapi.data.dto.Trip;
import com.pixida.safetytagapi.interfaces.OnTripEventListener;
import com.pixida.safetytagapi.data.dto.TripEvent;
import com.pixida.safetytagapi.interfaces.OnDeviceConfigurationDataListener;
import com.pixida.safetytagapi.data.enums.DeviceConfiguration;
import com.pixida.safetytagapi.interfaces.OnCrashDataListener;
import com.pixida.safetytagapi.data.dto.CrashThresholdEvent;
import com.pixida.safetytagapi.data.enums.CrashDataStatus;
import com.pixida.safetytagapi.data.dto.CrashData;
import com.pixida.safetytagapi.data.dto.VersionInfo;
import com.pixida.safetytagapi.interfaces.DeviceInformation;
import com.pixida.safetytagapi.interfaces.ReadBatteryLevelListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

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
    public void stopDiscoveringTags(Promise promise) {
        SafetyTagFinder tagFinder = safetyTagApi.getFinder();
        try {
            tagFinder.stopDiscoveringTags();
            promise.resolve("Successfully stopped discovering tags.");
        } catch (Exception e) {
            promise.reject("CONNECTION_ERROR", "Failed to stop discovering tags.", e);
        }
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
                sendConnectionEvent("onConnecting", tag.getName(), tag.getAddress(), null);
            }

            @Override
            public void error(@Nullable BluetoothDevice tag, @NonNull SafetyTagConnectionReasons reason) {
                String tagName = tag != null ? tag.getName() : "Unknown";
                String tagAddress = tag != null ? tag.getAddress() : "Unknown";
                sendConnectionEvent("onConnectionError", tagName, tagAddress, reason.toString());
            }

            @Override
            public void authenticationRequired(@Nullable String tagName, @NonNull String tagAddress, @NonNull AuthenticationHandler authenticateWithKey) {
                sendConnectionEvent("onAuthenticationRequired", tagName, tagAddress, null);
            }

            @Override
            public void success(@NonNull BluetoothDevice tag) {
                sendConnectionEvent("onConnected", tag.getName(), tag.getAddress(), null);
            }
        });
    }

    private void emitEvent(String eventName, WritableMap event) {
        // Ensure that the event is sent to JavaScript side only when the ReactContext is available
        if (reactContext != null) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, event);
        }
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

          reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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

    @SuppressLint("SetTextI18n")
    @ReactMethod
    public void queryTripData(Promise promise) {
        Activity activity = getCurrentActivity();

        safetyTagApi.getTripDetection().queryTripData(new OnTripDataListener() {
            @Override
            public void onSuccess(@NonNull List <Trip> trips) {
                if (trips != null && !trips.isEmpty()) {
                    // Create an array to store the trip data for React Native
                    StringBuilder sb = new StringBuilder();
                    for (Trip trip: trips) {
                        sb.append(trip.toString());
                        sb.append('\n');
                    }
                    promise.resolve(sb.toString());

                    // Optionally, you could emit an event to notify React Native
                    sendTripDataEvent("onTripDataSuccess", sb.toString());
                } else {
                    promise.reject("NO_TRIP_DATA", "No trip data available");
                    sendTripDataEvent("onTripDataError", "No trip data found");
                }
            }

            @Override
            public void onError(@NonNull SafetyTagStatus reason) {
                promise.reject("ERROR_QUERY_FAILED", "Query failed with " + reason);

                // Emit error event
                sendTripDataEvent("onTripDataError", reason.toString());
                Log.e("SafetyTagModule", "Query failed with: " + reason);
            }
        }, 20000);
    }

    @SuppressLint("SetTextI18n")
    @ReactMethod
    public void queryFullTripDataWithFraudDetection(Promise promise) {
        Activity activity = getCurrentActivity();

        safetyTagApi.getTripDetection().queryTripDataWithFraudDetection(new OnTripDataListener() {
            @Override
            public void onSuccess(@NonNull List <Trip> trips) {
                if (trips != null && !trips.isEmpty()) {
                    // Create an array to store the trip data for React Native
                    StringBuilder sb = new StringBuilder();
                    for (Trip trip: trips) {
                        sb.append(trip.toString());
                        sb.append('\n');
                    }
                    promise.resolve(sb.toString());

                    // Optionally, you could emit an event to notify React Native
                    sendTripDataEvent("onTripDataWithFraudSuccess", sb.toString());
                } else {
                    promise.reject("NO_TRIP_DATA_FRAUD", "No trip data with fraud available");
                    sendTripDataEvent("onTripDataWithFraudError", "No trip data with fraud found");
                }
            }

            @Override
            public void onError(@NonNull SafetyTagStatus reason) {
                promise.reject("ERROR_QUERY_FAILED", "Query failed with " + reason);

                // Emit error event
                sendTripDataEvent("onTripDataWithFraudError", reason.toString());
                Log.e("SafetyTagModule", "Query failed with: " + reason);
            }
        }, 20000);
    }

    private void sendTripDataEvent(String eventName, Object eventData) {
        WritableMap event = Arguments.createMap();
        if (eventData instanceof WritableArray) {
            event.putArray("tripData", (WritableArray) eventData);
        } else if (eventData instanceof String) {
            event.putString("message", (String) eventData);
        }

        // Emit the event to React Native
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, event);
    }

    @ReactMethod
    public void configTripStartRecognitionForce(int value, Promise promise) {

        safetyTagApi.getDeviceConfiguration().setTripStartRecognitionForce(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully configured trip start recognition force");
                Log.i("SafetyTagModule", "Successfully configured trip start recognition force");
            } else {
                promise.reject("CONFIG_FAILED", "Failed to configure trip start recognition force");
                Log.e("SafetyTagModule", "Failed to configure trip start recognition force");
            }
        });
    }

    @ReactMethod
    public void configTripStartRecognitionDuration(int value, Promise promise) {

        safetyTagApi.getDeviceConfiguration().setTripStartRecognitionDuration(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully configured trip start recognition duration");
                Log.i("SafetyTagModule", "Successfully configured trip start recognition duration");
            } else {
                promise.reject("CONFIG_FAILED", "Failed to configure trip start recognition duration");
                Log.e("SafetyTagModule", "Failed to configure trip start recognition duration");
            }
        });
    }

    @ReactMethod
    public void configTripEndTimeout(int value, Promise promise) {

        safetyTagApi.getDeviceConfiguration().setTripEndTimeout(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully configured trip end timeout");
                Log.i("SafetyTagModule", "Successfully configured trip end timeout");
            } else {
                promise.reject("CONFIG_FAILED", "Failed to configure trip end timeout");
                Log.e("SafetyTagModule", "Failed to configure trip end timeout");
            }
        });
    }

    @ReactMethod
    public void configTripMinimalDuration(int value, Promise promise) {

        safetyTagApi.getDeviceConfiguration().setTripMinimalDuration(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully configured minimal trip duration");
                Log.i("SafetyTagModule", "Successfully configured minimal trip duration");
            } else {
                promise.reject("CONFIG_FAILED", "Failed to configure minimal trip duration");
                Log.e("SafetyTagModule", "Failed to configure minimal trip duration");
            }
        });
    }

    @ReactMethod
    public void subscribeToTripStartAndEndEvents() {

        safetyTagApi.getTripDetection().notifyOnTripEvent(
            new OnTripEventListener() {
                @Override
                public void onTripEvent(TripEvent tripEvent) {
                    // Use Gson to convert the entire tripEvent object into a JSON string
                    String tripEventJson = new Gson().toJson(tripEvent);

                    // Create a WritableMap and put the JSON string into it
                    WritableMap event = Arguments.createMap();
                    event.putString("tripEventJson", tripEventJson);

                     reactContext
                     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("onTripStart", event);
                }

                @Override
                public void onError(SafetyTagStatus status) {
                    // Handle error and send the error status to React Native
                    WritableMap event = Arguments.createMap();
                    event.putString("error", status.name());

                    reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onTripStartError", event);
                }
            },
            new OnTripEventListener() {
                @Override
                public void onTripEvent(TripEvent tripEvent) {
                    // Use Gson to convert the entire tripEvent object into a JSON string
                    String tripEventJson = new Gson().toJson(tripEvent);

                    // Create a WritableMap and put the JSON string into it
                    WritableMap event = Arguments.createMap();
                    event.putString("tripEventJson", tripEventJson);

                    reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onTripEnd", event);
                }

                @Override
                public void onError(SafetyTagStatus status) {
                    // Handle error for trip end and send the error status to React Native
                    WritableMap event = Arguments.createMap();
                    event.putString("error", status.name());

                    // Emit the error event to React Native
                     reactContext
                     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                     .emit("onTripEndError", event);
                }
            }
        );
    }

    @ReactMethod
    public void readDeviceConfiguration(Promise promise) {
        String TAG;
        safetyTagApi.getDeviceConfiguration().readDeviceConfigurations(new OnDeviceConfigurationDataListener() {
            @Override
            public void onSuccess(@NonNull Map <DeviceConfiguration, Integer> configValues) {
                try {
                    // Convert the Map to a JSON-friendly format
                    WritableMap resultMap = Arguments.createMap();
                    for (Map.Entry <DeviceConfiguration, Integer> entry: configValues.entrySet()) {
                        resultMap.putInt(entry.getKey().toString(), entry.getValue());
                    }
                    promise.resolve(resultMap);
                } catch (Exception e) {
                    promise.reject("PARSE_ERROR", "Error parsing configurations");
                }
            }

            @Override
            public void onError(@NonNull SafetyTagStatus reason) {
                promise.reject("READ_ERROR", "Failed to read device configurations");
            }
        });
    }

    @ReactMethod
    public void setCrashAveragingWindowSize(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashAveragingWindowSize(value, status -> handleStatus(status, promise));
    }

    @ReactMethod
    public void setCrashThresholdXyNormalized(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashThresholdXyNormalized(value, status -> handleStatus(status, promise));
    }

    @ReactMethod
    public void setCrashThresholdXyzNormalized(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashThresholdXyzNormalized(value, status -> handleStatus(status, promise));
    }

    @ReactMethod
    public void setCrashNumberOfSurpassingThresholds(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashNumberOfSurpassingThresholds(value, status -> handleStatus(status, promise));
    }

    private void handleStatus(@NonNull SafetyTagStatus status, Promise promise) {
        WritableMap event = Arguments.createMap();
        event.putString("error", status.name());
        if (status.isSuccess()) {
            promise.resolve("Success");
        } else {
            promise.reject("ERROR", "Failed to update configuration: " + event);
        }
    }

    @ReactMethod
    public void subscribeToCrashData() {
        safetyTagApi.getCrashDetection().notifyOnCrashDataReceived(new OnCrashDataListener() {
            @Override
            public void onCrashThresholdEventsReceived(CrashThresholdEvent crashThresholdEvent) {
                // Convert CrashThresholdEvent to JSON and emit it to React Native
                WritableMap event = Arguments.createMap();
                String crashThresholdJson = new Gson().toJson(crashThresholdEvent);
                event.putString("crashThresholdEvent", crashThresholdJson);
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCrashThresholdEvent", event);
            }

            @Override
            public void onCrashDataReceived(List<CrashData> crashDataList, CrashDataStatus crashDataStatus) {
                // Convert CrashData list to JSON and emit it to React Native
                WritableMap event = Arguments.createMap();
                String crashDataJson = new Gson().toJson(crashDataList);
                event.putString("crashData", crashDataJson);
                event.putString("crashDataStatus", crashDataStatus.name());
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCrashDataReceived", event);
            }

            @Override
            public void onError(SafetyTagStatus reason) {
                // Emit error to React Native
                WritableMap event = Arguments.createMap();
                event.putString("error", reason.name());
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCrashDataError", event);
            }
        });
    }

   @ReactMethod
   public void getDeviceInformation(Promise promise) {
       try {
           // Access the DeviceInformation instance
           DeviceInformation deviceInformation = safetyTagApi.getDeviceInformation();

           // Create a response map to send details about DeviceInformation
           WritableMap responseMap = Arguments.createMap();
           responseMap.putString("className", deviceInformation.getClass().getName());
           responseMap.putString("methods", Arrays.toString(deviceInformation.getClass().getMethods()));

           promise.resolve(responseMap); // Send this data to React Native
       } catch (Exception e) {
           promise.reject("DEVICE_INFO_ERROR", "Failed to get Device Information", e);
       }
   }

   @ReactMethod
   public void readBatteryLevel(Promise promise) {
       safetyTagApi.getDeviceInformation().readBatteryLevel(new ReadBatteryLevelListener() {
           @Override
           public void onSuccess(int batteryLevel) {
               promise.resolve(batteryLevel); // Send the battery level to React Native
           }

           @Override
           public void onError(SafetyTagStatus status) {
               WritableMap event = Arguments.createMap();
               event.putString("error", status.name());
               promise.reject("BATTERY_LEVEL_ERROR", "Failed to read battery level", event);
           }
       });
   }

}