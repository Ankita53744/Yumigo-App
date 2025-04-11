import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { auth, db } from './FirebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      return Alert.alert("Please fill all fields");
    }
    if (!isValidEmail(email)) {
      return Alert.alert("Invalid email format");
    }
    if (password.length < 6) {
      return Alert.alert("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Passwords do not match");
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        uid: user.uid,
      });
      
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Signup successful!");
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./logo.png")} style={styles.logo} />
      <Text style={styles.title}>Yumigo Grocery</Text>
      <Text style={styles.subtitle}>SHOP ONLINE</Text>

      <TextInput style={styles.input} placeholder="Enter name" placeholderTextColor="#ffffff" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Enter email" placeholderTextColor="#ffffff" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Enter Password" placeholderTextColor="#ffffff" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#ffffff" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>Login</Text>
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
  logo: { width: 150, height: 150, resizeMode: "contain", marginBottom: 10 },
  title: { fontSize: 26, fontWeight: "bold", color: "#3E721D" },
  subtitle: { fontSize: 16, fontWeight: "bold", color: "#3E721D", marginBottom: 20 },
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
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  backButton: {
    width: 80,
    height: 40,
    backgroundColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});

export default SignUp;
