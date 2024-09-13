import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://192.168.1.190:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password reset link sent to your email.');
        navigation.navigate('OTPVerification'); // Navigate to the OTP screen
      } else {
        Alert.alert('Error', data.message || 'Something went wrong.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset link. Please try again later.');
    } finally {
      setLoading(false);
    }
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
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
