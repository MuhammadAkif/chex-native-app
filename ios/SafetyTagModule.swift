import Foundation
import FileProvider
import SafetyTag
import Combine
import React
import CoreBluetooth
import os.log

@objc(SafetyTagModule)
class SafetyTagModule: RCTEventEmitter, CLLocationManagerDelegate {
    private var cancellables = Set<AnyCancellable>()
    private var accelerometerPublisher = Set<AnyCancellable>()
    private var accelerometerIsActivePublisher = Set<AnyCancellable>()
    private var hasListeners = false
    private var isConnecting = false
    private var connectedDeviceId: UUID?
    private var lastTripStartTime: Double?
    private var lastTripEventTime: Double?
  private var shouldAutoConnect = true
  //private let locationManager = CLLocationManager()

  override init() {
    super.init()
    STLogger.shared.isEnabled = true
    //STLogger.shared.delegate = MyLogManager()
    print("[SafetyTagModule] Initialized")
  }

  override func startObserving() {
    hasListeners = true
    observeConnectionEvents()
    observeTripEvents()
    crashEvents()
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
      "onAxisAlignmentData",
      "onVehicleState",
      "onAxisAlignmentError",
      "onAxisAlignmentFinished",
      "onAxisAlignmentMissing",
      "vehicleState",
      "alignmentState",
      "alignmentError",
      "alignmentComplete",
    ]
  }

//  @objc func requestUserPermissions() {
//    locationManager.delegate = self
//    locationManager.requestWhenInUseAuthorization()
//    locationManager.requestAlwaysAuthorization()
//    let heading = locationManager.headingFilter
//    let authorizationStatus = locationManager.authorizationStatus
//    let location = locationManager.location
//    print("[SafetyTagModule] Heading -> \(heading)")
//    print("[SafetyTagModule] Authorization status -> \(authorizationStatus)")
//    print("[SafetyTagModule] location status -> \(location)")
//  }

  @objc func startScan(_ autoConnect: Bool) {
    print("[SafetyTagModule] Start scanning for SafetyTag devices...")

    // Reset connection state when starting a new scan
    isConnecting = false
    connectedDeviceId = nil

    do {
      try STDeviceManager.shared.connection.startScan(autoConnect: true)
      self.shouldAutoConnect = autoConnect
      //print("[SafetyTagModule] Scan started successfully")
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

  @objc func stopScan(){
    var isScanning = STDeviceManager.shared.connection.isScanning()
    if isScanning {
      STDeviceManager.shared.connection.stopScan()
    }
  }

  @objc func connectDevice(_ deviceId: String) {
    print("[SafetyTagModule] Connecting to device: \(deviceId)")
    guard let uuid = UUID(uuidString: deviceId) else {
      print("[SafetyTagModule] Invalid device ID format")
      return
    }

    // Use the new connect method with UUID and name
    STDeviceManager.shared.connection.connect(with: uuid, name: "SafetyTag")
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
        if self?.isConnecting == false && self?.connectedDeviceId == nil && self?.shouldAutoConnect == true {
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

    // Log state update
    SafetyTagApi.Event.Connection.didUpdateState
      .receive(on: DispatchQueue.main)
      .sink { state in
        print("[SafetyTagModule] Did state update: \(state)")
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
        //print("[SafetyTagModule] Trip Start Event Received")
        if let error = error {
          //                    print("[SafetyTagModule] Trip Start Event Error:", error.localizedDescription)
          if self?.hasListeners == true {
            self?.sendEvent(withName: "onTripStarted", body: [
              "error": error.localizedDescription
            ])
          }
          return
        }

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
        //                print("[SafetyTagModule] Trip End Event Received")
        if let error = error {
          //                    print("[SafetyTagModule] Trip End Event Error:", error.localizedDescription)
          if self?.hasListeners == true {
            self?.sendEvent(withName: "onTripEnded", body: [
              "error": error.localizedDescription
            ])
          }
          return
        }

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
    //        print("[SafetyTagModule] Getting trips...")

    do {
      try STDeviceManager.shared.trips.getTrips()
      SafetyTagApi.Event.TripsDetection.didReceiveTrips
        .sink { device, trips, error in
          if let error = error {
            //                  print("[SafetyTagModule] Trips Data Error:", error.localizedDescription)
            if self.hasListeners == true {
              self.sendEvent(withName: "onTripsReceived", body: [
                "error": error.localizedDescription
              ])
            }
            return
          }
          //              print("[SafetyTagModule] Trips Data Received", trips)
          //              print("[SafetyTagModule] Trips Data error", error)
        }
    } catch {
      //            print("[SafetyTagModule] Failed to get trips: \(error.localizedDescription)")
      if self.hasListeners {
        self.sendEvent(withName: "onTripsReceived", body: [
          "error": error.localizedDescription
        ])
      }
    }
  }

  @objc func getTripsWithFraudDetection() {
    //        print("[SafetyTagModule] Getting trips with fraud detection...")

    do {
      try STDeviceManager.shared.trips.getTripsDataWithFraudDetection()
      SafetyTagApi.Event.TripsDetection.didReceiveTrips
        .sink { device, trips, error in
          if let error = error {
            //                  print("[SafetyTagModule] Fraud Trips Data Error:", error.localizedDescription)
            if self.hasListeners == true {
              self.sendEvent(withName: "onTripsReceived", body: [
                "error": error.localizedDescription
              ])
            }
            return
          }
          //              print("[SafetyTagModule] Fraud Trips Data Received", trips)
          //              print("[SafetyTagModule] Fraud Trips Data error", error)
        }
      observeTripsData()
    } catch {
      //            print("[SafetyTagModule] Failed to get trips with fraud detection: \(error.localizedDescription)")
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
          //                    print("[SafetyTagModule] Trips Data Error:", error.localizedDescription)
          if self?.hasListeners == true {
            self?.sendEvent(withName: "onTripsReceived", body: [
              "error": error.localizedDescription
            ])
          }
          return
        }
        //                print("[SafetyTagModule] observeTripsData Received", trips)
        //                print("[SafetyTagModule] observeTripsData error", error)
        //
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

      // Clear any existing subscriptions before creating a new one
      accelerometerPublisher.removeAll()

      STDeviceManager.shared.accelerometer
          .accelerometerPublisher()
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
          }, receiveValue: { result in
              if self.hasListeners {
                  if let acceleration = try? result.get() {
                      let formattedData: [String: Any] = [
                          "x": acceleration.x.value,
                          "y": acceleration.y.value,
                          "z": acceleration.z.value,
                          "secondsSinceLastRestart": acceleration.secondsSinceLastRestart
                      ]
                      self.sendEvent(withName: "onAccelerometerData", body: formattedData)
                  }
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

    // 1. First ensure accelerometer stream is active
    if accelerometerPublisher.isEmpty {
        print("[SafetyTagModule] Initializing accelerometer stream...")
        enableAccelerometerDataStream()
    }

    // 2. Clear any existing subscriptions to avoid duplicates
    cancellables.removeAll()

    do {
        // 3. Start the axis alignment process
        print("[SafetyTagModule] Initiating accelerometer axis alignment...")
        try STDeviceManager.shared.axisAlignment.startAccelerometerAxisAlignment(resumeIfAvailable: resumeIfAvailable)

        // 4. Monitor alignment state
        SafetyTagApi.Event.AxisAlignment.alignmentState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, state in
                guard let self = self else { return }
                print("[SafetyTagModule] Alignment State Update:")
                print("  - Phase: \(String(describing: state.state.phase))")
                print("  - Z-Axis State: \(String(describing: state.state.zAligmentState))")
                print("  - X-Axis State: \(String(describing: state.state.xAligmentState))")
                print("  - Valid Vehicle State: \(state.state.validVehicleState)")

                if self.hasListeners {
                    let stateData: [String: Any] = [
                        "phase": String(describing: state.state.phase),
                        "zAxisState": String(describing: state.state.zAligmentState),
                        "xAxisState": String(describing: state.state.xAligmentState),
                        "validVehicleState": state.state.validVehicleState,
                        "currentBootstrapBufferSize": state.state.currentBootstrapBufferSize,
                        "overallIterationCount": state.state.overallIterationCount
                    ]
                    self.sendEvent(withName: "onAxisAlignmentState", body: stateData)
                }
            }
            .store(in: &cancellables)

        // 5. Monitor vehicle state
        SafetyTagApi.Event.AxisAlignment.vehicleState
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, vehicleState in
                guard let self = self else { return }
                print("[SafetyTagModule] Vehicle State Update:")
                print("  - Valid State: \(vehicleState.validVehicleState)")
                print("  - Has Valid Intervals: \(!vehicleState.validVehicleStateIntervals.isEmpty)")

                if self.hasListeners {
                    let stateData: [String: Any] = [
                        "validVehicleState": vehicleState.validVehicleState,
                        "hasValidIntervals": !vehicleState.validVehicleStateIntervals.isEmpty
                    ]
                    self.sendEvent(withName: "onVehicleState", body: stateData)
                }
            }
            .store(in: &cancellables)

        // 6. Monitor alignment data
        SafetyTagApi.Event.AxisAlignment.didReceiveAlignmentData
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, result in
                guard let self = self else { return }
                print("[SafetyTagModule] Alignment Data Update:")

                switch result {
                case .success(let alignment):
                    print("  - Status: \(alignment.status)")
                    print("  - Theta: \(alignment.theta.value)")
                    print("  - Phi: \(alignment.phi.value)")

                    if self.hasListeners {
                        let alignmentData: [String: Any] = [
                            "status": String(describing: alignment.status),
                            "theta": alignment.theta.value,
                            "phi": alignment.phi.value
                        ]
                        self.sendEvent(withName: "onAxisAlignmentData", body: alignmentData)
                    }

                case .failure(let error):
                    print("  - Error: \(error.localizedDescription)")
                    if self.hasListeners {
                        self.sendEvent(withName: "onAxisAlignmentError", body: [
                            "error": error.localizedDescription
                        ])
                    }
                }
            }
            .store(in: &cancellables)

        // 7. Monitor completion
        SafetyTagApi.Event.AxisAlignment.onAxisAlignmentFinished
            .receive(on: DispatchQueue.main)
            .sink { [weak self] device, error in
                guard let self = self else { return }
                print("[SafetyTagModule] Alignment Process Finished:")
                print("  - Success: \(error == nil)")
                if let error = error {
                    print("  - Error: \(error.localizedDescription)")
                }

                if self.hasListeners {
                    self.sendEvent(withName: "onAxisAlignmentFinished", body: [
                        "success": error == nil,
                        "error": error?.localizedDescription as Any
                    ])
                }
            }
            .store(in: &cancellables)

    } catch {
        print("[SafetyTagModule] Failed to start axis alignment:")
        print("  - Error: \(error.localizedDescription)")
        if hasListeners {
            sendEvent(withName: "onAxisAlignmentError", body: [
                "error": error.localizedDescription
            ])
        }
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

    @objc func checkAxisAlignmentStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                                        rejecter reject: @escaping RCTPromiseRejectBlock) {
      print("[SafetyTagModule] Checking axis alignment status...")

      do {
        let hasStored = try STDeviceManager.shared.axisAlignment.axisAlignmentStarted
        resolve(hasStored)
      } catch {
        reject("ERROR", "Failed to check axis alignment status: \(error.localizedDescription)", error)
      }
    }

    @objc func hasStoredAxisAlignment(_ resolve: RCTPromiseResolveBlock,
                                      rejecter reject: RCTPromiseRejectBlock) {
      print("[SafetyTagModule] Checking for stored axis alignment...")

      let hasStored = STDeviceManager.shared.axisAlignment.hasStoredAxisAlignment
      resolve(hasStored)
    }

  @objc func removeStoredAxisAlignment() {
    print("[SafetyTagModule] Removing stored axis alignment...")
    STDeviceManager.shared.axisAlignment.removeStoredAxisAlignment()
  }

  @objc func getAlignmentConfiguration() {
    STDeviceManager.shared.axisAlignment.getAlignmentConfiguration()

    SafetyTagApi.Event.AxisAlignment.didReceiveAlignmentData
      .sink { device, result in
        print("[SafetyTagModule] Got Allignment Configuration... \(result)")
      }
  }
  @objc func crashEvents() {
    SafetyTagApi.Event.Crash.onReceiveCrashThresholdEvent
    .receive(on: DispatchQueue.main)
    .sink { [weak self] _, thresholdEvent in
    // handle the crash threshold event here.
      print("[SafetyTagModule] Recevied crash threshold event \(thresholdEvent)")
    }
    SafetyTagApi.Event.Crash.onReceiveCrashEvent
    .receive(on: DispatchQueue.main)
    .sink { [weak self] _, crashData, status in
      print("[SafetyTagModule] Recevied crash event ")
      print("[SafetyTagModule] Recevied crash data: \(crashData)")
      print("[SafetyTagModule] Recevied crash staus: \(status)")

      STDeviceManager.shared.configCentralManager()
    // Some time after receiving a crash threshold event you will automatically receive the crash data here
    // The crashdataStatus will indicate if the transmission of the data was complete or incomplete
    // The data will be automatically deleted on the Safety Tag when the transmission was complete
    // The data will be requested by the SDK automatically on the next connection or after the next crash threshold event if it was incomplete
    // If an error occured during transmission of crash data, the transmission will be retried on the next connection
    }
  }
}

class MyLogManager: STLoggerDelegate {
    func didUpdateLogs(_ logger: STLogger, with log: STLogger.STLog, level: String) {
        let logValue = log.value
        let logMessage = "[SafetyTagModule] \(level) - \(logValue)"

        // Handle the log (for example, print it)
        print(logMessage)
    }
}

