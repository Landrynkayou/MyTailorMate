import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const SetNewPasswordScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (newPassword === confirmPassword) {
      // TODO: Implement API call to set new password
      navigation.navigate('PasswordRecoverySuccess');
    } else {
      // Show error message
      alert("Passwords don't match");
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
      >
        <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetNewPasswordScreen;
