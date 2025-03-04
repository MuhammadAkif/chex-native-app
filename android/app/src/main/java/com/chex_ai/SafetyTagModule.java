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
import android.content.Intent;
import android.app.ActivityManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import androidx.core.app.NotificationCompat;
import android.app.Notification;
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
import com.pixida.safetytagapi.interfaces.AccelerometerDataListener;
import com.pixida.safetytagapi.data.dto.AccelerometerValue;
import com.pixida.safetytagapi.data.dto.AccelerometerAxisAlignmentParameters;
import com.pixida.safetytagapi.data.enums.AxisAlignmentStoppingReason;
import com.pixida.safetytagapi.data.dto.AxisAlignmentProcessState;
import com.pixida.safetytagapi.interfaces.OnAxisAlignmentListener;
import com.pixida.safetytagapi.interfaces.AxisAlignmentLocationListener;
import com.pixida.safetytagapi.data.dto.AxisAlignmentLocationData;
import com.pixida.safetytagapi.interfaces.AxisAlignmentLocationProvider;
import com.pixida.safetytagapi.data.dto.NotificationData;
import com.pixida.safetytagapi.interfaces.OnAxisAlignmentDataListener;
import com.pixida.safetytagapi.data.dto.AxisAlignmentData;
import com.pixida.safetytagapi.data.enums.AxisAlignmentLogOptions;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.lang.reflect.Method;
import java.util.Set;

public class SafetyTagModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private SafetyTagApi safetyTagApi;
    private MySafetyTagReceiver receiver;

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
                        true,
                        true
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
                        safetyTagApi.getConnection().connectToTag(tag, true, true);
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

    /* @ReactMethod
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
        } */

    @ReactMethod
    public void setCrashAveragingWindowSize(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashAveragingWindowSize(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully set crash averaging window size");
            } else {
                promise.reject("CONFIG_ERROR", "Failed to set crash averaging window size");
            }
        });
    }

    @ReactMethod
    public void setCrashThresholdXyNormalized(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashThresholdXyNormalized(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully set crash threshold XY");
            } else {
                promise.reject("CONFIG_ERROR", "Failed to set crash threshold XY");
            }
        });
    }

    @ReactMethod
    public void setCrashThresholdXyzNormalized(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashThresholdXyzNormalized(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully set crash threshold XYZ");
            } else {
                promise.reject("CONFIG_ERROR", "Failed to set crash threshold XYZ");
            }
        });
    }

    @ReactMethod
    public void setCrashNumberOfSurpassingThresholds(int value, Promise promise) {
        safetyTagApi.getDeviceConfiguration().setCrashNumberOfSurpassingThresholds(value, status -> {
            if (status.isSuccess()) {
                promise.resolve("Successfully set crash surpassing thresholds");
            } else {
                promise.reject("CONFIG_ERROR", "Failed to set crash surpassing thresholds");
            }
        });
    }

    @ReactMethod
    public void subscribeToCrashData() {
        safetyTagApi.getCrashDetection().notifyOnCrashDataReceived(new OnCrashDataListener() {
            @Override
            public void onCrashThresholdEventsReceived(CrashThresholdEvent crashThresholdEvent) {
                // Emits event when crash threshold is detected
                WritableMap event = Arguments.createMap();
                String crashThresholdJson = new Gson().toJson(crashThresholdEvent);
                event.putString("crashThresholdEvent", crashThresholdJson);
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onCrashThresholdEvent", event);
            }

            @Override
            public void onCrashDataReceived(List<CrashData> crashDataList, CrashDataStatus crashDataStatus) {
                // Emits event when crash data is received
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

   @ReactMethod
   public void subscribeToAccelerometerData() {
       safetyTagApi.getAccelerometer().subscribeAccelerometerDataStreamListener(new AccelerometerDataListener() {
           @Override
           public void onDataStreamReceived(@NonNull AccelerometerValue value) {
               WritableMap event = Arguments.createMap();
               event.putDouble("xAxis", value.getXAxisMg());
               event.putDouble("yAxis", value.getYAxisMg());
               event.putDouble("zAxis", value.getZAxisMg());
               event.putDouble("timestamp", value.getTimestampUnixMs());

               reactContext
                   .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                   .emit("onAccelerometerData", event);
           }

           @Override
           public void onError(@NonNull SafetyTagStatus reason) {
               WritableMap event = Arguments.createMap();
               event.putString("error", reason.name());
               reactContext
                   .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                   .emit("onAccelerometerError", event);
           }
       });
   }

   @ReactMethod
   public void enableAccelerometerDataStream(Promise promise) {
       safetyTagApi.getAccelerometer().enableAccelerometerDataStream(null, status -> {
           if (status.isSuccess()) {
               promise.resolve("Successfully enabled accelerometer data stream");
           } else {
               promise.reject("ACCELEROMETER_ERROR", "Failed to enable accelerometer data stream");
           }
       });
   }

   @ReactMethod
   public void disableAccelerometerDataStream(Promise promise) {
       safetyTagApi.getAccelerometer().disableAccelerometerDataStream(true, status -> {
           if (status.isSuccess()) {
               promise.resolve("Successfully disabled accelerometer data stream");
           } else {
               promise.reject("ACCELEROMETER_ERROR", "Failed to disable accelerometer data stream");
           }
       });
   }


    @ReactMethod
    private void requestNotificationPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Activity activity = getCurrentActivity();
            if (activity != null) {
                if (activity.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                    != android.content.pm.PackageManager.PERMISSION_GRANTED) {

                    activity.requestPermissions(
                        new String[]{android.Manifest.permission.POST_NOTIFICATIONS},
                        1001
                    );
                    promise.resolve(true);
                } else {
                    promise.resolve(true);
                }
            } else {
                promise.reject("ACTIVITY_ERROR", "Activity is not available");
            }
        } else {
            // Permission not required for Android < 13
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void startAccelerometerAxisAlignmentWithForegroundService(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            Activity activity = getCurrentActivity();
            if (activity != null) {
                if (activity.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                    != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                    promise.reject("PERMISSION_ERROR", "Notification permission not granted");
                    return;
                }
            }
        }

        AccelerometerAxisAlignmentParameters.Builder builder = new AccelerometerAxisAlignmentParameters.Builder();

        // Set detailed logging options in the builder using the correct method name
        builder.setLogOption(AxisAlignmentLogOptions.DETAILED);
        builder.startFromScratch(false);

        // Create notification data using the existing helper method
        NotificationData notificationData = createNotificationData();
        builder.foregroundServiceNotificationData(notificationData);

        SafetyTagStatus status = safetyTagApi.getAxisAlignment().startAccelerometerAxisAlignment(builder.build(new OnAxisAlignmentListener() {
            @Override
            public void onAxisAlignmentProcessStateChange(@NonNull AxisAlignmentProcessState state) {
                 Log.i("SafetyTagModule", "AxisAlignmentProcessState: " + state.toString());
                 WritableMap data = Arguments.createMap();
                 data.putString("step", state.getAlignmentProcessStep().name());
                 data.putString("movement", state.getMovement().name());
                 data.putString("speed", state.getSpeed().name());
                 data.putDouble("currentSpeed", state.getCurrentSpeed());
                 data.putDouble("currentHeading", state.getCurrentHeading());
                 sendAxisAlignmentEvent("onAxisAlignmentStateChange", data);
            }

            @Override
            public void onAxisAlignmentStarted() {
                sendAxisAlignmentEvent("onAxisAlignmentStarted", null);
            }

            @Override
            public void onAxisAlignmentSuccessful() {
                sendAxisAlignmentEvent("onAxisAlignmentSuccess", null);
            }

            @Override
            public void onAxisAlignmentStopped(@NonNull AxisAlignmentStoppingReason reason) {
                WritableMap data = Arguments.createMap();
                data.putString("reason", reason.name());
                sendAxisAlignmentEvent("onAxisAlignmentStopped", data);
            }

            @Override
            public void onError(@NonNull SafetyTagStatus status) {
                WritableMap data = Arguments.createMap();
                data.putString("error", status.name());
                sendAxisAlignmentEvent("onAxisAlignmentError", data);
            }
        }));

        if (status == SafetyTagStatus.OK) {
            promise.resolve("Successfully started axis alignment with detailed logging");
        } else {
            promise.reject("ALIGNMENT_ERROR", "Failed to start axis alignment: " + status.name());
        }
    }

   // Add method to stop service
   @ReactMethod
   public void stopAxisAlignment(Promise promise) {
       try {
           // First stop the axis alignment in the SDK
           safetyTagApi.getAxisAlignment().stopAccelerometerAxisAlignment(status -> {
               if (status.isSuccess()) {
                   // If SDK alignment is stopped successfully, stop the service
                   try {
                       Intent serviceIntent = new Intent(reactContext, SafetyTagAlignmentService.class);
                       reactContext.stopService(serviceIntent);
                       promise.resolve("Alignment stopped successfully");
                   } catch (Exception e) {
                       promise.reject("STOP_ERROR", "Failed to stop alignment service: " + e.getMessage());
                   }
               } else {
                   promise.reject("STOP_ERROR", "Failed to stop axis alignment: " + status.name());
               }
           });
       } catch (Exception e) {
           promise.reject("STOP_ERROR", "Failed to stop alignment: " + e.getMessage(), e);
       }
   }

   private void sendAxisAlignmentEvent(String eventName, @Nullable WritableMap data) {
       if (data == null) {
           data = Arguments.createMap();
       }
       reactContext
           .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
           .emit(eventName, data);
   }

   @ReactMethod
   public void isAlignmentServiceRunning(Promise promise) {
       ActivityManager manager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
       for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
           if (SafetyTagAlignmentService.class.getName().equals(service.service.getClassName())) {
               promise.resolve(true);
               return;
           }
       }
       promise.resolve(false);
   }

   @ReactMethod
   public void startDiscovery(Promise promise) {
       SafetyTagFinder tagFinder = safetyTagApi.getFinder();
       try {
           tagFinder.startDiscoveringTags(false, scanResult -> {
               if (scanResult instanceof SafetyTagScanResult.Success) {
                   SafetyTagInfo tag = ((SafetyTagScanResult.Success) scanResult).getSafetyTag();

                   // Create device info map with complete object details
                   WritableMap deviceInfo = Arguments.createMap();
                   deviceInfo.putString("rawObject", tag.toString());
                   deviceInfo.putString("className", tag.getClass().getName());
                   deviceInfo.putMap("properties", convertObjectToWritableMap(tag));

                   // Send complete info to React Native
                   WritableMap event = Arguments.createMap();
                   event.putMap("device", deviceInfo);

                   reactContext
                       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                       .emit("onDeviceFound", event);
               }
           });
           promise.resolve("Started discovering devices");
       } catch (Exception e) {
           promise.reject("DISCOVERY_ERROR", "Failed to start device discovery", e);
       }
   }

   private WritableMap convertObjectToWritableMap(Object object) {
       WritableMap map = Arguments.createMap();
       Class<?> clazz = object.getClass();

       // Get all methods
       for (Method method : clazz.getMethods()) {
           String methodName = method.getName();
           // Only process getter methods
           if (methodName.startsWith("get") || methodName.startsWith("is")) {
               try {
                   Object result = method.invoke(object);
                   if (result != null) {
                       map.putString(methodName, result.toString());
                   }
               } catch (Exception e) {
                   map.putString(methodName + "_error", e.getMessage());
               }
           }
       }

       return map;
   }

   @ReactMethod
   public void connectToDevice(String address, Promise promise) {
       SafetyTagFinder tagFinder = safetyTagApi.getFinder();
       try {
           final String normalizedRequestedAddress = address.trim().toUpperCase();

           tagFinder.startDiscoveringTags(false, scanResult -> {
               if (scanResult instanceof SafetyTagScanResult.Success) {
                   SafetyTagInfo tag = ((SafetyTagScanResult.Success) scanResult).getSafetyTag();
                   // Normalize the found tag address
                   String normalizedFoundAddress = tag.getTag().toString().trim().toUpperCase();

                   if (normalizedFoundAddress.equals(normalizedRequestedAddress)) {
                       tagFinder.stopDiscoveringTags();

                       try {
                           // Connect regardless of bond status
                           safetyTagApi.getConnection().connectToTag(tag, true, true);

                           // Send appropriate event based on bond status
                           WritableMap event = Arguments.createMap();
                           event.putString("address", address);
                           event.putString("status", tag.isBonded() ? "BONDED" : "UNBONDED");
                           reactContext
                               .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                               .emit("onDeviceConnected", event);

                           promise.resolve("Connected to device: " + address + " (Bond status: " + (tag.isBonded() ? "bonded" : "unbonded") + ")");
                       } catch (Exception e) {
                           promise.reject("CONNECTION_ERROR", "Failed to connect: " + e.getMessage());
                       }
                   }
               }
           });
       } catch (Exception e) {
           promise.reject("DISCOVERY_ERROR", "Failed to start device discovery: " + e.getMessage());
       }
   }

   @ReactMethod
   public void connectToBondedDevice(String address, Promise promise) {
       SafetyTagFinder tagFinder = safetyTagApi.getFinder();
       try {
           final String normalizedRequestedAddress = address.trim().toUpperCase();
           final long startTime = System.currentTimeMillis();
           final long TIMEOUT = 30000; // 30 seconds timeout

           tagFinder.startDiscoveringTags(false, scanResult -> {
               if (System.currentTimeMillis() - startTime > TIMEOUT) {
                   tagFinder.stopDiscoveringTags();
                   promise.reject("TIMEOUT_ERROR", "Device discovery timed out after 30 seconds");
                   return;
               }

               if (scanResult instanceof SafetyTagScanResult.Success) {
                   SafetyTagInfo tag = ((SafetyTagScanResult.Success) scanResult).getSafetyTag();
                   String normalizedFoundAddress = tag.getTag().toString().trim().toUpperCase();

                   if (normalizedFoundAddress.equals(normalizedRequestedAddress)) {
                       if (tag.isBonded()) {
                           tagFinder.stopDiscoveringTags();
                           try {
                               safetyTagApi.getConnection().connectToTag(tag, true, true);

                               // Send success event
                               WritableMap event = Arguments.createMap();
                               event.putString("address", address);
                               event.putString("status", "CONNECTED");
                               reactContext
                                   .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                   .emit("onBondedDeviceConnected", event);

                               promise.resolve("Connected to bonded device: " + address);
                           } catch (Exception e) {
                               promise.reject("CONNECTION_ERROR", "Failed to connect to bonded device: " + e.getMessage());
                           }
                       } else {
                           tagFinder.stopDiscoveringTags();
                           promise.reject("BOND_ERROR", "Device found but not bonded: " + address);
                       }
                   }
               } else if (scanResult instanceof SafetyTagScanResult.Error) {
                   String errorDetails = ((SafetyTagScanResult.Error) scanResult).getError().toString();
                   tagFinder.stopDiscoveringTags();
                   promise.reject("SCAN_ERROR", "Scan error: " + errorDetails);
               }
           });
       } catch (Exception e) {
           promise.reject("DISCOVERY_ERROR", "Failed to start bonded device discovery: " + e.getMessage());
       }
   }

   @ReactMethod
   public void startBackgroundScanWithInterval(double intervalMinutes, Promise promise) {
       try {
           // Validate interval
           long interval = (long) intervalMinutes;
           if (interval < SafetyTagFinder.MINIMUM_SCAN_INTERVAL_MINUTES) {
               interval = SafetyTagFinder.MINIMUM_SCAN_INTERVAL_MINUTES;
           }

           SafetyTagStatus status = safetyTagApi.getFinder().startDiscoveringTagsInBackground(interval);

           if (status == SafetyTagStatus.OK) {
               //startBackgroundScanStatusMonitoring();
               promise.resolve("Background scan started with " + interval + " minute interval");
           } else {
               promise.reject("BACKGROUND_SCAN_ERROR", "Failed to start background scan: " + status.name());
           }
       } catch (Exception e) {
           promise.reject("BACKGROUND_SCAN_ERROR", "Failed to start background scan: " + e.getMessage());
       }
   }

   @ReactMethod
   public void isBackgroundScanActive(Promise promise) {
       try {
           boolean isActive = safetyTagApi.getFinder().isBackgroundScanActive();
           promise.resolve(isActive);
       } catch (Exception e) {
           promise.reject("BACKGROUND_SCAN_ERROR", "Failed to check background scan status: " + e.getMessage());
       }
   }

   @ReactMethod
   public void getBackgroundScanStatus(Promise promise) {
       try {
           SafetyTagStatus status = safetyTagApi.getFinder().backgroundScanStatus();
           promise.resolve(status.name());
       } catch (Exception e) {
           promise.reject("BACKGROUND_SCAN_ERROR", "Failed to get background scan status: " + e.getMessage());
       }
   }

    public void sendEventToJS(String eventName, WritableMap params) {
           // Implementation to send events to React Native
           reactContext
               .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
               .emit(eventName, params);
       }

       @ReactMethod
       public void startBackgroundScan(Promise promise) {
           try {
               if (safetyTagApi == null) {
                   promise.reject("API_ERROR", "SafetyTagApi not initialized");
                   return;
               }

               // Store receiver as class field so we can unregister it later
               if (receiver != null) {
                       reactContext.unregisterReceiver(receiver);
               }

               receiver = new MySafetyTagReceiver(reactContext);
               IntentFilter intentFilter = new IntentFilter();
               intentFilter.addAction(SafetyTagFinder.SAFETY_TAG_API_TAG_FOUND);

               if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                   reactContext.registerReceiver(receiver, intentFilter, Context.RECEIVER_NOT_EXPORTED);
               } else {
                   reactContext.registerReceiver(receiver, intentFilter);
               }

               // Start background scan
               SafetyTagStatus status = safetyTagApi.getFinder().startDiscoveringTagsInBackground(SafetyTagFinder.DEFAULT_SCAN_INTERVAL_MINUTES);

               if (status == SafetyTagStatus.OK) {
                   promise.resolve("Background scan started successfully");
               } else {
                   promise.reject("BACKGROUND_SCAN_ERROR", "Failed to start background scan: " + status.name());
               }
           } catch (Exception e) {
               promise.reject("BACKGROUND_SCAN_ERROR", "Failed to start background scan: " + e.getMessage());
           }
       }

       @ReactMethod
       public void stopBackgroundScan(Promise promise) {
           try {
               if (safetyTagApi == null) {
                   promise.reject("API_ERROR", "SafetyTagApi not initialized");
                   return;
               }

               if (receiver != null) {
                   try {
                       reactContext.unregisterReceiver(receiver);
                       receiver = null;
                   } catch (Exception e) {
                   }
               }

               SafetyTagStatus status = safetyTagApi.getFinder().stopDiscoveringTagsInBackground();
               if (status == SafetyTagStatus.OK) {
                   promise.resolve("Background scan stopped successfully");
               } else {
                   promise.reject("BACKGROUND_SCAN_ERROR", "Failed to stop background scan: " + status.name());
               }
           } catch (Exception e) {
               promise.reject("BACKGROUND_SCAN_ERROR", "Failed to stop background scan: " + e.getMessage());
           }
       }

   @ReactMethod
   public void getAutoConnectAddresses(Promise promise) {
       try {
           Set<String> addresses = safetyTagApi.getAutoConnection().getAutoConnectAddresses();
           WritableArray addressArray = Arguments.createArray();
           for (String address : addresses) {
               addressArray.pushString(address);
           }
           promise.resolve(addressArray);
       } catch (Exception e) {
           promise.reject("AUTO_CONNECT_ERROR", "Failed to get auto-connect addresses: " + e.getMessage());
       }
   }

   @ReactMethod
   public void removeTagFromAutoConnect(String deviceAddress, Promise promise) {
       try {
           SafetyTagStatus status = safetyTagApi.getAutoConnection().removeTagFromAutoConnect(deviceAddress);
           if (status == SafetyTagStatus.OK) {
               promise.resolve("Successfully removed device from auto-connect list");
           } else {
               promise.reject("AUTO_CONNECT_ERROR", "Failed to remove device: " + status.name());
           }
       } catch (Exception e) {
           promise.reject("AUTO_CONNECT_ERROR", "Failed to remove device from auto-connect list: " + e.getMessage());
       }
   }

   @ReactMethod
   public void clearAutoConnectList(Promise promise) {
       try {
           safetyTagApi.getAutoConnection().clearAutoConnectList();
           promise.resolve("Successfully cleared auto-connect list");
       } catch (Exception e) {
           promise.reject("AUTO_CONNECT_ERROR", "Failed to clear auto-connect list: " + e.getMessage());
       }
   }

   @ReactMethod
   public void isDeviceConnected(Promise promise) {
       try {
           boolean isConnected = safetyTagApi.getConnection().isDeviceConnected();
           promise.resolve(isConnected);
       } catch (Exception e) {
           promise.reject("ERROR", "Failed to check device connection: " + e.getMessage());
       }
   }

   @ReactMethod
   public void getConnectedDevice(Promise promise) {
       try {
           if (!safetyTagApi.getConnection().isDeviceConnected()) {
               promise.reject("ERROR", "No device connected");
               return;
           }

           SafetyTagInfo device = safetyTagApi.getConnection().getConnectedDevice();

           WritableMap deviceInfo = Arguments.createMap();
           deviceInfo.putString("address", device.getTag().toString());
           deviceInfo.putBoolean("isBonded", device.isBonded());
           deviceInfo.putInt("rssi", device.getRssi());
           deviceInfo.putString("advertisementMode", device.getAdvertisementMode().toString());

           promise.resolve(deviceInfo);
       } catch (Exception e) {
           promise.reject("ERROR", "Failed to get connected device: " + e.getMessage());
       }
   }

   @ReactMethod
   public void setLogLevel(String level) {
       try {
           int logLevel;
           switch (level.toUpperCase()) {
               case "VERBOSE":
                   logLevel = Log.VERBOSE;
                   break;
               case "DEBUG":
                   logLevel = Log.DEBUG;
                   break;
               case "INFO":
                   logLevel = Log.INFO;
                   break;
               case "WARN":
                   logLevel = Log.WARN;
                   break;
               case "ERROR":
                   logLevel = Log.ERROR;
                   break;
               default:
                   logLevel = Log.VERBOSE;
           }

           if (safetyTagApi != null) {
               Log.i("SafetyTagModule", "Setting log level to: " + level);
               safetyTagApi.setLogLevel(logLevel);
               Log.i("SafetyTagModule", "Log level set successfully to: " + level);
           } else {
               Log.e("SafetyTagModule", "SafetyTagApi not initialized");
           }
       } catch (Exception e) {
           Log.e("SafetyTagModule", "Failed to set log level: " + e.getMessage());
       }
   }

   private NotificationData createNotificationData() {
       String channelId = "safety_tag_alignment";
       String channelName = "Safety Tag Alignment";
       int notificationId = 1001;

       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
           NotificationChannel channel = new NotificationChannel(
               channelId,
               channelName,
               NotificationManager.IMPORTANCE_LOW
           );
           NotificationManager manager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);
           manager.createNotificationChannel(channel);
       }

       NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, channelId)
           .setContentTitle("Safety Tag Alignment")
           .setContentText("Alignment in progress...")
           .setSmallIcon(android.R.drawable.ic_dialog_info)
           .setPriority(NotificationCompat.PRIORITY_LOW)
           .setOngoing(true);

       return new NotificationData(notificationId, builder.build());
   }
}
