package com.chexnativeapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.ActivityTransition;
import com.google.android.gms.location.ActivityTransitionEvent;
import com.google.android.gms.location.ActivityTransitionResult;
import com.google.android.gms.location.DetectedActivity;
import com.chex_ai.MainApplication;

public class ActivityRecognitionReceiver extends BroadcastReceiver {
    private static final String TAG = "ActivityRecognitionReceiver";
    private static final String[] ACTIVITY_TYPES = {
        "UNKNOWN",
        "IN_VEHICLE",
        "ON_BICYCLE",
        "ON_FOOT",
        "STILL",
        "TILTING",
        "WALKING",
        "RUNNING"
    };

    public ActivityRecognitionReceiver() {
        Log.d(TAG, "ActivityRecognitionReceiver is initialized");
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Received activity update");

        if (!"com.chexnativeapp.ACTIVITY_RECOGNITION".equals(intent.getAction())) {
            Log.d(TAG, "Received intent with wrong action: " + intent.getAction());
            return;
        }

        if (ActivityTransitionResult.hasResult(intent)) {
            ActivityTransitionResult result = ActivityTransitionResult.extractResult(intent);
            for (ActivityTransitionEvent event : result.getTransitionEvents()) {
                int activityType = event.getActivityType();
                int transitionType = event.getTransitionType();

                Log.d(TAG, "Activity transition: " + ACTIVITY_TYPES[activityType] +
                          " transition: " + (transitionType == ActivityTransition.ACTIVITY_TRANSITION_ENTER ? "ENTER" : "EXIT"));

                WritableMap params = Arguments.createMap();
                params.putString("type", ACTIVITY_TYPES[activityType]);
                params.putString("transition", transitionType == ActivityTransition.ACTIVITY_TRANSITION_ENTER ? "ENTER" : "EXIT");
                params.putDouble("timestamp", System.currentTimeMillis());

                try {
                    ReactContext reactContext = ((MainApplication) context.getApplicationContext())
                        .getReactNativeHost()
                        .getReactInstanceManager()
                        .getCurrentReactContext();

                    if (reactContext != null) {
                        Log.d(TAG, "Emitting activity event to JS");
                        reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("ActivityChanged", params);
                    } else {
                        Log.e(TAG, "React context is null");
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error emitting activity event", e);
                }
            }
        } else {
            Log.d(TAG, "No activity transition result in intent");
        }
    }
}
