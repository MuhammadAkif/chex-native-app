import Foundation
import FileProvider
import SafetyTag
import Combine
import React
import CoreBluetooth
import os.log

// MARK: - Logger Delegate
class MyLogManager: STLoggerDelegate {
  func didUpdateLogs(_ logger: STLogger, with log: STLogger.STLog, level: String) {
    let logMessage = "[SafetyTagModule] \(level) - \(log.value)"
    print(logMessage)
  }
}

// MARK: - SafetyTagModule Main Class
@objc(SafetyTagModule)
class SafetyTagModule: RCTEventEmitter, CLLocationManagerDelegate {
  // MARK: - Properties
  private var cancellables = Set<AnyCancellable>()
  private var accelerometerPublisher = Set<AnyCancellable>()
  private var accelerometerIsActivePublisher = Set<AnyCancellable>()
  private var hasListeners = false
  private var isConnecting = false
  private var connectedDeviceId: UUID?
  private var lastTripStartTime: Double?
  private var lastTripEventTime: Double?
  private var shouldAutoConnect = true
  private let manager = STDeviceManager.shared
  private let locationManager = CLLocationManager()

  // MARK: - Required Methods
  @objc
  static override func requiresMainQueueSetup() -> Bool {
    return true
  }

  // MARK: - Initialization
  override init() {
    super.init()
    STLogger.shared.isEnabled = true
    STLogger.shared.logSensitiveInformation = true
    //STLogger.shared.delegate = MyLogManager()
    print("[SafetyTagModule] Initialized")
    setupLocationManager()
  }

  private func setupLocationManager() {
    locationManager.delegate = self
    locationManager.allowsBackgroundLocationUpdates = true
    locationManager.pausesLocationUpdatesAutomatically = false
    locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation

    // Request authorization
    locationManager.requestWhenInUseAuthorization()
    locationManager.requestAlwaysAuthorization()

    // Start updating location immediately
    // locationManager.startUpdatingLocation()
    // locationManager.startMonitoringSignificantLocationChanges()
  }

  // MARK: - RCTEventEmitter Required Methods
  override func startObserving() {
    hasListeners = true
    observeConnectionEvents()
    observeTripEvents()
    crashEvents()
    observeiBeaconEvents()
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
      "onRegionEntered",
      "onRegionExited",
      "onRegionStateChanged",
      "onRegionEnter",
      "onRegionExit",
      "onDeviceConnectionStateChange",
      "onBackgroundOperationStatus",
      "onAxisAlignmentStatusCheck",
      "onStoredAxisAlignmentCheck",
      "onDeviceMonitoringStatus",
      "onAutoConnectStatus",
      "onCrashThreshold",
      "onCrashEvent",
    ]
  }

  // MARK: - Device Connection Methods
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

  @objc func stopScan() {
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

  private func connectToTag(device: STDevice) {
    print("[SafetyTagModule] Attempting to connect to device: \(device)")
    isConnecting = true

    // Send connecting state event
    if self.hasListeners {
      self.sendEvent(withName: "onDeviceConnectionStateChange", body: [
        "state": "connecting",
        "deviceId": device.id.uuidString,
        "deviceName": device.name
      ])
    }

    STDeviceManager.shared.connection.connect(device)
  }

  // MARK: - Trip Management Methods
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

  // MARK: - Accelerometer Methods
  @objc func requestLocationAlwaysPermission() {
    locationManager.requestAlwaysAuthorization()
  }

  @objc func enableIOSAccelerometerDataStream() {
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

  @objc func isAccelerometerDataStreamEnabled() {
    print("[SafetyTagModule] Checking Is Accelerometer Data Stream Enabled...")
    STDeviceManager.shared.accelerometer
      .isAccelerometerStreamActivePublisher()
      .sink { completion in
        switch completion {
        case .failure(let error):
          if self.hasListeners {
            self.sendEvent(withName: "onAccelerometerError", body: [
              "error": error.localizedDescription
            ])
          }
        case .finished:
          break
        }
      } receiveValue: { isEnabled in
        print("[SafetyTagModule] Accelerometer stream enabled:", isEnabled)
        if self.hasListeners {
          self.sendEvent(withName: "onAccelerometerStreamStatus", body: [
            "isEnabled": isEnabled
          ])
        }
      }
      .store(in: &accelerometerIsActivePublisher)
  }

  // MARK: - Axis Alignment Methods
  @objc func startIOSAxisAlignment(_ resumeIfAvailable: Bool) {
    print("[SafetyTagModule] Starting axis alignment of iOS...")

    // 1. First ensure accelerometer stream is active
    if accelerometerPublisher.isEmpty {
      print("[SafetyTagModule] Initializing accelerometer stream...")
      enableIOSAccelerometerDataStream()
    }

    // 2. Clear any existing subscriptions to avoid duplicates
    cancellables.removeAll()

    do {
      // 3. Start the axis alignment process
      print("[SafetyTagModule] Initiating accelerometer axis alignment...")
      try STDeviceManager.shared.axisAlignment.startAccelerometerAxisAlignment(resumeIfAvailable: true)

      // 4. Monitor alignment state
      SafetyTagApi.Event.AxisAlignment.alignmentState
        .receive(on: DispatchQueue.main)
        .sink { [weak self] device, state in
          guard let self = self else { return }
          print("[SafetyTagModule] Alignment State Update:", state.state)
          print("[SafetyTagModule] Alignment State Update:")
          print("[SafetyTagModule] Alignment State Update  - Phase: \(String(describing: state.state.phase))")
          print("[SafetyTagModule] Alignment State Update  - Z-Axis State: \(String(describing: state.state.zAligmentState))")
          print("[SafetyTagModule] Alignment State Update  - X-Axis State: \(String(describing: state.state.xAligmentState))")
          print("[SafetyTagModule] Alignment State Update  - Valid Vehicle State: \(state.state.validVehicleState)")

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
          print("[SafetyTagModule] Vehicle State Update:", vehicleState)
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
          print("[SafetyTagModule] Alignment Data Update:", result)

          switch result {
          case .success(let alignment):
            print("[SafetyTagModule] Alignment Data Update - Status: \(alignment)")
            print("[SafetyTagModule] Alignment Data Update - Status: \(alignment.status)")
            print("[SafetyTagModule] Alignment Data Update  - Theta: \(alignment.theta.value)")
            print("[SafetyTagModule] Alignment Data Update  - Phi: \(alignment.phi.value)")

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
      self.disableAccelerometerDataStream()
      try STDeviceManager.shared.axisAlignment.stopAccelerometerAxisAlignment()
      // Clear any stored subscriptions
      cancellables.removeAll()
    } catch {
      print("[SafetyTagModule] Failed to stop axis alignment:", error)
    }
  }

  @objc func checkAxisAlignmentStatus() {
    print("[SafetyTagModule] Checking axis alignment status...")

    do {
      let hasStarted = try STDeviceManager.shared.axisAlignment.axisAlignmentStarted
      if self.hasListeners {
        self.sendEvent(withName: "onAxisAlignmentStatusCheck", body: [
          "hasStarted": hasStarted
        ])
      }
    } catch {
      if self.hasListeners {
        self.sendEvent(withName: "onAxisAlignmentStatusCheck", body: [
          "error": error.localizedDescription
        ])
      }
    }
  }

  @objc func hasStoredAxisAlignment() {
    print("[SafetyTagModule] Checking for stored axis alignment...")

    let hasStored = STDeviceManager.shared.axisAlignment.hasStoredAxisAlignment
    if self.hasListeners {
      self.sendEvent(withName: "onStoredAxisAlignmentCheck", body: [
        "hasStored": hasStored
      ])
    }
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

  // MARK: - Crash Event Methods
  @objc func crashEvents() {
    SafetyTagApi.Event.Crash.onReceiveCrashThresholdEvent
      .receive(on: DispatchQueue.main)
      .sink { [weak self] _, thresholdEvent in
        guard let self = self else { return }
        print("[SafetyTagModule] Received crash threshold event \(String(describing: thresholdEvent))")
        if self.hasListeners {
          self.sendEvent(withName: "onCrashThreshold", body: [
            "thresholdEvent": String(describing: thresholdEvent)
          ])
        }
      }
      .store(in: &cancellables)

    SafetyTagApi.Event.Crash.onReceiveCrashEvent
      .receive(on: DispatchQueue.main)
      .sink { [weak self] _, crashData, status in
        guard let self = self else { return }
        print("[SafetyTagModule] Received crash event")
        print("[SafetyTagModule] Received crash data: \(crashData)")
        print("[SafetyTagModule] Received crash status: \(status)")

        if self.hasListeners {
          self.sendEvent(withName: "onCrashEvent", body: [
            "crashData": String(describing: crashData),
            "status": String(describing: status)
          ])
        }

        STDeviceManager.shared.configCentralManager()
      }
      .store(in: &cancellables)
  }

  // MARK: - iBeacon Monitoring Methods
  @objc func startMonitoringDevice(_ deviceId: String, deviceName: String, iBeaconUUID: String) {
    guard let myDevice = manager.connection.getConnectedDevice(),
          let deviceIBeaconUUID = myDevice.iBeaconUUID?.uuidString else {
      print("[SafetyTagModule] No connected device found or missing iBeacon UUID")
      return
    }

    print("[SafetyTagModule] Starting monitoring for device: \(myDevice)")

    // Enable auto-reconnect for iOS 17+
    if #available(iOS 17.0, *) {
      manager.connection.autoReconnect(enabled: true,
                                       id: myDevice.id.uuidString,
                                       iBeaconUUID: deviceIBeaconUUID,
                                       name: myDevice.name)
    }

    do {
      try STiBeaconManager.shared.startMonitoring(
        iBeaconUUID: deviceIBeaconUUID,
        name: myDevice.name,
        id: myDevice.id.uuidString
      )
      print("[SafetyTagModule] Successfully started monitoring device")
    } catch {
      print("[SafetyTagModule] Failed to start monitoring: \(error.localizedDescription)")
    }
  }

  @objc func stopMonitoringDevice(_ deviceId: String, deviceName: String, iBeaconUUID: String) {
    print("[SafetyTagModule] Stopping monitoring for device: \(deviceId)")
    STiBeaconManager.shared.stopMonitoring(
      iBeaconUUID: iBeaconUUID,
      name: deviceName,
      id: deviceId
    )
  }

  @objc func isDeviceBeingMonitored(_ deviceId: String,
                                    deviceName: String,
                                    iBeaconUUID: String) {
    let isMonitored = STiBeaconManager.shared.isBeingMonitored(
      iBeaconUUID: iBeaconUUID,
      name: deviceName
    )
    if self.hasListeners {
      self.sendEvent(withName: "onDeviceMonitoringStatus", body: [
        "deviceId": deviceId,
        "deviceName": deviceName,
        "iBeaconUUID": iBeaconUUID,
        "isMonitored": isMonitored
      ])
    }
  }

  @objc func startMonitoringSignificantLocationChanges() {
    print("[SafetyTagModule] Starting significant location changes monitoring")
    STiBeaconManager.shared.startMonitoringSignificantLocationChanges()
  }

  @objc func stopMonitoringSignificantLocationChanges() {
    print("[SafetyTagModule] Stopping significant location changes monitoring")
    STiBeaconManager.shared.stopMonitoringSignificantLocationChanges()
  }

  // MARK: - Auto Connect Methods
  @objc func enableAutoConnect(_ deviceId: String, deviceName: String, iBeaconUUID: String) {
    print("[SafetyTagModule] Enabling auto-connect for device: \(deviceId)")
    STDeviceManager.shared.connection.enableAutoConnect(
      id: deviceId,
      iBeaconUUID: iBeaconUUID,
      name: deviceName
    )
  }

  @objc func disableAutoConnect(_ deviceId: String, deviceName: String, iBeaconUUID: String) {
    print("[SafetyTagModule] Disabling auto-connect for device: \(deviceId)")
    STDeviceManager.shared.connection.disableAutoConnect(
      id: deviceId,
      iBeaconUUID: iBeaconUUID,
      name: deviceName
    )
  }

  @objc func isAutoConnectEnabled(_ deviceId: String,
                                  deviceName: String,
                                  iBeaconUUID: String) {
    let isEnabled = STDeviceManager.shared.connection.isAutoConnectEnabled(
      iBeaconUUID: iBeaconUUID,
      name: deviceName
    )
    if self.hasListeners {
      self.sendEvent(withName: "onAutoConnectStatus", body: [
        "deviceId": deviceId,
        "deviceName": deviceName,
        "iBeaconUUID": iBeaconUUID,
        "isEnabled": isEnabled
      ])
    }
  }

  // MARK: - Background Operation Methods
  private func logBackgroundState() {
    let state = UIApplication.shared.applicationState
    let timestamp = Date().timeIntervalSince1970
    let stateString = state == .active ? "active" : (state == .background ? "background" : "inactive")

    print("[SafetyTagModule] App State: \(stateString) at \(timestamp)")

    if self.hasListeners {
      self.sendEvent(withName: "onBackgroundOperationStatus", body: [
        "state": stateString,
        "timestamp": timestamp,
        "isConnected": STDeviceManager.shared.connection.isConnected()
      ])
    }
  }

  @objc func verifyBackgroundOperation() {
    print("[SafetyTagModule] Starting background operation verification...")

    // Log initial state
    logBackgroundState()

    // Start monitoring significant location changes to help keep app alive
    startMonitoringSignificantLocationChanges()

    // Set up a timer to periodically log state (every 30 seconds)
    Timer.scheduledTimer(withTimeInterval: 30.0, repeats: true) { [weak self] _ in
      self?.logBackgroundState()
    }
  }

  @objc func handleBackgroundWakeUp(_ resolve: @escaping RCTPromiseResolveBlock,
                                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    let state = UIApplication.shared.applicationState
    let timestamp = Date().timeIntervalSince1970
    let stateString = state == .active ? "active" : (state == .background ? "background" : "inactive")

    print("[SafetyTagModule] handleBackgroundWakeUp called in state: \(stateString)")

    // Create response data
    let responseData: [String: Any] = [
      "state": stateString,
      "timestamp": timestamp,
      "isConnected": STDeviceManager.shared.connection.isConnected()
    ]

    resolve(responseData)
  }

  // MARK: - Event Observation Methods
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
          // Send connected state event
          self?.sendEvent(withName: "onDeviceConnectionStateChange", body: [
            "state": "connected",
            "deviceId": device.id.uuidString,
            "deviceName": device.name
          ])
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
          // Send connection failed state event
          self?.sendEvent(withName: "onDeviceConnectionStateChange", body: [
            "state": "failed",
            "deviceId": device.id.uuidString,
            "deviceName": device.name,
            "error": error.localizedDescription
          ])
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

  @objc func readRSSI() {
    // Attempt to read the RSSI from the device manager
    try? STDeviceManager.shared.connection.readRSSI()

    // Subscribe to the RSSI event publisher
    SafetyTagApi.Event.Connection.didReceiveRSSI
      .receive(on: DispatchQueue.main)
      .sink { [weak self] device, RSSI, error in
        // Handle the RSSI data here
        if let error = error {
          print("[SafetyTagModule] Error receiving RSSI: \(error.localizedDescription)")
        } else {
          print("[SafetyTagModule] RSSI received from device \(RSSI)")
        }
      }
      .store(in: &cancellables) // Store the subscription in cancellables
  }

  private func observeTripEvents() {
    // Trip Start Event
    SafetyTagApi.Event.TripsDetection.didReceiveTripStartEvent
      .receive(on: DispatchQueue.main)
      .sink { [weak self] device, tripEvent, error in
        if let error = error {
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

  private func observeiBeaconEvents() {
    // Monitor region entry
    SafetyTagApi.Event.IBeacon.didEnterRegion
      .receive(on: DispatchQueue.main)
      .sink { [weak self] region, device in
        if self?.hasListeners == true {
          self?.sendEvent(withName: "onRegionEntered", body: [
            "deviceId": device.id.uuidString,
            "deviceName": device.name,
            "state": String(describing: device.state)
          ])
        }
      }
      .store(in: &cancellables)

    // Monitor region exit
    SafetyTagApi.Event.IBeacon.didExitRegion
      .receive(on: DispatchQueue.main)
      .sink { [weak self] region, device in
        if self?.hasListeners == true {
          self?.sendEvent(withName: "onRegionExited", body: [
            "deviceId": device.id.uuidString,
            "deviceName": device.name,
            "state": String(describing: device.state)
          ])
        }
      }
      .store(in: &cancellables)

    // Monitor state determination
    SafetyTagApi.Event.IBeacon.didDetermined
      .receive(on: DispatchQueue.main)
      .sink { [weak self] state, device in
        if self?.hasListeners == true {
          self?.sendEvent(withName: "onRegionStateChanged", body: [
            "deviceId": device.id.uuidString,
            "deviceName": device.name,
            "state": state.humanReadable
          ])
        }
      }
      .store(in: &cancellables)
  }
}

// MARK: - CLLocationManagerDelegate Extension
extension SafetyTagModule {
  func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
    if let beaconRegion = region as? CLBeaconRegion {
      print("[SafetyTagModule] Entered region: \(beaconRegion.identifier)")

      // Get the connected device if available
      let connectedDevice = STDeviceManager.shared.connection.getConnectedDevice()

      // Create event data
      let eventData: [String: Any] = [
        "deviceId": beaconRegion.identifier,
        "timestamp": Date().timeIntervalSince1970,
        "isBackground": UIApplication.shared.applicationState != .active,
        "connectedDeviceName": connectedDevice?.name ?? "N/A",
        "connectedDeviceId": connectedDevice?.id.uuidString ?? "N/A"
      ]

      // Send event to React Native
      sendEvent(withName: "onRegionEnter", body: eventData)

      // If in background, try to trigger React Native method
      if UIApplication.shared.applicationState == .background {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in
          self?.handleBackgroundWakeUp({ result in
            print("[SafetyTagModule] Background wake up handled with result:", result)
          }, rejecter: { code, message, error in
            print("[SafetyTagModule] Background wake up failed:", message ?? "Unknown error")
          })
        }
      }
    }
  }

  func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
    if let beaconRegion = region as? CLBeaconRegion {
      print("[SafetyTagModule] Exited region: \(beaconRegion.identifier)")

      // Get the connected device if available
      let connectedDevice = STDeviceManager.shared.connection.getConnectedDevice()

      // Create event data
      let eventData: [String: Any] = [
        "deviceId": beaconRegion.identifier,
        "timestamp": Date().timeIntervalSince1970,
        "isBackground": UIApplication.shared.applicationState != .active,
        "connectedDeviceName": connectedDevice?.name ?? "N/A",
        "connectedDeviceId": connectedDevice?.id.uuidString ?? "N/A"
      ]

      // Send event to React Native
      sendEvent(withName: "onRegionExit", body: eventData)

      // If in background, try to trigger React Native method
      if UIApplication.shared.applicationState == .background {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in
          self?.handleBackgroundWakeUp({ result in
            print("[SafetyTagModule] Background wake up handled with result:", result)
          }, rejecter: { code, message, error in
            print("[SafetyTagModule] Background wake up failed:", message ?? "Unknown error")
          })
        }
      }
    }
  }

  func locationManager(_ manager: CLLocationManager, didDetermineState state: CLRegionState, for region: CLRegion) {
    if let beaconRegion = region as? CLBeaconRegion {
      print("[SafetyTagModule] Region state changed: \(state.rawValue) for device: \(beaconRegion.identifier)")
    }
  }

  func locationManager(_ manager: CLLocationManager, didChangeAuthorizationStatus status: CLAuthorizationStatus) {
    print("[SafetyTagModule] Location permission change to \(status)")

    switch status {
    case .notDetermined:
      // If the status is not determined, we can request permission.
      // Requesting WhenInUse permission by default
      locationManager.requestWhenInUseAuthorization()

    case .restricted, .denied:
      // If location access is restricted or denied, you can't request permissions again.
      // You might want to show a message to the user about how to change it in settings.
      print("[SafetyTagModule] Location access is restricted or denied.")

    case .authorizedWhenInUse:
      // If authorized for WhenInUse, you might want to request Always permission if needed
      locationManager.requestAlwaysAuthorization()

    case .authorizedAlways:
      // If already authorized for Always, no further action is required.
      print("[SafetyTagModule] Location access is already granted for always.")

    @unknown default:
      // Handle any future cases or unrecognized status
      print("[SafetyTagModule] Unrecognized authorization status: \(status)")
    }
  }

  // Delegate method called when location is updated
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    // Take the latest location update
    if let latestLocation = locations.last {
      let latitude = latestLocation.coordinate.latitude
      let longitude = latestLocation.coordinate.longitude
      let accuracy = latestLocation.horizontalAccuracy
      let speed = latestLocation.speed
      let heading = latestLocation.course
      let timestamp = Date().timeIntervalSince1970

      print("[SafetyTagModule] Live Location Update - Latitude: \(latestLocation) \(latitude) \(longitude)")
    }
  }

  // Delegate method called if there's an error receiving location updates
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    print("[SafetyTagModule] Error obtaining location: \(error.localizedDescription)")

    if self.hasListeners {
      self.sendEvent(withName: "onLocationError", body: [
        "error": error.localizedDescription
      ])
    }
  }
}
