import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/FontAwesome';

const ClientListScreen = ({ navigation }) => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchUserIdAndClients = async () => {
      try {
        // Retrieve the stored user ID and token from AsyncStorage
        const storedUserId = await AsyncStorage.getItem('userID');
        const storedToken = await AsyncStorage.getItem('token');

        if (!storedUserId || !storedToken) {
          Alert.alert('Error', 'User ID or token not found. Please login again.');
          navigation.navigate('Login'); // Redirect to login if user ID or token is missing
          return;
        }

        setUserId(storedUserId);
        setToken(storedToken);

        // Make an API call to fetch clients associated with the user ID
        const response = await fetch('http://192.168.1.190:5000/api/clients', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }

        const data = await response.json();
        setClients(data);
        setFilteredClients(data);  // Initially set filtered clients to all clients
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndClients();
  }, []);

  // Search handler
  const handleSearch = (text) => {
    setSearchText(text);

    // Filter clients based on the search text
    const filteredData = clients.filter(client =>
      client.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredClients(filteredData);
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-purple-50`}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-purple-50`}>
        <Text style={tw`text-xl font-bold text-red-600`}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={tw`p-6 bg-purple-100`}>
      <Text style={tw`text-3xl font-bold text-purple-800 mb-6`}>Clients List</Text>

      {/* Search Input */}
      <TextInput
        style={tw`bg-white p-3 mb-6 rounded-lg shadow-lg border border-purple-300`}
        placeholder="Search clients by name..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {filteredClients.length > 0 ? (
        filteredClients.map((client) => {
          const measurements = client.measurements || {}; // Ensure measurements are present

          return (
            <TouchableOpacity
              key={client._id}
              onPress={() => navigation.navigate('ClientProfileScreen', { client })}
              style={tw`bg-white p-6 mb-4 rounded-lg shadow-lg border border-purple-300`}
            >
              <View style={tw`flex-row items-center`}>
                <Icon name="user" size={24} color="#6a1b9a" />
                <Text style={tw`text-xl font-semibold text-purple-800 ml-2`}>{client.name}</Text>
              </View>
              <View style={tw`mt-4`}>
                <View style={tw`flex-row items-center`}>
                  <Icon name="circle" size={20} color="#6a1b9a" />
                  <Text style={tw`text-gray-600 ml-2`}>Height: {measurements.height} cm</Text>
                </View>
                <View style={tw`flex-row items-center mt-2`}>
                  <Icon name="circle" size={20} color="#6a1b9a" />
                  <Text style={tw`text-gray-600 ml-2`}>Weight: {measurements.weight} kg</Text>
                </View>
                <View style={tw`flex-row items-center mt-2`}>
                  <Icon name="circle" size={20} color="#6a1b9a" />
                  <Text style={tw`text-gray-600 ml-2`}>Chest Size: {measurements.chestSize} cm</Text>
                </View>
                <View style={tw`flex-row items-center mt-2`}>
                  <Icon name="circle" size={20} color="#6a1b9a" />
                  <Text style={tw`text-gray-600 ml-2`}>Waist Size: {measurements.waistSize} cm</Text>
                </View>
                <View style={tw`flex-row items-center mt-2`}>
                  <Icon name="circle" size={20} color="#6a1b9a" />
                  <Text style={tw`text-gray-600 ml-2`}>Hip Size: {measurements.hipSize} cm</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={tw`text-lg text-gray-700`}>No clients available</Text>
      )}
    </ScrollView>
  );
};

export default ClientListScreen;
