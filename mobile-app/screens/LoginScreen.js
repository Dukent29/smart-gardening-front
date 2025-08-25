import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Simulate login logic
      if (email === "test@example.com" && password === "password") {
        navigation.navigate("Dashboard");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      setError("Erreur lors de la connexion");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Text style={styles.link}>
        Pas de compte ?{" "}
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("Register")}
        >
          Inscris-toi
        </Text>
      </Text>
      <Text style={styles.link}>
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Mot de passe oublié ?
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
    backgroundColor: "#0a5d2f",
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