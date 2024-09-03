import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

const PasswordRecoverySuccessScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 justify-center items-center p-6`}>
        <View style={tw`bg-green-100 rounded-full p-4 mb-8`}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
        </View>
        
        <Text style={tw`text-3xl font-bold mb-4 text-center text-gray-800`}>
          Password Recovery Successful
        </Text>
        
        <Text style={tw`text-base text-gray-600 mb-8 text-center`}>
          Your password has been successfully reset. You can now log in with your new password.
        </Text>
        
        <TouchableOpacity
          style={tw`bg-blue-500 py-4 px-8 rounded-full w-full`}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={tw`text-white font-bold text-lg text-center`}>
            Return to Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PasswordRecoverySuccessScreen;