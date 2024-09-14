import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert, FlatList, Image } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

const AppointmentScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [image, setImage] = useState(null); // State for storing the image
  const [userId, setUserId] = useState('');

  // Fetch userId and appointments
  useEffect(() => {
    const fetchUserIdAndAppointments = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchAppointments(storedUserId); // Fetch appointments after setting userId
        } else {
          console.error('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving user ID from AsyncStorage:', error);
      }
    };
    fetchUserIdAndAppointments();
  }, []);

  // Fetch appointments for the given userId
  const fetchAppointments = useCallback(async (userId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const response = await fetch(`http://192.168.1.190:5000/api/appointments?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAppointments(data); // Adjust based on the response structure
      } else {
        console.error(data.message || 'Failed to fetch appointments.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  }, []);

  // Handle image selection
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };
//
  const handleAddAppointment = async () => {
    if (newDate && newTime && newDetails && userId) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated.');
          return;
        }

        // Create form data for the appointment, including the image
        const formData = new FormData();
        formData.append('date', newDate);
        formData.append('time', newTime);
        formData.append('details', newDetails);
        formData.append('status', 'pending');
        formData.append('userId', userId);

        // Append the image if it's selected
        if (image) {
          const filename = image.split('/').pop();
          const fileType = filename.split('.').pop();
          formData.append('image', {
            uri: image,
            name: filename,
            type: `image/${fileType}`,
          });
        }
          console.log(image)
        const response = await fetch('http://192.168.1.190:5000/api/appointments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important to use multipart
          },
          body: formData,
        });

        if (response.ok) {
          fetchAppointments(userId); // Refetch appointments after adding a new one
          setNewDate('');
          setNewTime('');
          setNewDetails('');
          setImage(null); // Reset the image
          setIsModalVisible(false);
          Alert.alert('Success', 'Appointment added successfully');
        } else {
          throw new Error('Failed to add appointment');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Could not add appointment');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const renderAppointment = ({ item }) => {
    const statusColor = item.status === 'validated' ? 'green' : 'yellow'; // Change badge color based on status

    return (
      <TouchableOpacity style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`font-semibold text-lg text-gray-800`}>{item.date} </Text>
            <Text style={tw`font-semibold text-lg text-gray-800`}>At: {item.time}</Text>
            <Text style={tw`text-gray-600`}>{item.details}</Text>
          </View>
          <View style={tw`px-2 py-1 rounded-full bg-${statusColor}-200`}>
            <Text style={tw`text-sm font-semibold text-${statusColor}-800`}>{item.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id.toString()} // Use unique ID for keyExtractor
        renderItem={renderAppointment}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={<Text style={tw`text-center text-gray-600 mt-5`}>No appointments found</Text>}
      />
      <TouchableOpacity
        style={tw`bg-purple-600 p-4 rounded-full w-15 h-15 items-center justify-center absolute bottom-5 right-5 shadow-lg`}
        onPress={() => setIsModalVisible(true)}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white p-6 rounded-lg w-80`}>
            <Text style={tw`text-xl font-bold mb-4`}>New Appointment</Text>
            <TextInput
              style={tw`bg-gray-200 p-3 rounded-lg mb-3`}
              placeholder="Date (YYYY-MM-DD)"
              value={newDate}
              onChangeText={setNewDate}
            />
            <TextInput
              style={tw`bg-gray-200 p-3 rounded-lg mb-3`}
              placeholder="Time (e.g., 10:00 AM)"
              value={newTime}
              onChangeText={setNewTime}
            />
            <TextInput
              style={tw`bg-gray-200 p-3 rounded-lg mb-3`}
              placeholder="Details"
              value={newDetails}
              onChangeText={setNewDetails}
            />
            
            {/* Image picker button */}
            <TouchableOpacity style={tw`bg-gray-200 p-3 rounded-lg mb-3`} onPress={pickImage}>
              <Text style={tw`text-center`}>{image ? 'Change Image' : 'Pick Image'}</Text>
            </TouchableOpacity>

            {/* Display selected image */}
            {image && <Image source={{ uri: image }} 
            style={tw`w-40 h-40 mb-4 rounded-lg`} 
            resizeMode="cover" 
            />}

            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-red-600 p-3 rounded-lg w-2/5`}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={tw`text-white text-center`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-blue-600 p-3 rounded-lg w-2/5`}
                onPress={handleAddAppointment}
              >
                <Text style={tw`text-white text-center`}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AppointmentScreen;
