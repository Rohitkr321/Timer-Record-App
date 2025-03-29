import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import TimerItem from "./TimerItem";
import { Ionicons } from "@expo/vector-icons";

export default function TimerCategory({ category, timers, onUpdate }) {
  const handleStartAll = () => {
    timers.forEach((timer) => {
      if (timer.status !== "Running") {
        onUpdate(timer.id, timer.remaining, "Running");
      }
    });
  };

  const handlePauseAll = () => {
    timers.forEach((timer) => {
      if (timer.status === "Running") {
        onUpdate(timer.id, timer.remaining, "Paused");
      }
    });
  };

  const handleResetAll = () => {
    timers.forEach((timer) => {
      onUpdate(timer.id, timer.duration, "Paused");
    });
  };

  return (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      
      {/* Category Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonStart} onPress={handleStartAll}>
          <Ionicons name="play-circle" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPause} onPress={handlePauseAll}>
          <Ionicons name="pause-circle" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonReset} onPress={handleResetAll}>
          <Ionicons name="refresh-circle" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List of Timers */}
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TimerItem timer={item} onUpdate={onUpdate} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonStart: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  buttonPause: {
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  buttonReset: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
});
