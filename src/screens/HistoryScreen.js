import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../theme/ThemeContext"; // Import ThemeContext

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const { theme } = useContext(ThemeContext); // Use ThemeContext
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem("completedTimers");
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  // Function to format date in IST
  const formatDateToIST = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(date);
  };

  const exportHistory = async () => {
    if (history.length === 0) {
      Alert.alert("No Data", "There is no history to export.");
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + "TimerAppHistory.json";
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(history, null, 2));
      
      Alert.alert("Success", "History exported successfully!");
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error exporting history:", error);
      Alert.alert("Error", "Failed to export history.");
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {history.length === 0 ? (
        <Text style={[styles.emptyText, isDarkMode ? styles.darkText : styles.lightText]}>
          No timers completed yet
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.historyItem, isDarkMode ? styles.darkHistoryItem : styles.lightHistoryItem]}>
              <Text style={[styles.timerName, isDarkMode ? styles.darkText : styles.lightText]}>
                {item.name}
              </Text>
              <Text style={[styles.completedTime, isDarkMode ? styles.darkText : styles.lightText]}>
                {formatDateToIST(item.completedAt)}
              </Text>
            </View>
          )}
        />
      )}

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton} onPress={exportHistory}>
        <Ionicons name="download-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  darkContainer: { backgroundColor: "#121212" },
  lightContainer: { backgroundColor: "#ffffff" },

  emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
  darkText: { color: "white" },
  lightText: { color: "black" },

  historyItem: { padding: 10, borderBottomWidth: 1 },
  darkHistoryItem: { borderColor: "#444" },
  lightHistoryItem: { borderColor: "#ddd" },

  timerName: { fontSize: 16, fontWeight: "bold" },
  completedTime: { fontSize: 14 },

  // Export Button Styles
  exportButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { height: 3, width: 3 },
  },
});
