import React, { useState, useEffect } from "react";
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, TextInput, Alert, Animated 
} from "react-native";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

const Profile = ({ navigation }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [editing, setEditing] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Logged Out", "You have been successfully logged out.");
        navigation.replace("Login");
      })
      .catch((error) => Alert.alert("Logout Failed", error.message));
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(user, { displayName });
      Alert.alert("Success", "Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        await updateProfile(user, { photoURL: result.assets[0].uri });
        Alert.alert("Success", "Profile picture updated!");
      } catch (error) {
        Alert.alert("Error", "Failed to update profile picture.");
      }
    }
  };

  return (
    <LinearGradient colors={["#8B1E1E", "#F3F4F6"]} style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {editing ? (
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            placeholder="Enter new name"
            placeholderTextColor="#555"
          />
        ) : (
          <Animated.Text style={[styles.name, { opacity: fadeAnim }]}>
            {user.displayName || "Your Name"}
          </Animated.Text>
        )}

        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.joined}>
          Joined: {new Date(user.metadata.creationTime).toLocaleDateString()}
        </Text>

        {editing ? (
          <TouchableOpacity onPress={handleUpdateProfile} style={styles.button}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("ViewOrders")} style={styles.button}>
          <Text style={styles.buttonText}>View Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 4,
    borderColor: "#8B1E1E",
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#777",
    marginBottom: 8,
  },
  joined: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#8B1E1E",
    width: "80%",
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#8B1E1E",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    elevation: 3,
  },
});

export default Profile;
