import Foundation
import CoreMotion
import React

@objc(ActivityRecognition)
class ActivityRecognition: RCTEventEmitter {
    private let motionActivityManager = CMMotionActivityManager()
    private let activityQueue = OperationQueue()
    private var isMonitoring = false
    
    override init() {
        super.init()
        activityQueue.name = "com.chexnativeapp.activityRecognition"
    }
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String] {
        return ["ActivityChanged", "ActivityRecognitionError"]
    }
    
    @objc
    func requestPermissions(_ resolve: @escaping RCTPromiseResolveBlock,
                          rejecter reject: @escaping RCTPromiseRejectBlock) {
        // iOS doesn't require runtime permissions for motion data
        resolve(true)
    }
    
    @objc
    func startActivityRecognition() {
        guard CMMotionActivityManager.isActivityAvailable() else {
            sendError("Activity recognition is not available on this device")
            return
        }
        
        if isMonitoring {
            return
        }
        
        motionActivityManager.startActivityUpdates(to: activityQueue) { [weak self] activity in
            guard let self = self, let activity = activity else { return }
            
            let activityType = self.getActivityType(from: activity)
            let confidence = self.getConfidence(from: activity)
            
            let params: [String: Any] = [
                "type": activityType,
                "confidence": confidence,
                "timestamp": Date().timeIntervalSince1970 * 1000
            ]
            
            self.sendEvent(withName: "ActivityChanged", body: params)
        }
        
        isMonitoring = true
    }
    
    @objc
    func stopActivityRecognition() {
        motionActivityManager.stopActivityUpdates()
        isMonitoring = false
    }
    
    private func getActivityType(from activity: CMMotionActivity) -> String {
      print("Activity ", activity)
        if activity.automotive {
            return "IN_VEHICLE"
        } else if activity.cycling {
            return "ON_BICYCLE"
        } else if activity.running {
            return "RUNNING"
        } else if activity.walking {
            return "WALKING"
        } else if activity.stationary {
            return "STILL"
        } else {
            return "UNKNOWN"
        }
    }
    
    private func getConfidence(from activity: CMMotionActivity) -> Double {
        switch activity.confidence {
        case .high:
            return 0.9
        case .medium:
            return 0.7
        case .low:
            return 0.3
        @unknown default:
            return 0.0
        }
    }
    
    private func sendError(_ message: String) {
        let params: [String: Any] = [
            "code": "ERROR",
            "message": message
        ]
        sendEvent(withName: "ActivityRecognitionError", body: params)
    }
    
    @objc
  override func invalidate() {
        stopActivityRecognition()
    }
} 
