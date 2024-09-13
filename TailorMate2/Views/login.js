import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('http://192.168.1.190:5000/api/clients/login', { // Adjust API endpoint if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Check if user and token exist in the response
        const { token, user } = data;
  
        if (token && user && user.id && user.role) {
          // Store token and user ID in AsyncStorage
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userID', user.id);
          await AsyncStorage.setItem('userRole', user.role);
    
          // Navigate based on user role
          switch (user.role) {
            case 'Tailor':
              navigation.navigate('TailorLandingPage');
              break;
            case 'Customer':
              navigation.navigate('TailorSelectionScreen');
              break;
            default:
              Alert.alert('Error', 'Unknown user role.');
              break;
          }
        } else {
          Alert.alert('Error', 'User data is missing or incomplete.');
        }
      } else {
        // Handle specific error messages from the backend
        Alert.alert('Error', data.message || 'Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      if (error.name === 'TypeError') {
        // Handle network errors or fetch-related errors
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        // Handle other types of errors
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`mt-8 ml-5`}>
        <Text style={tw`text-5xl font-bold text-purple-700`}>TailorMate</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1 p-5`}
      >
        <ScrollView contentContainerStyle={tw`flex-grow justify-center`}>
          <View style={tw`mb-10 items-center`}>
            <Text style={tw`text-4xl font-bold text-gray-800`}>Login</Text>
          </View>

          <View style={tw`bg-white shadow-lg rounded-lg mb-8`}>
            <View style={tw`flex-row items-center border border-gray-300 rounded-lg`}>
              <MaterialIcons name="email" size={24} color="purple" style={tw`p-3`} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                style={tw`flex-1 px-3 text-base text-gray-800 h-12`}
                placeholderTextColor="#95a5a6"
              />
            </View>
          </View>

          <View style={tw`bg-white shadow-lg rounded-lg mb-5`}>
            <View style={tw`flex-row items-center border border-gray-300 rounded-lg`}>
              <MaterialIcons name="lock" size={24} color="purple" style={tw`p-3`} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                style={tw`flex-1 px-3 text-base text-gray-800 h-12`}
                placeholderTextColor="#95a5a6"
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={tw`p-3`}
              >
                <MaterialIcons
                  name={passwordVisible ? 'visibility' : 'visibility-off'}
                  size={24}
                  color="purple"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={tw`bg-purple-500 w-90 rounded-lg py-3 my-8 mx-1 items-center`}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={tw`text-white text-lg font-bold`}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={tw`text-blue-700 text-center text-sm`}>Forgot your password?</Text>
          </TouchableOpacity>

          <View style={tw`mt-8 items-center`}>
            <Text style={tw`text-gray-600 text-lg`}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              style={tw`bg-purple-500 rounded-lg py-3 mt-2 px-6`}
            >
              <Text style={tw`text-white w-80 text-center text-lg font-bold`}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;
