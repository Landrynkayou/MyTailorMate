import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Animated, Easing, Alert, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const TailorLandingScreen = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-300));
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const searchInputRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [tailorName, setTailorName] = useState(''); // To store the tailor's name

  useEffect(() => {
    // Fetch userId and tailorName from AsyncStorage
    const fetchUserDetails = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedTailorName = await AsyncStorage.getItem('tailorName'); // Assuming tailorName is also stored

        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          Alert.alert('Error', 'User ID is missing. Please log in again.');
          navigation.navigate('Login');
        }

        if (storedTailorName) {
          setTailorName(storedTailorName); // Set the tailor's name
        } else {
          Alert.alert('Error', 'Tailor name is missing. Please log in again.');
        }
      } catch (error) {
        console.error('Failed to retrieve user details from AsyncStorage', error);
        Alert.alert('Error', 'Failed to retrieve user data');
      }
    };

    fetchUserDetails();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to disconnect?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    if (!searchVisible) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  };

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(menuAnim, {
      toValue: menuVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  };

  const handleOverlayPress = () => {
    if (menuVisible) {
      handleMenuToggle();
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row mb-5 items-center py-4 px-5`}>
        <TouchableOpacity style={tw`p-2`} onPress={handleMenuToggle}>
          <MaterialIcons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={tw`flex-1 items-center`}>
          <Text style={tw`text-black text-xl font-bold`}>TailorMate</Text>
        </View>
        {searchVisible ? (
          <TextInput
            ref={searchInputRef}
            style={tw`bg-white rounded-lg px-3 py-2 text-base text-gray-800 ml-2 w-3/5`}
            placeholder="Search clients"
            value={searchText}
            onChangeText={setSearchText}
            onBlur={() => setSearchVisible(false)}
          />
        ) : (
          <TouchableOpacity style={tw`p-2`} onPress={handleSearchToggle}>
            <MaterialIcons name="search" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>

      {/* Display the tailor's name */}
      <View style={tw`flex-row justify-center items-center`}>
        <Text style={tw`text-lg text-gray-700`}>Welcome, {tailorName}</Text>
      </View>

      {!showAddClientForm && (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id}
        />
      )}

      {!showAddClientForm && (
        <View style={tw`flex-1 justify-end items-center pb-5`}>
          <View style={tw`flex-row justify-between w-4/5 mb-5`}>
            <TouchableOpacity
              style={tw`bg-purple-600 p-4 rounded-full w-15 h-15 items-center justify-center`}
              onPress={() => navigation.navigate('Catalog')}
            >
              <MaterialIcons name="library-books" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-purple-600 p-4 rounded-full w-15 h-15 items-center justify-center`}
              onPress={() => navigation.navigate('OrderScreen')}
            >
              <MaterialIcons name="list-alt" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={tw`absolute bottom-7 w-15 h-15 rounded-full bg-violet-600 items-center justify-center shadow-lg`}
            onPress={() => navigation.navigate('AddClientScreen')}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        style={[
          tw`absolute top-10 bottom-10 left-0 w-75 bg-gray-200 py-5 px-3 shadow-lg`,
          { transform: [{ translateX: menuAnim }] },
        ]}
      >
        {menuVisible && (
          <TouchableOpacity style={tw`absolute top-1 right-2 p-2`} onPress={handleMenuToggle}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        )}
        {menuVisible && (
          <TouchableOpacity
            style={tw`absolute top-2 left-0 right-0 bottom-0`}
            onPress={handleOverlayPress}
          />
        )}
        <TouchableOpacity
          style={tw`flex-row items-center mt-10 py-2 px-5`}
          onPress={() => navigation.navigate('TailorProfile')}
        >
          <MaterialIcons name="person" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-5`}
          onPress={() => navigation.navigate('NotificationScreen')}
        >
          <MaterialIcons name="notifications" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-5`}
          onPress={handleDisconnect}
        >
          <MaterialIcons name="exit-to-app" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Disconnect</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-5`}
          onPress={() => navigation.navigate('ClientDetails')}
        >
          <MaterialIcons name="people" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-5`}
          onPress={() => navigation.navigate('OrderScreen')}
        >
          <MaterialIcons name="assignment" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center py-2 px-5`}
          onPress={() => {
            if (userId) {
              navigation.navigate('TailorAppointmentScreen', { userId });
            } else {
              Alert.alert('Error', 'User ID is not available.');
            }
          }}
        >
          <MaterialIcons name="event" size={24} color="purple" />
          <Text style={tw`ml-2 text-lg `}>Appointments</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TailorLandingScreen;
