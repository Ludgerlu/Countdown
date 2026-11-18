
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

const durations = [1, 5, 10, 15, 30];

export default function HomeScreen() {

  const [selectedMinutes, setSelectedMinutes] = useState(5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFF5E9"
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>Countdown.</Text>

          <View style={styles.headerIcon}>
            <Text style={styles.sun}>☀️</Text>
          </View>
        </View>

        {/* INTRODUCTION */}
        <View style={styles.intro}>
          <Text style={styles.heading}>
            Make time for you!
          </Text>

          <Text style={styles.description}>
            A little time just for yourself ✨
          </Text>
        </View>

        {/* TIMER CARD */}
        <View style={styles.timerCard}>

          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>
              YOUR COUNTDOWN
            </Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                READY
              </Text>
            </View>
          </View>

          {/* TIMER DISPLAY */}
          <View style={styles.timerContainer}>
            <Text style={styles.timer}>
              {String(selectedMinutes).padStart(2, '0')}:00
            </Text>

            <Text style={styles.timerDescription}>
              Minutes : Seconds
            </Text>

            <Text style={styles.hourglass}>
              ⏳
            </Text>
          </View>

          {/* DURATION SELECTOR */}
          <Text style={styles.sectionLabel}>
            CHOOSE YOUR TIME
          </Text>

          <View style={styles.durationContainer}>
            {durations.map((duration) => (

              <Pressable
                key={duration}
                onPress={() => setSelectedMinutes(duration)}
                style={[
                  styles.durationButton,
                  selectedMinutes === duration &&
                    styles.durationButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedMinutes === duration &&
                      styles.durationTextActive,
                  ]}
                >
                  {duration} min
                </Text>
              </Pressable>

            ))}
          </View>

          {/* START BUTTON */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {}}
          >
            <Text style={styles.startButtonText}>
              ▶  Start
            </Text>
          </Pressable>

          <Text style={styles.cardFooter}>
            Take a breath. Enjoy the moment.
          </Text>

        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for your time
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF5E9',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 15,
    paddingBottom: 25,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 23,
    fontWeight: '900',
    color: '#302923',
  },

  headerIcon: {
    backgroundColor: '#FFE2C2',
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sun: {
    fontSize: 22,
  },

  intro: {
    marginTop: 45,
    marginBottom: 30,
    alignItems: 'center',
  },

  heading: {
    fontSize: 27,
    fontWeight: '900',
    color: '#302923',
    textAlign: 'center',
  },

  description: {
    fontSize: 14,
    color: '#8E7A6B',
    marginTop: 8,
  },

  timerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 22,

    shadowColor: '#A77C57',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.10,
    shadowRadius: 15,
    elevation: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E7A6B',
    letterSpacing: 1,
  },

  statusBadge: {
    backgroundColor: '#E7F7EA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#3A9B55',
    fontSize: 10,
    fontWeight: '800',
  },

  timerContainer: {
    alignItems: 'center',
    paddingVertical: 35,
  },

  timer: {
    fontSize: 65,
    fontWeight: '900',
    color: '#302923',
    fontVariant: ['tabular-nums'],
  },

  timerDescription: {
    color: '#A18B7A',
    fontSize: 13,
    marginTop: 5,
  },

  hourglass: {
    fontSize: 45,
    marginTop: 15,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8E7A6B',
    marginBottom: 14,
    letterSpacing: 1,
  },

  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 9,
  },

  durationButton: {
    backgroundColor: '#FFF0E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 15,
  },

  durationButtonActive: {
    backgroundColor: '#FF923E',
  },

  durationText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E6D55',
  },

  durationTextActive: {
    color: '#FFFFFF',
  },

  startButton: {
    backgroundColor: '#FF923E',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 28,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
  },

  cardFooter: {
    textAlign: 'center',
    color: '#A18B7A',
    fontSize: 12,
    marginTop: 18,
  },

  footer: {
    alignItems: 'center',
    marginTop: 35,
  },

  footerText: {
    fontSize: 12,
    color: '#A18B7A',
  },

});
