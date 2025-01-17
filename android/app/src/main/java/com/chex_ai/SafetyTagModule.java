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
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import android.app.ActivityManager;

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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.lang.reflect.Method;

public class SafetyTagModule extends ReactContextBaseJavaModule {
    private final SafetyTagApi safetyTagApi;
    private final ReactApplicationContext reactContext;
    private AxisAlignmentLocationProvider locationProvider;
    private AxisAlignmentLocationListener currentListener;

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
   public void startAxisAlignment(Promise promise) {
       try {
           AccelerometerAxisAlignmentParameters.Builder builder = new AccelerometerAxisAlignmentParameters.Builder();
           
           // Create notification for background operation
           NotificationData notificationData = createNotificationData();
           builder.foregroundServiceNotificationData(notificationData);

           // Add location provider
           locationProvider = new AxisAlignmentLocationProvider() {
               @Override
               public void subscribeLocationListener(@NonNull AxisAlignmentLocationListener alignmentListener) {
                   currentListener = alignmentListener; // Store the listener
                   reactContext
                       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                       .emit("startLocationUpdates", null);
               }

               @Override
               public void unsubscribeLocationListener(@NonNull AxisAlignmentLocationListener alignmentListener) {
                   if (currentListener == alignmentListener) {
                       currentListener = null;
                   }
                   reactContext
                       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                       .emit("stopLocationUpdates", null);
               }
           };

           builder.locationProvider(locationProvider);

           // Start the foreground service
           Intent serviceIntent = new Intent(reactContext, SafetyTagAlignmentService.class);
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
               reactContext.startForegroundService(serviceIntent);
           } else {
               reactContext.startService(serviceIntent);
           }

           SafetyTagStatus status = safetyTagApi.getAxisAlignment()
               .startAccelerometerAxisAlignment(builder.build(new OnAxisAlignmentListener() {
                   @Override
                   public void onAxisAlignmentStarted() {
                       sendAxisAlignmentEvent("onAxisAlignmentStarted", null);
                   }

                   @Override
                   public void onAxisAlignmentSuccessful() {
                       sendAxisAlignmentEvent("onAxisAlignmentSuccess", null);
                   }

                   @Override
                   public void onAxisAlignmentStopped(AxisAlignmentStoppingReason reason) {
                       WritableMap data = Arguments.createMap();
                       data.putString("reason", reason.name());
                       sendAxisAlignmentEvent("onAxisAlignmentStopped", data);
                   }

                   @Override
                   public void onAxisAlignmentProcessStateChange(AxisAlignmentProcessState state) {
                       WritableMap data = Arguments.createMap();
                       data.putString("step", state.getAlignmentProcessStep().name());
                       data.putString("movement", state.getMovement().name());
                       data.putString("speed", state.getSpeed().name());
                       data.putDouble("currentSpeed", state.getCurrentSpeed());
                       data.putDouble("currentHeading", state.getCurrentHeading());
                       sendAxisAlignmentEvent("onAxisAlignmentStateChange", data);
                   }

                   @Override
                   public void onError(SafetyTagStatus error) {
                       WritableMap data = Arguments.createMap();
                       data.putString("error", error.name());
                       sendAxisAlignmentEvent("onAxisAlignmentError", data);
                   }
               })
           );

           if (status == SafetyTagStatus.OK) {
               promise.resolve("Successfully started axis alignment");
           } else {
               promise.reject("ALIGNMENT_ERROR", "Failed to start axis alignment: " + status.name());
           }
       } catch (Exception e) {
           promise.reject("ALIGNMENT_ERROR", "Failed to start axis alignment: " + e.getMessage(), e);
       }
   }

   private NotificationData createNotificationData() {
       return new NotificationData(
           1001, // Notification ID
           createNotification()
       );
   }

   private Notification createNotification() {
       String channelId = "safety_tag_alignment";
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
           NotificationChannel channel = new NotificationChannel(
               channelId,
               "Safety Tag Alignment",
               NotificationManager.IMPORTANCE_LOW
           );
           NotificationManager manager = (NotificationManager) reactContext
               .getSystemService(Context.NOTIFICATION_SERVICE);
           manager.createNotificationChannel(channel);
       }

       return new NotificationCompat.Builder(reactContext, channelId)
           .setContentTitle("Safety Tag Alignment")
           .setContentText("Alignment in progress...")
           .setSmallIcon(R.mipmap.ic_launcher)
           .setPriority(NotificationCompat.PRIORITY_LOW)
           .setOngoing(true)
           .build();
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
                       
                       // Clear the location provider and listener
                       if (currentListener != null) {
                           currentListener = null;
                       }
                       
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

   // Add method to receive location updates from React Native
   @ReactMethod
   public void updateAxisAlignmentLocation(double heading, double speed, double timestamp, double elapsedRealtime) {
       try {
           if (currentListener != null) { // Use the stored listener
               AxisAlignmentLocationData locationData = new AxisAlignmentLocationData(
                   heading,
                   speed,
                   (long) timestamp,
                   (long) elapsedRealtime
               );
               
               currentListener.onNewLocation(locationData);
           }
       } catch (Exception e) {
           Log.e("SafetyTagModule", "Error updating location: " + e.getMessage());
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
                           safetyTagApi.getConnection().connectToTag(tag, false, false);
                           
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
                               safetyTagApi.getConnection().connectToTag(tag, false, false);
                               
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
}