import React from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';

const NotificationScreen = ({ navigation }) => {
  // Sample notifications data
  const notifications = [
    { id: '1', title: 'New Order', message: 'You have received a new order from John Doe.' },
    { id: '2', title: 'Order Completed', message: 'Jane Smith’s order has been completed.' },
    { id: '3', title: 'Measurement Reminder', message: 'Don’t forget to take measurements for client Mike Tyson.' },
  ];

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg`}>
      <Text style={tw`font-semibold text-lg text-gray-800`}>{item.title}</Text>
      <Text style={tw`text-gray-600`}>{item.message}</Text>
    </TouchableOpacity>
  );

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
