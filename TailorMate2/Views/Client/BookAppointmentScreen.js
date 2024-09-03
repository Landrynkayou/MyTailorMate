import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Modal, TextInput, Alert } from 'react-native';
import tw from 'twrnc';

const AppointmentScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([
    { date: '2024-09-01', details: 'Client A - Custom Suit Fitting' },
    { date: '2024-09-05', details: 'Client B - Measurement Session' },
  ]); // Initial data for testing
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const renderAppointment = ({ item }) => (
    <TouchableOpacity style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg`}>
      <Text style={tw`font-semibold text-lg text-gray-800`}>{item.date}</Text>
      <Text style={tw`text-gray-600`}>{item.details}</Text>
    </TouchableOpacity>
  );

  const handleAddAppointment = () => {
    if (newDate && newDetails) {
      setAppointments([...appointments, { date: newDate, details: newDetails }]);
      setNewDate('');
      setNewDetails('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Appointment added successfully');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <FlatList
        data={appointments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAppointment}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={<Text style={tw`text-center text-gray-600 mt-5`}>No appointments found</Text>}
      />

      <TouchableOpacity
        style={tw`bg-blue-600 p-4 rounded-full w-15 h-15 items-center justify-center absolute bottom-5 right-5 shadow-lg`}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={tw`text-white text-2xl`}>+</Text>
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
              placeholder="Details"
              value={newDetails}
              onChangeText={setNewDetails}
            />
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
