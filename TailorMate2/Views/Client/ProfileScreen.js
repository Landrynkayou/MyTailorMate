import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';

const ClientProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    // Save profile logic
    alert('Profile updated successfully');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100 p-5`}>
      <View style={tw`mb-8`}>
        <Text style={tw`text-3xl font-bold text-blue-600 mb-2`}>Edit Profile</Text>
        <Text style={tw`text-lg text-gray-600`}>Update your personal information</Text>
      </View>

      <View style={tw`mb-5`}>
        <Text style={tw`text-sm text-gray-600 mb-1`}>Name</Text>
        <TextInput
          style={tw`bg-white p-4 rounded-lg mb-4 shadow-md text-gray-800`}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={tw`mb-5`}>
        <Text style={tw`text-sm text-gray-600 mb-1`}>Email</Text>
        <TextInput
          style={tw`bg-white p-4 rounded-lg mb-4 shadow-md text-gray-800`}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={tw`mb-8`}>
        <Text style={tw`text-sm text-gray-600 mb-1`}>Phone</Text>
        <TextInput
          style={tw`bg-white p-4 rounded-lg shadow-md text-gray-800`}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity 
        style={tw`bg-blue-700 p-4 rounded-lg shadow-lg`}
        onPress={handleSave}
      >
        <Text style={tw`text-white text-center text-lg font-semibold`}>Save Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ClientProfileScreen;
