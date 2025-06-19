package com.chex_ai;

import android.Manifest;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.ActivityRecognition;
import com.google.android.gms.location.ActivityRecognitionClient;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;

public class ActivityRecognitionModule extends ReactContextBaseJavaModule {
    private static final String TAG = "ActivityRecognition";
    private final ReactApplicationContext reactContext;
    private ActivityRecognitionClient activityRecognitionClient;
    private PendingIntent pendingIntent;
    private static final int PERMISSION_REQUEST_CODE = 123;

    public ActivityRecognitionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.d(TAG, "ActivityRecognitionModule initialized");
        this.reactContext = reactContext;
        this.activityRecognitionClient = ActivityRecognition.getClient(reactContext);
        ActivityRecognitionService.setReactContext(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "ActivityRecognition";
    }

    private boolean checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            boolean hasPermission = ContextCompat.checkSelfPermission(reactContext,
                Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
            Log.d(TAG, "Permission check result: " + (hasPermission ? "GRANTED" : "DENIED"));
            return hasPermission;
        }
        Log.d(TAG, "Permission check not required for this Android version");
        return true;
    }

    @ReactMethod
    public void startActivityRecognition(Promise promise) {
        Log.d(TAG, "startActivityRecognition called");

        if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.ACTIVITY_RECOGNITION)
                != PackageManager.PERMISSION_GRANTED) {
            Log.d(TAG, "Permission check result: DENIED");
            promise.reject("PERMISSION_DENIED", "Activity recognition permission is required");
            return;
        }
        Log.d(TAG, "Permission check result: GRANTED");

        try {
            Intent intent = new Intent(reactContext, ActivityRecognitionService.class);
            PendingIntent pendingIntent = PendingIntent.getService(
                reactContext,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
            );
            Log.d(TAG, "PendingIntent created for ActivityRecognitionService");

            Task<Void> task = ActivityRecognition.getClient(reactContext)
                .requestActivityUpdates(
                    1000L, // 10 seconds
                    pendingIntent
                );
            Log.d(TAG, "Activity updates requested with 1-second interval");

            task.addOnSuccessListener(aVoid -> {
                Log.d(TAG, "Activity recognition started successfully");
                promise.resolve("Activity recognition started successfully");
            });

            task.addOnFailureListener(e -> {
                Log.e(TAG, "Failed to start activity recognition: " + e.getMessage());
                promise.reject("START_FAILED", e.getMessage());
            });
        } catch (Exception e) {
            Log.e(TAG, "Error starting activity recognition: " + e.getMessage());
            promise.reject("START_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopActivityRecognition(Promise promise) {
        Log.d(TAG, "stopActivityRecognition called");
        try {
            Intent intent = new Intent(reactContext, ActivityRecognitionService.class);
            PendingIntent pendingIntent = PendingIntent.getService(
                reactContext,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
            );
            Log.d(TAG, "Activity updates removal requested");

            Task<Void> task = ActivityRecognition.getClient(reactContext)
                .removeActivityUpdates(pendingIntent);

            task.addOnSuccessListener(aVoid -> {
                Log.d(TAG, "Activity recognition stopped successfully");
                promise.resolve("Activity recognition stopped successfully");
            });

            task.addOnFailureListener(e -> {
                Log.e(TAG, "Failed to stop activity recognition: " + e.getMessage());
                promise.reject("STOP_FAILED", e.getMessage());
            });
        } catch (Exception e) {
            Log.e(TAG, "Error stopping activity recognition: " + e.getMessage());
            promise.reject("STOP_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void checkPermission(final Promise promise) {
        Log.d(TAG, "checkPermission called");
        promise.resolve(checkPermission());
    }
}
