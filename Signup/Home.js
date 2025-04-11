import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import dishes from "./Dishes";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Home = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDish = ({ item }) => (
    <TouchableOpacity
      style={styles.dishCard}
      onPress={() => navigation.navigate("RecipeDetails", { dishId: item.id })}
    >
      {/* Dish Card Gradient */}
      <LinearGradient colors={["#ffafbd", "#ffc3a0"]} style={styles.dishBackground}>
        <Image source={item.image} style={styles.dishImage} />
        <Text style={styles.dishName}>{item.name}</Text>
        <Text style={styles.dishPrice}>₹{item.price}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#ffdfba", "#ffffff"]} style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="black" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Dish Section */}
      <Text style={styles.sectionTitle}>Dishes you might LOVE!!</Text>
      <FlatList
        data={filteredDishes}
        renderItem={renderDish}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.dishList}
        ListEmptyComponent={<Text style={styles.noResults}>No dishes found</Text>}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          <Ionicons name="cart-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },

  /* Search Bar */
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8a5c2",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },

  /* Dishes */
  sectionTitle: { fontSize: 25, fontWeight: "bold", marginHorizontal: 16, marginVertical: 10 },
  dishList: { paddingHorizontal: 10 },
  dishCard: { flex: 1, margin: 6, borderRadius: 10, alignItems: "center", overflow: "hidden" },
  dishBackground: {
    width: "100%",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 3, // Adds shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  dishImage: { width: 140, height: 100, borderRadius: 10 },
  dishName: { fontSize: 14, fontWeight: "500", marginTop: 5, color: "#4b4b4b" },
  dishPrice: { fontSize: 14, fontWeight: "bold", color: "green" },

  /* Bottom Navigation */
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ff6b6b",
    padding: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default Home;
