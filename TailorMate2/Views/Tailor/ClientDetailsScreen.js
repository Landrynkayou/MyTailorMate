import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const ClientDetailsScreen = ({ route, navigation }) => {
  // Extract client data from route params
  const { client } = route.params || {};

  // If client data is not available, show an error message or fallback
  if (!client) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-xl font-bold`}>No client data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={tw`p-6`}>
      <Text style={tw`text-2xl font-bold text-gray-800 mb-4`}>Client Details</Text>

      <Text style={tw`text-xl font-semibold text-gray-700 mb-2`}>Name:</Text>
      <Text style={tw`text-lg text-gray-600 mb-4`}>{client.name}</Text>

      <Text style={tw`text-xl font-semibold text-gray-700 mb-2`}>Measurements:</Text>
      {client.measurements.length > 0 ? (
        client.measurements.map((measurement, index) => (
          <View key={index} style={tw`bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200`}>
            <Text style={tw`text-lg font-medium`}>{measurement.label}:</Text>
            <Text style={tw`text-lg text-gray-600`}>{measurement.value}</Text>
          </View>
        ))
      ) : (
        <Text style={tw`text-lg text-gray-600`}>No measurements available</Text>
      )}

      <Text style={tw`text-xl font-semibold text-gray-700 mb-2`}>Orders:</Text>
      {client.orders.length > 0 ? (
        client.orders.map((order, index) => (
          <View key={index} style={tw`bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-200`}>
            <Text style={tw`text-lg font-medium`}>Item:</Text>
            <Text style={tw`text-lg text-gray-600`}>{order.item}</Text>
            <Text style={tw`text-lg font-medium mt-2`}>Status:</Text>
            <Text style={tw`text-lg text-gray-600`}>{order.status}</Text>
          </View>
        ))
      ) : (
        <Text style={tw`text-lg text-gray-600`}>No orders available</Text>
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={tw`bg-blue-600 p-4 rounded-lg shadow-lg mt-6`}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ClientDetailsScreen;
