#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@import SafetyTag;

@interface RCT_EXTERN_MODULE(SafetyTagModule, RCTEventEmitter)
RCT_EXTERN_METHOD(startScan: (BOOL)autoConnect)
RCT_EXTERN_METHOD(stopScan)
RCT_EXTERN_METHOD(connectDevice:(NSString *)deviceId)
RCT_EXTERN_METHOD(checkConnection)
RCT_EXTERN_METHOD(disconnectDevice)
RCT_EXTERN_METHOD(getConnectedDevice)
RCT_EXTERN_METHOD(getTrips)
RCT_EXTERN_METHOD(getTripsWithFraudDetection)
RCT_EXTERN_METHOD(supportedEvents)
RCT_EXTERN_METHOD(startObserving)
RCT_EXTERN_METHOD(stopObserving)
RCT_EXTERN_METHOD(enableAccelerometerDataStream)
RCT_EXTERN_METHOD(disableAccelerometerDataStream)
RCT_EXTERN_METHOD(isAccelerometerDataStreamEnabled)
RCT_EXTERN_METHOD(checkAxisAlignmentStatus)
RCT_EXTERN_METHOD(startAxisAlignment: (BOOL)resumeIfAvailable)
RCT_EXTERN_METHOD(stopAxisAlignment)
RCT_EXTERN_METHOD(removeStoredAxisAlignment)
RCT_EXTERN_METHOD(getAlignmentConfiguration)
RCT_EXTERN_METHOD(hasStoredAxisAlignment)
RCT_EXTERN_METHOD(startMonitoringDevice:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(stopMonitoringDevice:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(isDeviceBeingMonitored:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(startMonitoringSignificantLocationChanges)
RCT_EXTERN_METHOD(stopMonitoringSignificantLocationChanges)
RCT_EXTERN_METHOD(enableAutoConnect:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(disableAutoConnect:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(isAutoConnectEnabled:(NSString *)deviceId
                  deviceName:(NSString *)deviceName
                  iBeaconUUID:(NSString *)iBeaconUUID)
RCT_EXTERN_METHOD(verifyBackgroundOperation)
RCT_EXTERN_METHOD(handleBackgroundWakeUp:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
