import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      // Simulate registration logic
      navigation.navigate("Dashboard");
    } catch (err) {
      setError("Erreur lors de l’inscription");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={form.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmez le mot de passe"
        value={form.confirmPassword}
        onChangeText={(value) => handleChange("confirmPassword", value)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Créer mon compte</Text>
      </TouchableOpacity>

      <Text style={styles.link}>
        Déjà un compte ?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Login")}
        >
          Se connecter
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#074221",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#09552b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#000",
  },
  linkText: {
    color: "#0a5d2f",
    fontWeight: "bold",
  },
});