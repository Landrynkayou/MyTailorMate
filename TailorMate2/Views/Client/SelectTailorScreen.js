import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';

const TailorSelectionScreen = ({ navigation }) => {
  const [tailors, setTailors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTailors = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (!token) {
          console.error("Token not available");
          return;
        }
        const response = await fetch('http://192.168.1.190:5000/api/tailors', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
          
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error fetching tailors: ${errorText}`);
        }

        const data = await response.json();
        setTailors(data);
      } catch (error) {
        console.error("Error fetching tailors:", error);
        setError(error.message);
      }
    };

    fetchTailors();
  }, []);

  const handleTailorSelect = async (tailor) => {
    try {
      await AsyncStorage.setItem('selectedTailor', JSON.stringify(tailor)); // Save tailor details in AsyncStorage
      navigation.navigate('ClientLandingScreen', { tailorId: tailor._id });  // Pass tailorId to ClientLandingScreen
    } catch (error) {
      console.error("Error saving selected tailor", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleTailorSelect(item)}
    >
      <View style={styles.cardContent}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/150' }} // Add default image if none is provided
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{item.businessName || 'No Business Name'}</Text>
          <Text style={styles.location}>{item.location || 'No Location Provided'}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#4A90E2" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`flex-row items-center justify-center py-4`}>
        <Text style={tw`text-black text-xl font-bold`}>Select a Tailor</Text>
      </View>

      {error ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <Text style={tw`text-red-500`}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={tailors}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
    marginHorizontal: 5, // Adjust margin between items
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: '#4A90E2',
  },
  location: {
    fontSize: 14,
    color: '#7D8C9A',
  },
});

export default TailorSelectionScreen;
