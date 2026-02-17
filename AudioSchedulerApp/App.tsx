import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useAudioScheduler, ScheduleEntry } from './src/utils/AudioScheduler';
import scheduleData from './src/assets/schedule.json';

const schedule: ScheduleEntry[] = scheduleData;

const App = (): React.JSX.Element => {
  useAudioScheduler(schedule);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.header}>
        <Text style={styles.title}>🔔 Audio Scheduler</Text>
        <Text style={styles.subtitle}>
          {schedule.length} event{schedule.length !== 1 ? 's' : ''} scheduled
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {schedule.length === 0 ? (
          <Text style={styles.empty}>No events scheduled yet.</Text>
        ) : (
          schedule.map((item: ScheduleEntry) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.datetime}>
                {item.date} at {item.time}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#16213e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e94560',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  datetime: {
    fontSize: 14,
    color: '#a0a0b0',
  },
  empty: {
    textAlign: 'center',
    color: '#a0a0b0',
    marginTop: 60,
    fontSize: 16,
  },
});

export default App;