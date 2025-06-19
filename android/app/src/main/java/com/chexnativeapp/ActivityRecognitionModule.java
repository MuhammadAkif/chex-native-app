package com.chexnativeapp;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityRecognitionClient;
import com.google.android.gms.location.ActivityTransition;
import com.google.android.gms.location.ActivityTransitionRequest;
import com.google.android.gms.location.DetectedActivity;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import java.util.ArrayList;
import java.util.List;

public class ActivityRecognitionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "ActivityRecognitionModule";
    private final ReactApplicationContext reactContext;
    private ActivityRecognitionClient activityRecognitionClient;
    private PendingIntent pendingIntent;
    private static final int PERMISSION_REQUEST_CODE = 123;

    public ActivityRecognitionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(TAG, "ActivityRecognitionModule constructor called");
        this.reactContext = reactContext;
        this.activityRecognitionClient = ActivityRecognition.getClient(reactContext);
        Log.d(TAG, "ActivityRecognitionClient initialized");
    }

    @NonNull
    @Override
    public String getName() {
        Log.d(TAG, "getName called, returning: ActivityRecognition");
        return "ActivityRecognition";
    }

    @ReactMethod
    public void requestPermissions(Promise promise) {
        Log.d(TAG, "requestPermissions called");
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            Log.d(TAG, "Android Q or higher detected, checking ACTIVITY_RECOGNITION permission");
            if (ContextCompat.checkSelfPermission(reactContext, 
                Manifest.permission.ACTIVITY_RECOGNITION) != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "ACTIVITY_RECOGNITION permission not granted, requesting...");
                ActivityCompat.requestPermissions(
                    reactContext.getCurrentActivity(),
                    new String[]{Manifest.permission.ACTIVITY_RECOGNITION},
                    PERMISSION_REQUEST_CODE
                );
                Log.d(TAG, "Permission request sent, rejecting promise");
                promise.reject("PERMISSION_DENIED", "Activity recognition permission not granted");
                return;
            }
            Log.d(TAG, "ACTIVITY_RECOGNITION permission already granted");
        } else {
            Log.d(TAG, "Android version below Q, no runtime permission needed");
        }
        Log.d(TAG, "Resolving permission promise with true");
        promise.resolve(true);
    }

    private ActivityTransitionRequest buildTransitionRequest() {
        Log.d(TAG, "Building activity transition request");
        List<ActivityTransition> transitions = new ArrayList<>();
        
        // Add transitions for all activities we want to monitor
        Log.d(TAG, "Adding transitions for IN_VEHICLE");
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.IN_VEHICLE)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.IN_VEHICLE)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

        Log.d(TAG, "Adding transitions for ON_FOOT");
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.ON_FOOT)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.ON_FOOT)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

        Log.d(TAG, "Adding transitions for WALKING");
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.WALKING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.WALKING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

        Log.d(TAG, "Adding transitions for RUNNING");
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.RUNNING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.RUNNING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

        Log.d(TAG, "Adding transitions for STILL");
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());
        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

        Log.d(TAG, "Created transition request with " + transitions.size() + " transitions");
        return new ActivityTransitionRequest(transitions);
    }

    @ReactMethod
    public void startActivityRecognition() {
        Log.d(TAG, "startActivityRecognition called");
        try {
            Intent intent = new Intent(reactContext, ActivityRecognitionReceiver.class);
            intent.setAction("com.chexnativeapp.ACTIVITY_RECOGNITION");
            Log.d(TAG, "Created intent with action: " + intent.getAction());
            
            pendingIntent = PendingIntent.getBroadcast(
                reactContext,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
            );
            Log.d(TAG, "Created PendingIntent");

            ActivityTransitionRequest request = buildTransitionRequest();
            Log.d(TAG, "Built transition request, requesting updates...");
            
            activityRecognitionClient.requestActivityTransitionUpdates(request, pendingIntent)
                .addOnSuccessListener(new OnSuccessListener<Void>() {
                    @Override
                    public void onSuccess(Void aVoid) {
                        Log.d(TAG, "Successfully started activity recognition");
                        WritableMap params = Arguments.createMap();
                        params.putString("status", "started");
                        sendEvent("ActivityRecognitionStatus", params);
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        Log.e(TAG, "Failed to start activity recognition", e);
                        WritableMap params = Arguments.createMap();
                        params.putString("status", "error");
                        params.putString("error", e.getMessage());
                        sendEvent("ActivityRecognitionStatus", params);
                    }
                });
        } catch (Exception e) {
            Log.e(TAG, "Error in startActivityRecognition", e);
        }
    }

    @ReactMethod
    public void stopActivityRecognition() {
        Log.d(TAG, "stopActivityRecognition called");
        if (pendingIntent != null) {
            try {
                Log.d(TAG, "Removing activity transition updates");
                activityRecognitionClient.removeActivityTransitionUpdates(pendingIntent)
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "Successfully stopped activity recognition");
                            WritableMap params = Arguments.createMap();
                            params.putString("status", "stopped");
                            sendEvent("ActivityRecognitionStatus", params);
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.e(TAG, "Failed to stop activity recognition", e);
                            WritableMap params = Arguments.createMap();
                            params.putString("status", "error");
                            params.putString("error", e.getMessage());
                            sendEvent("ActivityRecognitionStatus", params);
                        }
                    });
                pendingIntent = null;
                Log.d(TAG, "PendingIntent set to null");
            } catch (Exception e) {
                Log.e(TAG, "Error in stopActivityRecognition", e);
            }
        } else {
            Log.d(TAG, "No pending intent to stop");
        }
    }

    public void sendEvent(String eventName, WritableMap params) {
        Log.d(TAG, "Sending event: " + eventName + " with params: " + params.toString());
        try {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
            Log.d(TAG, "Event sent successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error sending event", e);
        }
    }

    @Override
    public void onCatalystInstanceDestroy() {
        Log.d(TAG, "onCatalystInstanceDestroy called");
        super.onCatalystInstanceDestroy();
        stopActivityRecognition();
    }
} 