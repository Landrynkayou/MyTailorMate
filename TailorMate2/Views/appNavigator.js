import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

// Screens
import SignupScreen from "./SignupScreen";
import RolePickerScreen from "./RolePickerScreen";
import LoginScreen from "./LoginScreen";
import ForgotPasswordScreen from "./ForgotPassword";
import TailorLandingScreen from "./Tailor/TailorLanding";
import ClientDetailsScreen from "./Tailor/ClientDetailsScreen";
import OrderListScreen from "./Tailor/OrderListScreen";
import ProfileScreen from "./Tailor/TailorProfile";
import CatalogScreen from "./Tailor/CatalogScreen";

const Stack = createStackNavigator();


// Authentication Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#3498db",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen
      name="RolePicker"
      component={RolePickerScreen}
      options={{ title: "Select Your Role" }}
    />
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: "Create Account" }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: "Login" }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={{ title: "Forgot Password" }}
    />
     <Stack.Screen
      name="Catalog"
      component={CatalogScreen}
      options={{ title: "Catalog" }}
    />
         <Stack.Screen
      name="OrderScreen"
      component={OrderListScreen}
      options={{ title: "Orders" }}
    />
  </Stack.Navigator>
);

/* Tailor Drawer Navigator
const TailorDrawer = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        backgroundColor: '#f5f5f5',
        width: 240,
      },
    }}
  >
    <Drawer.Screen name="Home" component={TailorLandingScreen} />
    <Drawer.Screen name="ClientDetails" component={ClientDetailsScreen} />
    <Drawer.Screen name="OrderList" component={OrderListScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Catalog" component={CatalogScreen} />
  </Drawer.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="TailorApp" component={TailorDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
*/

export default AppNavigator;
