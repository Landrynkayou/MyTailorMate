import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To access token from AsyncStorage
import tw from 'twrnc';
import io from 'socket.io-client';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = io('http://192.168.1.190:5000'); // Replace with your backend URL

  // Fetch tailor notifications from the backend with Authorization token
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('token'); // Assuming token is stored as 'token'

        // Check if the token exists
        if (!token) {
          console.error('No token found');
          setLoading(false);
          return;
        }

        // Fetch notifications with the token in headers
        const response = await fetch('http://192.168.1.190:5000/api/notifications', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();

    // Listen for new notifications via Socket.io
    socket.on('newNotification', (notification) => {
      setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Render individual notification
  const renderNotification = ({ item }) => (
    <TouchableOpacity style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg`}>
      <Text style={tw`font-semibold text-lg text-gray-800`}>{item.title}</Text>
      <Text style={tw`text-gray-600`}>{item.message}</Text>
    </TouchableOpacity>
  );

  // Loader while data is being fetched
  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <View style={tw`bg-blue-600 py-4 px-5`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold text-center`}>Notifications</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={() => (
          <Text style={tw`text-center mt-5 text-lg text-gray-600`}>No notifications available</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;
