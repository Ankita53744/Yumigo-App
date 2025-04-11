import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchCart = () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const db = getDatabase();
      const cartRef = ref(db, `carts/${user.uid}`);

      onValue(cartRef, (snapshot) => {
        const cartData = snapshot.val();
        setCartItems(cartData ? cartData.items : []);
      });
    };

    fetchCart();
  }, []);

  const getTotal = () => {
    return cartItems.length > 0
      ? cartItems.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          const quantity = parseInt(item.quantity, 10) || 1;
          return total + price * quantity;
        }, 0)
      : 0;
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Cart is empty!", "Add items before checkout.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Address Required", "Please enter a delivery address.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "Please log in to place an order.");
      return;
    }

    const db = getDatabase();
    const orderData = {
      userId: user.uid,
      items: cartItems,
      total: getTotal(),
      address,
      timestamp: new Date().toISOString(),
    };

    try {
      await push(ref(db, "orders"), orderData);
      await set(ref(db, `carts/${user.uid}`), { items: [] });
      setCartItems([]);
      setAddress("");
      Alert.alert("Order Placed!", "Your order has been successfully placed.");
    } catch (error) {
      console.log("Firebase Order Error:", error);
      Alert.alert("Error", `Failed to place order: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Checkout</Text>
      <Text style={styles.sectionTitle}>Shipping Address</Text>
      <TextInput
        style={styles.addressInput}
        placeholder="Enter delivery address"
        value={address}
        onChangeText={setAddress}
      />
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal ({cartItems.length})</Text>
          <Text style={styles.priceValue}>₹{getTotal()}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Shipping</Text>
          <Text style={styles.priceValue}>Free</Text>
        </View>
        <View style={styles.priceRowTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{getTotal()}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handleCheckout}>
        <Text style={styles.placeOrderText}>Place order</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAEBD7", paddingHorizontal: 16 },
  headerTitle: { fontSize: 22, fontWeight: "bold", paddingVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  addressInput: { backgroundColor: "#FFF", padding: 10, borderRadius: 5, marginBottom: 10 },
  cartItem: { flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemQuantity: { fontSize: 14, color: "gray" },
  itemPrice: { fontSize: 16, fontWeight: "bold" },
  priceContainer: { padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
  priceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  priceRowTotal: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "red" },
  placeOrderButton: { backgroundColor: "#8B0000", padding: 16, borderRadius: 8, alignItems: "center" },
  placeOrderText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
});

export default CartScreen;
