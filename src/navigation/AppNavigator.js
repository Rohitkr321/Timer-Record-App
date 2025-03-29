import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import AddTimerScreen from "../screens/AddTimerScreen";
import { ThemeContext } from "../theme/ThemeContext";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleStyle: { fontSize: 20 },
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 15 }}>
            <Ionicons
              name={theme === "dark" ? "sunny" : "moon"}
              size={24}
              color={theme === "dark" ? "white" : "black"}
            />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
        },
        headerTintColor: theme === "dark" ? "white" : "black",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="home" size={24} color={theme === "dark" ? "white" : "black"} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: "bold", color: theme === "dark" ? "white" : "black" }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="AddTimer"
        component={AddTimerScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="timer" size={24} color={theme === "dark" ? "white" : "black"} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: "bold", color: theme === "dark" ? "white" : "black" }}>
                Add Timer
              </Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="time-outline" size={24} color={theme === "dark" ? "white" : "black"} style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 20, fontWeight: "bold", color: theme === "dark" ? "white" : "black" }}>
                History
              </Text>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
