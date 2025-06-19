package com.chex_ai;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.location.ActivityRecognitionResult;
import com.google.android.gms.location.DetectedActivity;

import java.util.List;

public class ActivityRecognitionService extends IntentService {
    private static final String TAG = "ActivityRecognition";
    private static ReactContext reactContext;

    public ActivityRecognitionService() {
        super("ActivityRecognitionService");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "ActivityRecognitionService initialized");
    }

    public static void setReactContext(ReactContext context) {
        reactContext = context;
        Log.d(TAG, "React context set for ActivityRecognitionService");
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(TAG, "onHandleIntent called");
        
        if (ActivityRecognitionResult.hasResult(intent)) {
            ActivityRecognitionResult result = ActivityRecognitionResult.extractResult(intent);
            if (result != null) {
                DetectedActivity mostProbableActivity = result.getMostProbableActivity();
                int activityType = mostProbableActivity.getType();
                int confidence = mostProbableActivity.getConfidence();
                String activityName = getActivityName(activityType);
                
                Log.d(TAG, "Detected activity: " + activityName + " with confidence: " + confidence);
                
                // Get all possible activities and their confidences
                List<DetectedActivity> probableActivities = result.getProbableActivities();
                for (DetectedActivity activity : probableActivities) {
                    Log.d(TAG, "Possible activity: " + getActivityName(activity.getType()) + 
                          " with confidence: " + activity.getConfidence());
                }
                
                // Emit event to React Native
                if (reactContext != null) {
                    WritableMap params = Arguments.createMap();
                    params.putString("activity", activityName);
                    params.putInt("confidence", confidence);
                    params.putInt("type", activityType);
                    
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("activityRecognitionUpdate", params);
                    
                    Log.d(TAG, "Emitted activity update to React Native: " + activityName);
                } else {
                    Log.e(TAG, "React context is null, cannot emit event");
                }
            } else {
                Log.w(TAG, "Activity recognition result is null");
            }
        } else {
            Log.w(TAG, "No activity recognition result in intent");
        }
    }

    private String getActivityName(int type) {
        String activityName;
        switch (type) {
            case DetectedActivity.IN_VEHICLE:
                activityName = "IN_VEHICLE";
                break;
            case DetectedActivity.ON_BICYCLE:
                activityName = "ON_BICYCLE";
                break;
            case DetectedActivity.ON_FOOT:
                activityName = "ON_FOOT";
                break;
            case DetectedActivity.STILL:
                activityName = "STILL";
                break;
            case DetectedActivity.TILTING:
                activityName = "TILTING";
                break;
            case DetectedActivity.WALKING:
                activityName = "WALKING";
                break;
            case DetectedActivity.RUNNING:
                activityName = "RUNNING";
                break;
            default:
                activityName = "UNKNOWN";
        }
        Log.d(TAG, "Activity type " + type + " mapped to " + activityName);
        return activityName;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "ActivityRecognitionService destroyed");
    }
} 