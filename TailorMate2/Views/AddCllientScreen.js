import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';

const AddClientScreen = ({ navigation, route }) => {
   /* if (!navigation) {
        console.error('Navigation prop is not available.');
        return null;
      }*/
  const [name, setName] = useState('');
  const [measurements, setMeasurements] = useState([{ label: '', value: '' }]);
  const [orders, setOrders] = useState([{ item: '', status: '' }]);

  useEffect(() => {
    if (route?.params) {
      const { clientName, clientMeasurements, clientOrders } = route.params;
      if (clientName) setName(clientName);
      if (clientMeasurements) setMeasurements(clientMeasurements);
      if (clientOrders) setOrders(clientOrders);
    }
  }, [route]);

  const addClient = () => {
    const newClient = { name, measurements, orders };
    console.log('Client Information:', newClient); // Log the client information to the console
   
    // After adding the client, navigate to the tailor landing screen
    navigation.navigate('TailorLanding'); // Ensure 'TailorLanding' matches the screen name in your navigator
    navigation.goBack()
  };

  const addMeasurementField = () => setMeasurements([...measurements, { label: '', value: '' }]);
  const addOrderField = () => setOrders([...orders, { item: '', status: '' }]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-gray-50`}
    >
      <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
        <Text style={tw`text-3xl font-bold text-gray-800 mb-8 text-center`}>Add New Client</Text>

        <TextInput
          style={tw`bg-white p-4 mb-6 rounded-lg shadow-md text-lg border border-gray-200`}
          placeholder="Client Name"
          value={name}
          onChangeText={setName}
        />

        <Text style={tw`text-xl font-semibold text-gray-700 mb-4`}>Measurements</Text>
        {measurements.map((measurement, index) => (
          <View key={index} style={tw`bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200`}>
            <TextInput
              style={tw`flex-1 text-lg mb-2`}
              placeholder={`Measurement ${index + 1}`}
              value={measurement.label}
              onChangeText={(text) => {
                const updatedMeasurements = [...measurements];
                updatedMeasurements[index].label = text;
                setMeasurements(updatedMeasurements);
              }}
            />
            <TextInput
              style={tw`flex-1 text-lg`}
              placeholder="Value"
              value={measurement.value}
              onChangeText={(text) => {
                const updatedMeasurements = [...measurements];
                updatedMeasurements[index].value = text;
                setMeasurements(updatedMeasurements);
              }}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addMeasurementField} style={tw`bg-blue-600 p-4 mb-6 rounded-lg shadow-md`}>
          <Text style={tw`text-white text-center text-lg font-semibold`}>Add Measurement</Text>
        </TouchableOpacity>

        <Text style={tw`text-xl font-semibold text-gray-700 mb-4`}>Orders</Text>
        {orders.map((order, index) => (
          <View key={index} style={tw`bg-white p-4 mb-4 rounded-lg shadow-md border border-gray-200`}>
            <TextInput
              style={tw`flex-1 text-lg mb-2`}
              placeholder={`Order ${index + 1}`}
              value={order.item}
              onChangeText={(text) => {
                const updatedOrders = [...orders];
                updatedOrders[index].item = text;
                setOrders(updatedOrders);
              }}
            />
            <TextInput
              style={tw`flex-1 text-lg`}
              placeholder="Status"
              value={order.status}
              onChangeText={(text) => {
                const updatedOrders = [...orders];
                updatedOrders[index].status = text;
                setOrders(updatedOrders);
              }}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addOrderField} style={tw`bg-blue-600 p-4 mb-6 rounded-lg shadow-md`}>
          <Text style={tw`text-white text-center text-lg font-semibold`}>Add Order</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>addClient} style={tw`bg-green-600 p-4 rounded-lg shadow-md`}>
          <Text style={tw`text-white text-center text-lg font-semibold`}>Add Client</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddClientScreen;
