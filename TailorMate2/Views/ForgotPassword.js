import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // Implement API call to send reset password email
    navigation.navigate('OTPVerification');
  };

  return (
    <View style={tw`flex-1 justify-center bg-gray-100 items-center p-6`}>
      <Text style={tw`text-3xl font-bold mb-8 text-blue-600`}>Forgot Password</Text>
      <Text style={tw`text-center text-gray-700 mb-6 px-4`}>
        Enter the email address associated with your account to receive a password reset code.
      </Text>
      <TextInput
        style={tw`w-full h-14 border border-gray-300 rounded-lg px-4 mb-8 bg-white shadow-lg`}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={tw.color('gray-400')}
      />
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 px-10 rounded-full shadow-lg`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
