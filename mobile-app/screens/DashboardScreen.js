import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import PlantCard from "../components/PlantCard";

export default function DashboardScreen({ navigation }) {
  const plants = [
    { id: 1, plant_name: "Rose", plant_type: "Flower", status: "OK" },
    { id: 2, plant_name: "Tulip", plant_type: "Flower", status: "LOW" },
    { id: 3, plant_name: "Cactus", plant_type: "Succulent", status: "CRITICAL" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vue d’ensemble du jardin</Text>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            onPress={() => navigation.navigate("AddPlant", { plant: item })}
          />
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPlant")}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
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
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#074221",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});