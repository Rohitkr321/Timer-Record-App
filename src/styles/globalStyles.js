import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  // Dark Mode & Light Mode containers
  darkContainer: {
    backgroundColor: "#121212", // Dark background
  },
  lightContainer: {
    backgroundColor: "#ffffff", // Light background
  },

  categoryContainer: {
    marginBottom: 20,
  },

  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Dark Mode & Light Mode category headers
  darkCategoryHeader: {
    backgroundColor: "#333333",
  },
  lightCategoryHeader: {
    backgroundColor: "#f0f0f0",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 10, // Space between buttons
    flexDirection: "row", // Ensure icon & text align properly
    justifyContent: "center",
  },

  addButton: {
    backgroundColor: "#0096FF",
  },
  historyButton: {
    backgroundColor: "#228B22",
  },

  // Button Text
  buttonText: {
    fontWeight: "bold",
    fontSize: 16,
  },

  // Dark Mode & Light Mode button text
  darkButtonText: {
    color: "#ffffff",
  },
  lightButtonText: {
    color: "#ffffff",
  },

  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  // Dark Mode & Light Mode fixed button container
  darkFixedButtonContainer: {
    backgroundColor: "#1e1e1e",
  },
  lightFixedButtonContainer: {
    backgroundColor: "#ffffff",
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 5,
  },

  // Dark Mode & Light Mode category titles
  darkCategoryTitle: {
    color: "#ffffff",
  },
  lightCategoryTitle: {
    color: "#000000",
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 400, // Adjust as needed
  },

  emptyStateText: {
    fontSize: 18,
    marginTop: 10,
  },

  // Dark Mode & Light Mode empty state text
  darkEmptyStateText: {
    color: "#cccccc",
  },
  lightEmptyStateText: {
    color: "gray",
  },
});

export default styles;
