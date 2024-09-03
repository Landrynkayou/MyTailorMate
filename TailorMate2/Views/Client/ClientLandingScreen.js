import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, Easing, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';

const ClientLandingScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-300)); // Start off-screen

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0, // Slide in/out
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const handleOverlayPress = () => {
    if (menuVisible) {
      handleMenuToggle(); // Close the menu when the overlay is pressed
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row items-center  py-4 px-5`}>
        <TouchableOpacity style={tw`p-2`} onPress={handleMenuToggle}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-black text-xl font-bold`}>Client Dashboard</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <LinearGradient
            colors={['#4a90e2', '#3498db']}
            style={styles.gradientRectangle}
          >
            <Text style={styles.welcomeMessage}>Welcome to TailorMate!</Text>
          </LinearGradient>
        </View>
        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <MaterialIcons name="chat" size={50} color="#fff" />
            <Text style={styles.text}>Chat with Tailor</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('AppointmentScreen')}
          >
            <MaterialIcons name="event" size={50} color="#fff" />
            <Text style={styles.text}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('NotificationScreen')}
          >
            <MaterialIcons name="notifications" size={50} color="#fff" />
            <Text style={styles.text}>View Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.item} 
            onPress={() => navigation.navigate('ClientProfileScreen')}
          >
            <MaterialIcons name="person" size={50} color="#fff" />
            <Text style={styles.text}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Animated.View
        style={[styles.menuModal, { transform: [{ translateX: menuAnim }] }]}
      >
        {menuVisible && (
          <TouchableOpacity style={styles.closeButton} onPress={handleMenuToggle}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {menuVisible && (
          <TouchableOpacity style={styles.overlay} onPress={handleOverlayPress} />
        )}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ClientProfileScreen')}>
          <MaterialIcons name="person" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('NotificationScreen')}>
          <MaterialIcons name="notifications" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ChatScreen')}>
          <MaterialIcons name="chat" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AppointmentScreen')}>
          <MaterialIcons name="event" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Appointments</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  item: {
    backgroundColor: '#4A90E2',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    margin: 10,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 120, // Increased distance
  },
  gradientRectangle: {
    width: '90%',
    height: 200, // Increased height
    borderRadius: 15, // Slightly rounded corners
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  welcomeMessage: {
    color: '#fff',
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '75%',
    backgroundColor: '#1E2A38',
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default ClientLandingScreen;
