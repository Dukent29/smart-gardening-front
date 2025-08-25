import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PlantCard({ plant, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        <Text style={styles.title}>{plant.plant_name}</Text>
        <Text style={styles.subtitle}>{plant.plant_type}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#06331a",
  },
  subtitle: {
    fontSize: 14,
    color: "#5b9274",
  },
});