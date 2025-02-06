import Foundation
import SafetyTag
import Combine
import React
import CoreBluetooth

@objc(SafetyTagModule)
class SafetyTagModule: RCTEventEmitter {
    private var cancellables = Set<AnyCancellable>()
    private var accelerometerPublisher = Set<AnyCancellable>()
    private var accelerometerIsActivePublisher = Set<AnyCancellable>()
    private var hasListeners = false
    private var isConnecting = false
    private var connectedDeviceId: UUID?
    private var lastTripStartTime: Double?
    private var lastTripEventTime: Double?

    override init() {
        super.init()
        print("[SafetyTagModule] Initialized")
    }

    override func startObserving() {
        hasListeners = true
        observeConnectionEvents()
        observeTripEvents()
    }

    override func stopObserving() {
        hasListeners = false
        cancellables.removeAll()
    }

    override func supportedEvents() -> [String]! {
        return [
            "onDeviceDiscovered",
            "onDeviceConnected",
            "onDeviceConnectionFailed",
            "onDeviceDisconnected",
            "onCheckConnection",
            "onGetConnectedDevice",
            "onTripStarted",
            "onTripEnded",
            "onTripsReceived",
            "onAccelerometerData",
            "onAccelerometerError",
            "onAccelerometerStreamStatus",
            "onAxisAlignmentState",
            "onAxisAlignmentData"
        ]
    }

    @objc func startScan() {
        print("[SafetyTagModule] Start scanning for SafetyTag devices...")
        
        // Reset connection state when starting a new scan
        isConnecting = false
        connectedDeviceId = nil
        
        do {
            try STDeviceManager.shared.connection.startScan(autoConnect: false)
            print("[SafetyTagModule] Scan started successfully")
        } catch {
            print("[SafetyTagModule] Failed to start scan: \(error.localizedDescription)")
        }
    }

    @objc func getConnectedDevice() {
        print("[SafetyTagModule] Getting connected SafetyTag device...")
        
        if let device = STDeviceManager.shared.connection.getConnectedDevice() {
            print("[SafetyTagModule] Got successfully Connected device information:", device)
            
            if self.hasListeners {
                self.sendEvent(withName: "onGetConnectedDevice", body: [
                    "id": device.id.uuidString,
                    "name": device.name,
                    "state": String(describing: device.state),
                    "rssi": device.rssi?.stringValue ?? "N/A",
                    "advertisingMode": String(describing: device.advertisingMode),
                    "iBeaconUUID": device.iBeaconUUID?.uuidString ?? "N/A"
                ])
            }
        } else {
            print("[SafetyTagModule] No device currently connected")
            if self.hasListeners {
                self.sendEvent(withName: "onGetConnectedDevice", body: [
                    "error": "No device currently connected"
                ])
            }
        }
    }

    @objc func disconnectDevice() {
        print("[SafetyTagModule] Disconnecting SafetyTag device...")

        do {
            try STDeviceManager.shared.connection.disconnect()
            print("[SafetyTagModule] Disconnected device successfully")
        } catch {
            print("[SafetyTagModule] Failed to disconnect device: \(error.localizedDescription)")
        }
    }

    @objc func checkConnection() {
        print("[SafetyTagModule] Checking device connection...")

        do {
            let isConnected = STDeviceManager.shared.connection.isConnected()
            print("[SafetyTagModule] Device connection status: \(isConnected ? "Connected" : "Not Connected")")
          
          if self.hasListeners == true {
              self.sendEvent(withName: "onCheckConnection", body: [
                  "isConnected": isConnected
              ])
          }
          
        } catch {
            print("[SafetyTagModule] Failed to check device connection: \(error.localizedDescription)")
        }
    }

    private func observeConnectionEvents() {
        // Log when a new device is discovered
        SafetyTagApi.Event.Connection.didDiscover
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device in
                print("[SafetyTagModule] Discovered device: \(device)")
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onDeviceDiscovered", body: [
                        "id": device.id.uuidString,
                        "name": device.name
                    ])
                }
                // Only attempt to connect if we're not already connecting or connected
                if self?.isConnecting == false && self?.connectedDeviceId == nil {
                    self?.connectToTag(device: device)
                }
            }
            .store(in: &cancellables)

        // Log successful connection
        SafetyTagApi.Event.Connection.didConnect
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device in
                print("[SafetyTagModule] Device connected: \(device)")
                self?.isConnecting = false
                self?.connectedDeviceId = device.id
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onDeviceConnected", body: [
                        "id": device.id.uuidString,
                        "name": device.name
                    ])
                }
                // Stop scanning after successful connection
                STDeviceManager.shared.connection.stopScan()
            }
            .store(in: &cancellables)

        // Log connection failure
        SafetyTagApi.Event.Connection.didFailToConnect
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, error in
                print("[SafetyTagModule] Failed to connect to device: \(device), Error: \(error.localizedDescription)")
                self?.isConnecting = false
                self?.connectedDeviceId = nil
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onDeviceConnectionFailed", body: [
                        "id": device.id.uuidString,
                        "name": device.name,
                        "error": error.localizedDescription
                    ])
                }
            }
            .store(in: &cancellables)

        // Log disconnection
        SafetyTagApi.Event.Connection.didDisconnect
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, error in
                print("[SafetyTagModule] Device disconnected: \(device)")
                self?.isConnecting = false
                self?.connectedDeviceId = nil
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onDeviceDisconnected", body: [
                        "id": device.id.uuidString,
                        "name": device.name,
                        "error": error?.localizedDescription
                    ])
                }
            }
            .store(in: &cancellables)
    }

    private func connectToTag(device: STDevice) {
        print("[SafetyTagModule] Attempting to connect to device: \(device)")
        isConnecting = true
        STDeviceManager.shared.connection.connect(device)
    }


    private func observeTripEvents() {
        // Trip Start Event
        SafetyTagApi.Event.TripsDetection.didReceiveTripStartEvent
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, tripEvent, error in
                print("[SafetyTagModule] Trip Start Event Received")
                if let error = error {
                    print("[SafetyTagModule] Trip Start Event Error:", error.localizedDescription)
                    if self?.hasListeners == true {
                        self?.sendEvent(withName: "onTripStarted", body: [
                            "error": error.localizedDescription
                        ])
                    }
                    return
                }
                
                // Log full details for debugging
                print("[SafetyTagModule] Trip Start Event Details:")
                print("Device ID:", device.id.uuidString)
                print("Device Name:", device.name)
                print("Event Time:", tripEvent.eventTime)
                print("Seconds Since Restart:", tripEvent.secondsSinceLastRestart)
                
              let formatter = ISO8601DateFormatter()
              let eventTimeString = formatter.string(from: tripEvent.eventTime)
              
                // Send only essential data to React Native
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onTripStarted", body: [
                        "deviceId": device.id.uuidString,
                        "deviceName": device.name,
                        "tripEvent": eventTimeString,
                        "secondsSinceLastRestart": tripEvent.secondsSinceLastRestart
                    ])
                }
            }
            .store(in: &cancellables)

        // Trip End Event
        SafetyTagApi.Event.TripsDetection.didReceiveTripEndEvent
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, tripEvent, error in
                print("[SafetyTagModule] Trip End Event Received")
                if let error = error {
                    print("[SafetyTagModule] Trip End Event Error:", error.localizedDescription)
                    if self?.hasListeners == true {
                        self?.sendEvent(withName: "onTripEnded", body: [
                            "error": error.localizedDescription
                        ])
                    }
                    return
                }
                
                // Log full details for debugging
                print("[SafetyTagModule] Trip End Event Details:")
                print("Device ID:", device.id.uuidString)
                print("Device Name:", device.name)
                print("Event Time:", tripEvent.eventTime)
                print("Seconds Since Restart:", tripEvent.secondsSinceLastRestart)
              let formatter = ISO8601DateFormatter()
              let eventTimeString = formatter.string(from: tripEvent.eventTime)

                // Send only essential data to React Native
                if self?.hasListeners == true {
                    self?.sendEvent(withName: "onTripEnded", body: [
                        "deviceId": device.id.uuidString,
                        "deviceName": device.name,
                        "tripEvent": eventTimeString,
                        "secondsSinceLastRestart": tripEvent.secondsSinceLastRestart
                    ])
                }
                self?.lastTripStartTime = nil
            }
            .store(in: &cancellables)
    }

    @objc func getTrips() {
        print("[SafetyTagModule] Getting trips...")
        
        do {
            try STDeviceManager.shared.trips.getTrips()
          SafetyTagApi.Event.TripsDetection.didReceiveTrips
            .sink { device, trips, error in
              if let error = error {
                  print("[SafetyTagModule] Trips Data Error:", error.localizedDescription)
                  if self.hasListeners == true {
                    self.sendEvent(withName: "onTripsReceived", body: [
                          "error": error.localizedDescription
                      ])
                  }
                  return
              }
              print("[SafetyTagModule] Trips Data Received", trips)
              print("[SafetyTagModule] Trips Data error", error)
            }
        } catch {
            print("[SafetyTagModule] Failed to get trips: \(error.localizedDescription)")
            if self.hasListeners {
                self.sendEvent(withName: "onTripsReceived", body: [
                    "error": error.localizedDescription
                ])
            }
        }
    }

    @objc func getTripsWithFraudDetection() {
        print("[SafetyTagModule] Getting trips with fraud detection...")
        
        do {
            try STDeviceManager.shared.trips.getTripsDataWithFraudDetection()
          SafetyTagApi.Event.TripsDetection.didReceiveTrips
            .sink { device, trips, error in
              if let error = error {
                  print("[SafetyTagModule] Fraud Trips Data Error:", error.localizedDescription)
                  if self.hasListeners == true {
                    self.sendEvent(withName: "onTripsReceived", body: [
                          "error": error.localizedDescription
                      ])
                  }
                  return
              }
              print("[SafetyTagModule] Fraud Trips Data Received", trips)
              print("[SafetyTagModule] Fraud Trips Data error", error)
            }
          observeTripsData()
        } catch {
            print("[SafetyTagModule] Failed to get trips with fraud detection: \(error.localizedDescription)")
            if self.hasListeners {
                self.sendEvent(withName: "onTripsReceived", body: [
                    "error": error.localizedDescription
                ])
            }
        }
    }

    private func observeTripsData() {
        SafetyTagApi.Event.TripsDetection.didReceiveTrips
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, trips, error in
                if let error = error {
                    print("[SafetyTagModule] Trips Data Error:", error.localizedDescription)
                    if self?.hasListeners == true {
                        self?.sendEvent(withName: "onTripsReceived", body: [
                            "error": error.localizedDescription
                        ])
                    }
                    return
                }
                print("[SafetyTagModule] observeTripsData Received", trips)
                print("[SafetyTagModule] observeTripsData error", error)
                
                if self?.hasListeners == true {
                    // Format trips data
                    let formattedTrips = trips.map { trip -> [String: Any] in
                        return [
                          "startDate": trip.startDate.timeIntervalSince1970 * 1000,
                          "endDate": trip.endDate.timeIntervalSince1970 * 1000,
                            "startSecondsSinceLastRestart": trip.startSecondsSinceLastRestart,
                            "endSecondsSinceLastRestart": trip.endSecondsSinceLastRestart,
                            "connectedDuringTrip": trip.connectedDuringTrip ?? false
                        ]
                    }
                    
                    self?.sendEvent(withName: "onTripsReceived", body: [
                        "trips": formattedTrips,
                        "deviceId": device?.id.uuidString ?? "",
                        "deviceName": device?.name ?? "",
                        "totalTrips": formattedTrips.count
                    ])
                }
            }
            .store(in: &cancellables)
    }
//  
//  @objc func enableAccelerometerDataStream() {
//      print("[SafetyTagModule] Getting trips...")
//      
//      do {
//          try STDeviceManager.shared.accelerometer
//          .accelerometerPublisher()
//          .compactMap({ try? $0.get() })
//          .sink { acceleration in
//            print(acceleration)
//            }
//            .store(in: &accelerometerPublisher)
//      } catch {
//          print("[SafetyTagModule] Failed to get trips: \(error.localizedDescription)")
//          if self.hasListeners {
//              self.sendEvent(withName: "onTripsReceived", body: [
//                  "error": error.localizedDescription
//              ])
//          }
//      }
//  }

  
  @objc func isAccelerometerDataStreamEnabled(_ resolve: @escaping RCTPromiseResolveBlock,
                                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    print("[SafetyTagModule] Checking Is Accelerometer Data Stream Enabled...")
    STDeviceManager.shared.accelerometer
        .isAccelerometerStreamActivePublisher()
        .sink { completion in
            switch completion {
            case .failure(let error):
                reject("ERROR", "Failed to check accelerometer status: \(error.localizedDescription)", error)
            case .finished:
                break
            }
        } receiveValue: { isEnabled in
            print("[SafetyTagModule] Accelerometer stream enabled:", isEnabled)
            resolve(isEnabled)
        }
        .store(in: &accelerometerIsActivePublisher)
  }
  
  @objc func enableAccelerometerDataStream() {
      print("[SafetyTagModule] Enabling Accelerometer Data Stream...")
      STDeviceManager.shared.accelerometer
          .accelerometerPublisher()
          .compactMap { try? $0.get() } // Convert Result to optional value
          .sink(receiveCompletion: { completion in
              switch completion {
              case .failure(let error):
                  print("[SafetyTagModule] Failed to get accelerometer data: \(error.localizedDescription)")
                  if self.hasListeners {
                      self.sendEvent(withName: "onAccelerometerError", body: ["error": error.localizedDescription])
                  }
              case .finished:
                  print("[SafetyTagModule] Accelerometer stream finished.")
              }
          }, receiveValue: { acceleration in
              print("[SafetyTagModule] Accelerometer data:", acceleration)
              if self.hasListeners {
                  self.sendEvent(withName: "onAccelerometerData", body: [
                      "x": acceleration.x,
                      "y": acceleration.y,
                      "z": acceleration.z,
                      "timestamp": Date().timeIntervalSince1970 * 1000 // Convert to milliseconds for JS
                  ])
              }
          })
          .store(in: &accelerometerPublisher)
  }
  
  
  @objc func disableAccelerometerDataStream() {
      print("[SafetyTagModule] Disabling Accelerometer Data Stream...")

      // Cancel all stored subscriptions
    accelerometerPublisher.removeAll()
  }
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc func startAxisAlignment(_ resumeIfAvailable: Bool) {
        print("[SafetyTagModule] Starting axis alignment...")
        do {
            try STDeviceManager.shared.axisAlignment.startAccelerometerAxisAlignment()
            
            // Subscribe to alignment state updates
            try SafetyTagApi.Event.AxisAlignment.alignmentState
                .sink { [weak self] device, state in
                      print("[SafetyTagModule] alignmentState of state:", state)
                }
                .store(in: &cancellables)
            
            // Subscribe to alignment data updates
            try SafetyTagApi.Event.AxisAlignment.didReceiveAlignmentData
                .sink { [weak self] device, result in
                    print("[SafetyTagModule] Alignment data received:", result)
                }
                .store(in: &cancellables)
            
        } catch {
            print("[SafetyTagModule] Failed to start axis alignment:", error)
        }
    }
    
    @objc func stopAxisAlignment() {
        print("[SafetyTagModule] Stopping axis alignment...")
        do {
            try STDeviceManager.shared.axisAlignment.stopAccelerometerAxisAlignment()
            // Clear any stored subscriptions
            cancellables.removeAll()
        } catch {
            print("[SafetyTagModule] Failed to stop axis alignment:", error)
        }
    }
}
