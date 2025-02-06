#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(SafetyTagModule, RCTEventEmitter)
RCT_EXTERN_METHOD(startScan)
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
RCT_EXTERN_METHOD(isAccelerometerDataStreamEnabled: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(startAxisAlignment: (BOOL)resumeIfAvailable)
RCT_EXTERN_METHOD(stopAxisAlignment)
@end
