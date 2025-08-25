import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/DashboardScreen";
import AddPlantScreen from "../screens/AddPlantScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AddPlant" component={AddPlantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}