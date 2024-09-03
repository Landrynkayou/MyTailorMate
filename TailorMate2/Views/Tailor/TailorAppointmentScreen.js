import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import tw from 'twrnc';

const TailorAppointmentScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([
    { id: '1', date: '2024-09-01', details: 'Client A - Custom Suit Fitting', validated: false },
    { id: '2', date: '2024-09-05', details: 'Client B - Measurement Session', validated: false },
  ]); // Initial data for testing

  const handleValidateAppointment = (id) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, validated: true } : appointment
    );
    setAppointments(updatedAppointments);
    Alert.alert('Success', 'Appointment validated successfully');
  };

  const renderAppointment = ({ item }) => (
    <View style={tw`bg-white mx-4 my-2 p-4 rounded-lg shadow-lg`}>
      <Text style={tw`font-semibold text-lg text-gray-800`}>{item.date}</Text>
      <Text style={tw`text-gray-600`}>{item.details}</Text>
      <Text style={tw`mt-2 ${item.validated ? 'text-green-500' : 'text-red-500'}`}>
        {item.validated ? 'Validated' : 'Not Validated'}
      </Text>
      {!item.validated && (
        <TouchableOpacity
          style={tw`bg-blue-600 p-2 rounded-lg mt-2`}
          onPress={() => handleValidateAppointment(item.id)}
        >
          <Text style={tw`text-white text-center`}>Validate Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={renderAppointment}
        contentContainerStyle={tw`p-4`}
        ListEmptyComponent={<Text style={tw`text-center text-gray-600 mt-5`}>No appointments found</Text>}
      />
    </SafeAreaView>
  );
};

export default TailorAppointmentScreen;
