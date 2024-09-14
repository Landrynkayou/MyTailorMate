import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AppText from './Apptext';
import AppInputText from './AppInputText';
import AppButton from './Appbutton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Joi from 'joi'; // Use the main Joi library
import tw from 'twrnc';

const SignupScreen = ({ route, navigation }) => {
  const { role } = route.params || {};

  const [formData, setFormData] = useState({
    role: role || 'Customer', // Default to 'Customer'
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    address: '',
    location: '' // Added location field
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData(prevState => ({
        ...prevState,
        role
      }));
    }
  }, [role]);

  const handleChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // Define Joi schema
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
    phone: Joi.string().pattern(/^\d{10}$/).required().label("Phone Number"),
    password: Joi.string().min(8).required().label("Password"),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().label("Confirm Password").messages({
      'any.only': 'Passwords do not match.',
    }),
    role: Joi.string().valid('Customer', 'Tailor', 'Admin').required().label("Role"),
    businessName: Joi.when('role', {
      is: 'Tailor',
      then: Joi.string().required().label("Business Name"),
    }),
    address: Joi.when('role', {
      is: 'Tailor',
      then: Joi.string().required().label("Address"),
    }),
    location: Joi.string().required().label("Location"),
  });

  const validate = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const errors = {};
    error.details.forEach(detail => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  };

  const handleSignup = async () => {
    // Validate the form
    const validationErrors = validate();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const { role, fullName, email, phone, password, confirmPassword, businessName, address, location } = formData;

    try {
      // Construct the endpoint based on role
      let endpoint = '';
      switch (role) {
        case 'Tailor':
          endpoint = 'http://192.168.1.190:5000/api/tailors/signup';
          break;
        case 'Admin':
          endpoint = 'http://192.168.1.190:5000/api/admins/signup';
          break;
        default:
          endpoint = 'http://192.168.1.190:5000/api/clients/signup';
          break;
      }

      // Send data to the backend using fetch
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;

        if (token && user && user.role && user.id) {
          Alert.alert('Success', 'Sign-up successful!');

          // Store token and user data in AsyncStorage
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userRole', user.role);
          await AsyncStorage.setItem('userID', user.id);

          // Navigate to the appropriate screen after signup
          if (role === 'Tailor') {
            navigation.navigate('TailorLandingPage');
          } else if (role === 'Admin') {
            navigation.navigate('AdminLandingPage');
          } else {
            navigation.navigate('ClientLandingScreen');
          }
        } else {
          throw new Error('Incomplete user data received from the server.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign-up failed. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Network request failed. Please check your connection.');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 p-5`}
      >
        <ScrollView 
          contentContainerStyle={tw`flex-grow justify-center p-5`}
          keyboardShouldPersistTaps="handled"
        >
          <View style={tw`mb-8`}>
            <AppText 
              title="Create Account"
              subtitle="Sign up now to get started with your account"
              containerStyle={tw`mb-7`}
              titleStyle={tw`text-3xl font-bold text-gray-800`}
              subtitleStyle={tw`text-lg text-gray-600 mt-1`}
            />
          </View>

          <AppInputText
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleChange('fullName', text)}
            error={errors.fullName}
            icon="user"
            containerStyle={tw`mb-4`}
          />
          
          <AppInputText
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon="envelope"
            containerStyle={tw`mb-4`}
          />
          
          <AppInputText
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            keyboardType="phone-pad"
            error={errors.phone}
            icon="phone"
            containerStyle={tw`mb-4`}
          />
          
          <AppInputText
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            error={errors.password}
            icon="lock"
            containerStyle={tw`mb-4`}
          />
          
          <AppInputText
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry
            error={errors.confirmPassword}
            icon="lock"
            containerStyle={tw`mb-4`}
          />

          {formData.role === 'Tailor' && (
            <>
              <AppInputText
                placeholder="Business Name"
                value={formData.businessName}
                onChangeText={(text) => handleChange('businessName', text)}
                error={errors.businessName}
                icon="briefcase"
                containerStyle={tw`mb-4`}
              />
              
              <AppInputText
                placeholder="Address"
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                error={errors.address}
                icon="home"
                containerStyle={tw`mb-4`}
              />
            </>
          )}

          {/* Added location input field */}
          <AppInputText
            placeholder="Location"
            value={formData.location}
            onChangeText={(text) => handleChange('location', text)}
            error={errors.location}
            icon="map-pin"
            containerStyle={tw`mb-4`}
          />

          <AppButton 
            title="Sign Up" 
            onPress={handleSignup}
            style={tw`mt-5 my-5 bg-purple-600 w-82 rounded-lg `}
          />
          
          <TouchableOpacity onPress={() => navigation.navigate('RolePicker')} style={tw`mt-5`}>
            <AppText 
              title="Change Role"
              titleStyle={tw`text-center text-lg`}
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={tw`mt-5`}>
            <AppText 
              title="Already have an account? Login"
              titleStyle={tw`text-center text-lg text-blue-600`}
            />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
