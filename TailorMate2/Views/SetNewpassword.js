import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import tw from 'twrnc';
import { useRoute } from '@react-navigation/native';

const SetNewPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { token } = route.params || {};

  const handleSubmit = async () => {
    if (newPassword === confirmPassword) {
      setLoading(true);

      try {
        const response = await fetch(`http://192.168.1.190:5000/api/reset-password/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          navigation.navigate('PasswordRecoverySuccess');
        } else {
          Alert.alert('Error', data.message || 'Failed to reset password.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to reset password. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "Passwords don't match");
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-6 bg-gray-100`}>
      <Text style={tw`text-3xl font-bold mb-8 text-blue-600`}>Set New Password</Text>
      <TextInput
        style={tw`w-full h-14 border border-gray-300 rounded-lg px-4 mb-5 bg-white shadow-lg`}
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        placeholderTextColor={tw.color('gray-400')}
      />
      <TextInput
        style={tw`w-full h-14 border border-gray-300 rounded-lg px-4 mb-8 bg-white shadow-lg`}
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
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

export default SetNewPasswordScreen;
