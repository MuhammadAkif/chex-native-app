import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { SafetyTag } = NativeModules;

const SafetyTagPackage = () => {
  const [apiInfo, setApiInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkApiInfo();
  }, []);

  const checkApiInfo = async () => {
    try {
      const info = await SafetyTag.getApiInfo();
      console.log('SafetyTag API Info:', info);
      setApiInfo(info);
    } catch (err) {
      console.error('Error getting API info:', err);
      setError(err.message);
      console.warn(err.message)
      throw err;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>SafetyTag API Info</Text>

      {error && (
        <Text style={styles.error}>Error: {error}</Text>
      )}

      {apiInfo && (
        <View>
          <Text style={styles.label}>Version: {apiInfo.version}</Text>
          <Text style={styles.label}>Initialized: {apiInfo.isInitialized ? 'Yes' : 'No'}</Text>

          <Text style={styles.subtitle}>Available Methods:</Text>
          {Object.entries(apiInfo.availableMethods || {}).map(([name, details]) => (
            <Text key={name} style={styles.method}>
              {name}: {details}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  method: {
    fontSize: 14,
    marginBottom: 5,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SafetyTagPackage;
