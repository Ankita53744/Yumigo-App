import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./Signup/FirebaseConfig"; // Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignUp from "./Signup/Signup";
import Login from "./Signup/Login";
import Home from "./Signup/Home";
import RecipeDetails from "./Signup/RecipeDetail";
import CartScreen from "./Signup/CartSceen";
import { AuthContextProvider } from "./Signup/Auth";
import Profile from "./Signup/Profile";
import ViewOrders from "./Signup/ViewOrders";

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  
  useEffect(() => {
    const checkUserSession = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        AsyncStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);
      } else {
        AsyncStorage.removeItem("user");
        setIsLoggedIn(false);
      }
    });

    checkUserSession();
    return () => unsubscribe();
  }, []);

  if (isLoggedIn === null) return null; // Avoid flickering during loading

  return (
    <NavigationContainer><Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Signup" component={SignUp} />
    <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="ViewOrders" component={ViewOrders} />
  </Stack.Navigator></NavigationContainer>
    
  );
};

export default App;
