import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, SafeAreaView, TextInput, Animated, Easing, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const TailorLandingScreen = ({ navigation }) => {
  const [clients, setClients] = useState([
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  ]);
  const [searchText, setSearchText] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnim] = useState(new Animated.Value(-300)); 
  const [showAddClientForm, setShowAddClientForm] = useState(false); 
  const searchInputRef = useRef(null);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDisconnect = () => {
    Alert.alert(
      "Disconnect",
      "Are you sure you want to disconnect?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Login'), 
        }
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

      {!showAddClientForm && (
        <FlatList
          data={filteredClients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={tw`flex-row items-center bg-white rounded-lg mx-5 my-2 p-3 shadow-lg`}
            >
              <View style={tw`mr-4`}>
                <Image source={{ uri: item.avatar }} style={tw`w-12 h-12 rounded-full`} />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>{item.name}</Text>
                <Text style={tw`text-sm text-gray-500`}>Client</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#333" />
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={tw`text-center mt-5 text-lg text-gray-600`}>No clients found</Text>
          )}
        />
      )}

      {!showAddClientForm && (
        <View style={tw`flex-1 justify-end items-center pb-5`}>
          <View style={tw`flex-row justify-between w-4/5 mb-5`}>
            <TouchableOpacity style={tw`bg-blue-600 p-4 rounded-full w-15 h-15 items-center justify-center`} onPress={() =>navigation.navigate('Catalog')}>
              <MaterialIcons name="library-books" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`bg-blue-600 p-4 rounded-full w-15 h-15 items-center justify-center`} onPress={() => navigation.navigate('OrderScreen')}>
              <MaterialIcons name="list-alt" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={tw`absolute bottom-7 w-15 h-15 rounded-full bg-violet-600 items-center justify-center shadow-lg`} onPress={() => navigation.navigate('AddClientScreen')}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <Animated.View
        style={[tw`absolute top-0 bottom-0 left-0 w-75 bg-blue-500 py-5 px-3 shadow-lg`, { transform: [{ translateX: menuAnim }] }]}
      >
        {menuVisible && (
          <TouchableOpacity style={tw`absolute top-1 right-2 p-2`} onPress={handleMenuToggle}>
            <MaterialIcons name="close" size={24} color="#333" />
          </TouchableOpacity>
        )}
        {menuVisible && (
          <TouchableOpacity style={tw`absolute top-2 left-0 right-0 bottom-0`} onPress={handleOverlayPress} />
        )}
        <TouchableOpacity style={tw`flex-row items-center mt-10 py-2 px-5`} onPress={() => navigation.navigate('TailorProfile')}>
          <MaterialIcons name="person" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('NotificationScreen')}>
          <MaterialIcons name="notifications" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={handleDisconnect}>
          <MaterialIcons name="exit-to-app" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Disconnect</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('ClientDetails')}>
          <MaterialIcons name="people" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Clients</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('OrderScreen')}>
          <MaterialIcons name="assignment" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('Catalog')}>
          <MaterialIcons name="library-books" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('ChatScreen')}>
          <MaterialIcons name="chat" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center py-2 px-5`} onPress={() => navigation.navigate('TailorAppointmentScreen')}>
          <MaterialIcons name="calendar-today" size={24} color="white" />
          <Text style={tw`ml-2 text-lg text-white`}>Appointments</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default TailorLandingScreen;
