import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Store user session
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Login Successful", "Welcome back!");
      navigation.replace("Home"); // ✅ Redirect to Home
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") errorMessage = "User not found. Please check your email.";
      else if (error.code === "auth/wrong-password") errorMessage = "Incorrect password. Please try again.";

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>YUMIGO</Text>
      <Image source={require("./delivery.png")} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        placeholderTextColor="#ffffff"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.createAccount}>Create an account</Text>
      <Text style={styles.subtitle}>Enter your email to sign up for this app</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E63946",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  
  image: {
    width: 200,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#ffffff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
  },
});
