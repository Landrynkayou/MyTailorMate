import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const OTPVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      this[`otpInput${index + 2}`].focus();
    }
  };

  const handleSubmit = () => {
    // TODO: Implement API call to verify OTP
    navigation.navigate('SetNewPassword');
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-6`}>
      <Text style={tw`text-3xl font-bold text-blue-600 mb-8`}>OTP Verification</Text>
      <Text style={tw`text-center text-gray-700 mb-4 px-4`}>
        Please enter the 4-digit code sent to your email.
      </Text>
      <View style={tw`flex-row justify-between w-3/4 mb-6`}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={tw`w-16 h-16 border border-gray-300 rounded-lg text-center text-2xl bg-white shadow-md`}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(input) => { this[`otpInput${index + 1}`] = input; }}
          />
        ))}
      </View>
      <Text style={tw`text-gray-600 mb-6`}>
        Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-600 py-4 px-12 rounded-full shadow-lg`}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-bold text-lg`}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerificationScreen;
