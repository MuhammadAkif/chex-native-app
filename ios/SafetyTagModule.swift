import Foundation
import SafetyTag
import Combine
import React

@objc(SafetyTagModule)
class SafetyTagModule: RCTEventEmitter {
    private var cancellables = Set<AnyCancellable>()
    private var hasListeners = false
    private var isConnecting = false
    private var connectedDeviceId: UUID?

    override init() {
        super.init()
        print("[SafetyTagModule] Initialized")
    }

    override func startObserving() {
        hasListeners = true
        observeConnectionEvents()
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
            "onGetConnectedDevice"
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

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
