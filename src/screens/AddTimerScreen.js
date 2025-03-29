import React, { useState, useContext } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ThemeContext } from "../theme/ThemeContext"; // Import ThemeContext

export default function AddTimerScreen({ navigation }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Workout");
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const isDarkMode = theme === "dark";

  const saveTimer = async () => {
    const durationNumber = parseInt(duration, 10);

    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name.");
      return;
    }

    if (isNaN(durationNumber) || durationNumber <= 10) {
      Alert.alert("Error", "Duration must be more than 10 seconds.");
      return;
    }

    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: durationNumber,
      category,
      remaining: durationNumber,
      status: "Paused",
      startTime: null,
    };

    const savedTimers = await AsyncStorage.getItem("timers");
    const timers = savedTimers ? JSON.parse(savedTimers) : [];
    timers.push(newTimer);
    await AsyncStorage.setItem("timers", JSON.stringify(timers));

    navigation.goBack();
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <TextInput
        placeholder="Please Enter Name"
        placeholderTextColor={isDarkMode ? "#bbb" : "#555"}
        value={name}
        onChangeText={setName}
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
      />
      <TextInput
        placeholder="Duration (in seconds)"
        placeholderTextColor={isDarkMode ? "#bbb" : "#555"}
        value={duration}
        onChangeText={(text) => setDuration(text)}
        keyboardType="numeric"
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
      />
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={[styles.picker, isDarkMode ? styles.darkPicker : styles.lightPicker]}
      >
        <Picker.Item label="Workout" value="Workout" />
        <Picker.Item label="Study" value="Study" />
        <Picker.Item label="Break" value="Break" />
      </Picker>
      <Button title="Save Timer" onPress={saveTimer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  darkContainer: { backgroundColor: "#121212" },
  lightContainer: { backgroundColor: "#ffffff" },

  input: { borderBottomWidth: 1, marginBottom: 15, padding: 10 },
  darkInput: { borderColor: "#bbb", color: "#fff" },
  lightInput: { borderColor: "#333", color: "#000" },

  picker: { marginBottom: 15 },
  darkPicker: { color: "#bbb", backgroundColor: "#222" },
  lightPicker: { color: "#000", backgroundColor: "#fff" },
});
