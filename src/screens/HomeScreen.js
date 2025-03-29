import React, { useState, useCallback, useEffect } from "react";
import {
  View, Text, TouchableOpacity, FlatList, Alert, ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/globalStyles";
import TimerItem from "../components/TimerItem";
import { useContext } from "react";
import { ThemeContext } from "../theme/ThemeContext";


export default function HomeScreen() {
  const navigation = useNavigation();
  const [timers, setTimers] = useState([]);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Detect system theme
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  useFocusEffect(
    useCallback(() => {
      loadTimers();
    }, [])
  );

  useEffect(() => {
    if (completedTimer) {
      Alert.alert("Timer Completed", `${completedTimer.name} has finished!`);
      setCompletedTimer(null);
    }
  }, [completedTimer]);

  const loadTimers = async () => {
    const savedTimers = await AsyncStorage.getItem("timers");
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  };

  const groupedTimers = timers.reduce((acc, timer) => {
    if (!acc[timer.category]) acc[timer.category] = [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {Object.keys(groupedTimers).length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="timer-outline" size={50} color={isDarkMode ? "#CCC" : "gray"} />
            <Text style={[styles.emptyStateText, isDarkMode ? styles.darkEmptyStateText : styles.lightEmptyStateText]}>
              No timers added yet.
            </Text>
          </View>
        ) : (
          Object.keys(groupedTimers).map((category) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => toggleCategory(category)}
                style={[styles.categoryHeader, isDarkMode ? styles.darkCategoryHeader : styles.lightCategoryHeader]}
              >
                <Text style={[styles.categoryTitle, isDarkMode ? styles.darkCategoryTitle : styles.lightCategoryTitle]}>
                  {category}
                </Text>
                <Ionicons
                  name={expandedCategories[category] ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={isDarkMode ? "#FFF" : "#000"}
                />
              </TouchableOpacity>
              {expandedCategories[category] && (
                <FlatList
                  data={groupedTimers[category]}
                  keyExtractor={(timer) => timer.id}
                  renderItem={({ item }) => (
                    <TimerItem timer={item} onComplete={() => setCompletedTimer(item)} />
                  )}
                  scrollEnabled={false} // Prevents FlatList from conflicting with ScrollView
                />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[
        styles.fixedButtonContainer,
        isDarkMode ? styles.darkFixedButtonContainer : styles.lightFixedButtonContainer
      ]}>
        <TouchableOpacity
          style={[styles.button, styles.addButton, { flexDirection: "row", alignItems: "center" }]}
          onPress={() => navigation.navigate("AddTimer")}
        >
          <Ionicons name="timer" size={24} color={isDarkMode ? "white" : "black"} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
            Add Timer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.historyButton, { flexDirection: "row", alignItems: "center", }]}
          onPress={() => navigation.navigate("History")}
        >
          <Ionicons name="time-outline" size={24} color={isDarkMode ? "white" : "black"} style={{ marginRight: 8 }} />
          <Text style={[styles.buttonText, isDarkMode ? styles.darkButtonText : styles.lightButtonText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
