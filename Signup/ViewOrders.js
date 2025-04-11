import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "firebase/database";

const ViewOrders = () => {
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log("Fetching orders for user:", user.uid);

      const ordersRef = ref(db, "orders");
      const snapshot = await get(query(ordersRef, orderByChild("userId"), equalTo(user.uid)));

      if (snapshot.exists()) {
        const data = snapshot.val();
        const userOrders = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        console.log("Fetched Orders:", userOrders);
        setOrders(userOrders);
      } else {
        console.log("No orders found for this user.");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.total}>Total: ₹{item.total}</Text>
      <Text style={styles.timestamp}>Ordered on: {new Date(item.timestamp).toLocaleString()}</Text>

      <Text style={styles.itemsTitle}>Items:</Text>
      {item.items ? (
        Object.values(item.items).map((dish, index) => (
          <Text key={index} style={styles.itemText}>
            {dish.name} - ₹{dish.price}
          </Text>
        ))
      ) : (
        <Text style={styles.itemText}>No items found.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#E74C3C" />
      ) : orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#800000", // Light Red Background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFDCD1",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    backgroundColor: "#FDEBD0", // Warm Beige Box Color
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    elevation: 4,
  },
  total: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D35400",
  },
  timestamp: {
    fontSize: 14,
    color: "#7D3C98",
    marginBottom: 8,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    color: "#5D6D7E",
  },
  itemText: {
    fontSize: 14,
    color: "#626567",
    paddingLeft: 10,
  },
  noOrders: {
    textAlign: "center",
    fontSize: 18,
    color: "#A93226",
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default ViewOrders;
