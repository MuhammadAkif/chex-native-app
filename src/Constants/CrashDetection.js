export const CrashDataStatus = {
  COMPLETE_DATA: 'COMPLETE_DATA',
  PARTIAL_DATA: 'PARTIAL_DATA',
  NO_DATA: 'NO_DATA',
};

export const CrashEventType = {
  CRASH: 'CRASH',
  THRESHOLD: 'THRESHOLD',
};

export const DEFAULT_CONFIG = {
  averagingWindowSize: 5,
  thresholdXy: 500,
  thresholdXyz: 1300,
  surpassingThresholds: 2,
};

export const CrashSeverity = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};
