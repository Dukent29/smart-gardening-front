import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddPlantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une plante</Text>
      {/* Add your form or camera functionality here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#074221",
    marginBottom: 16,
  },
});