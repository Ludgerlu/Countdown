
import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Hello World 👋
      </Text>

      <Text style={styles.subtitle}>
        Bienvenue dans ma première application !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aab4c5',
    fontSize: 16,
    marginTop: 12,
  },
});
