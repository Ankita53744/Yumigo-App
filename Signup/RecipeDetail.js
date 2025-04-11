import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import dishes from "./Dishes"; // Assuming this contains dish details

const RecipeDetail = ({ route }) => {
  const { dishId } = route.params;
  const dish = dishes.find((d) => d.id === dishId);
  const [quantity, setQuantity] = useState(1);

  const addToCart = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "Please log in to add items to your cart.");
      return;
    }

    const db = getDatabase();
    const cartRef = ref(db, `carts/${user.uid}`);

    try {
      const snapshot = await get(cartRef);
      let cartItems = snapshot.exists() ? snapshot.val().items || [] : [];

      // Check if item exists in the cart
      const existingItemIndex = cartItems.findIndex((item) => item.id === dish.id);
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ ...dish, quantity });
      }

      await set(cartRef, { items: cartItems, userId: user.uid, username: user.displayName, email: user.email });
      Alert.alert("Success", "Item added to cart!");
    } catch (error) {
      console.error("Firebase Add to Cart Error:", error);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={dish.image} style={styles.image} />

      <TouchableOpacity style={styles.addItemButton}>
        <Text style={styles.addItemText}>Ingredients:</Text>
      </TouchableOpacity>

      <View style={styles.selectionBox}>
        <Text style={styles.selectionTitle}>Items included:</Text>
        {dish.ingredients.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>• {item}</Text>
        ))}

        <View style={styles.mealCounter}>
          <Text style={styles.mealLabel}>No of meals:</Text>
          <TouchableOpacity
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            style={styles.counterButton}
          >
            <Text style={styles.counterText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.counterButton}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={addToCart} style={styles.cartButton}>
        <Text style={styles.cartButtonText}>Add to cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#FFD5D5" }, // Light red background
  image: { width: "100%", height: 200, borderRadius: 8, marginBottom: 12 },
  addItemButton: {
    backgroundColor: "#D9534F",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  addItemText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  selectionBox: {
    backgroundColor: "#FFEBE6", // Warm color for selection box
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF9999",
  },
  selectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  bulletPoint: { fontSize: 16, marginBottom: 6 },
  mealCounter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  mealLabel: { fontSize: 16, fontWeight: "bold", marginRight: 10 },
  counterButton: {
    backgroundColor: "#D9534F",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  counterText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  quantity: { fontSize: 18, fontWeight: "bold" },
  cartButton: {
    backgroundColor: "#D9534F",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  cartButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default RecipeDetail;
