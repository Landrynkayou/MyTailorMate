import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Button,
 Text
} from 'react-native';
import AppText from './Apptext';
import AppInputText from './AppInputText';
import AppButton from './Appbutton';
import tw from 'twrnc';

const SignupScreen = ({ route, navigation }) => {
  const { role } = route.params || {};

  const [formData, setFormData] = useState({
    role: role || 'Customer', // Default to 'Customer' now
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    address: ''
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

  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = phone => /^\d{10}$/.test(phone);

  const handleSignup = () => {
    const { role, fullName, email, phone, password, confirmPassword, businessName, address } = formData;
    let validationErrors = {};

    if (!fullName) validationErrors.fullName = "Full Name is required.";
    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Invalid email address.";
    }
    if (!phone) {
      validationErrors.phone = "Phone Number is required.";
    } else if (!validatePhone(phone)) {
      validationErrors.phone = "Phone number must be 10 digits.";
    }
    if (!password) validationErrors.password = "Password is required.";
    if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match.";
    if (role === 'Tailor') {
      if (!businessName) validationErrors.businessName = "Business Name is required for tailors.";
      if (!address) validationErrors.address = "Address is required for tailors.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    Alert.alert('Success', 'Sign-up successful!');

    // Navigate to the appropriate screen after signup
    if (role === 'Tailor') {
      navigation.navigate('TailorLandingPage');
    } else if (role === 'Customer') { // Updated to 'Customer'
      navigation.navigate('ClientLandingScreen');
    } else {
      console.log('Unknown role');
      // Handle unknown roles if needed
    }
  };

  // Mock data for testing
  const mockTailor = {
    role: 'Tailor',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    password: 'password123',
    confirmPassword: 'password123',
    businessName: 'John\'s Tailoring',
    address: '123 Tailor Street'
  };

  const mockCustomer = { // Updated from 'Client' to 'Customer'
    role: 'Customer',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '0987654321',
    password: 'password456',
    confirmPassword: 'password456',
    businessName: '', // Not required for customers
    address: '' // Not required for customers
  };

  // Function to fill form with mock data based on role
  const fillFormWithMockData = () => {
    if (formData.role === 'Tailor') {
      setFormData(mockTailor);
    } else if (formData.role === 'Customer') { // Updated to 'Customer'
      setFormData(mockCustomer);
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
            icon="mail"
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
          
          <AppButton 
            title="Sign Up" 
            onPress={handleSignup}
            style={tw`mt-5 bg-blue-600 rounded-lg mx-10`}
          />
          
          <TouchableOpacity onPress={() => navigation.navigate('RolePicker')} style={tw`mt-5`}>
            <AppText 
              title="Change Role"
              titleStyle={tw`text-center text-blue-600 text-lg`}
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={tw`mt-5`}>
            <AppText 
              title="Already have an account? Log In"
              titleStyle={tw`text-center text-blue-600 text-lg`}
            />
          </TouchableOpacity>

          {/* Button to fill the form with mock data */}
          <Button title="Fill with Mock Data" onPress={fillFormWithMockData} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
