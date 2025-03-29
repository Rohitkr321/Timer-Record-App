import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert } from "react-native";
import TimerProgress from "./TimerProgress";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../theme/ThemeContext";

export default function TimerItem({ timer = {}, onUpdate = () => { }, category }) {
  if (!timer.name) return null;

  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const [remaining, setRemaining] = useState(timer.remaining);
  const [status, setStatus] = useState(timer.status);
  const [halfwayTriggered, setHalfwayTriggered] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const storeCompletedTimer = async () => {
    try {
      const history = JSON.parse(await AsyncStorage.getItem("completedTimers")) || [];
      const newEntry = { name: timer.name, completedAt: new Date().toISOString() };
      history.push(newEntry);
      await AsyncStorage.setItem("completedTimers", JSON.stringify(history));
    } catch (error) {
      console.error("Error storing completed timer:", error);
    }
  };

  const startTimer = () => {
    if (status === "Running") return;
    setStatus("Running");
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setStatus("Completed");
          setModalVisible(true);
          storeCompletedTimer();
          onUpdate(timer.id, 0, "Completed");
          return 0;
        }
        if (!halfwayTriggered && prev === Math.floor(timer.duration / 2)) {
          Alert.alert("Alert", `Dear user only ${timer.duration / 2} Seconds left for complete the "${timer.name}"!`);
          setHalfwayTriggered(true);
        }

        onUpdate(timer.id, prev - 1, "Running");
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setStatus("Paused");
    onUpdate(timer.id, remaining, "Paused");
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setRemaining(timer.duration);
    setStatus("Paused");
    setHalfwayTriggered(false); // Reset halfway alert
    setModalVisible(false);
    onUpdate(timer.id, timer.duration, "Paused");
  };

  return (
    <View style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.categoryText, isDarkMode ? styles.darkText : styles.lightText]}>{category}</Text>

      <View style={styles.header}>
        <Text style={[styles.timerName, isDarkMode ? styles.darkText : styles.lightText]}>{timer.name}</Text>
        <Text style={[styles.remainingTime, remaining <= 10 && status === "Running" ? styles.nearEndTime : null]}>
          {remaining}
        </Text>
      </View>

      <Text style={[
        styles.statusText,
        status === "Running" ? styles.runningStatus :
          status === "Completed" ? styles.completedStatus :
            status === "Paused" ? (isDarkMode ? styles.pausedStatusDark : styles.pausedStatus) : null
      ]}>
        {status}
      </Text>

      <View style={styles.progressContainer}>
        <TimerProgress progress={(remaining / timer.duration) * 100} />
      </View>

      <View style={styles.buttonContainer}>
        {status === "Paused" && (
          <TouchableOpacity style={styles.buttonStart} onPress={startTimer}>
            <Ionicons name="play-circle" size={32} color="#fff" />
          </TouchableOpacity>
        )}
        {status === "Running" && (
          <TouchableOpacity style={styles.buttonPause} onPress={pauseTimer}>
            <Ionicons name="pause-circle" size={32} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buttonReset} onPress={resetTimer}>
          <Ionicons name="refresh-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.timerText}>You completed: {timer.name}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    marginVertical: 5,
    marginHorizontal: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  lightCard: {
    backgroundColor: "#fff",
  },
  statusTextDark: {
    color: "#ddd", // Lighter text for dark mode
  },
  darkCard: {
    backgroundColor: "#222",
  },
  darkText: {
    color: "#FFF",
  },
  pausedStatusDark: {
    color: "#bbb", // Slightly dimmed color for "Paused" in dark mode
  },
  lightText: {
    color: "#333",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  timerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  remainingTime: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  nearEndTime: {
    color: "red",
  },
  runningStatus: {
    color: "red",
  },
  pausedStatus: {
    color: "black",
  },
  completedStatus: {
    color: "green",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressContainer: {
    marginVertical: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  buttonStart: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  buttonPause: {
    backgroundColor: "#ffcc00",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  buttonReset: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 50,
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    width: "80%",
  },
  congratsText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "green"
  },
  timerText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
