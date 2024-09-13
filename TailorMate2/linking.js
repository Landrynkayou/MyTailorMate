import { Linking } from 'expo';

// Define deep link configuration
const linking = {
  prefixes: ['exp://tailormate', 'https://tailormate.app'],
  config: {
    screens: {
      Welcome: 'welcome',
      RolePicker: 'role-picker',
      Signup: 'signup',
      Login: 'login',
      TailorLandingPage: 'tailor-landing',
      ForgotPassword: 'forgot-password',
      Catalog: 'catalog',
      ClientDetails: 'client-details',
      AddClientScreen: 'add-client',
      PasswordRecoverySuccess: 'password-recovery-success',
      OTPVerification: 'otp-verification',
      SetNewPassword: 'reset-password/:token',
      TailorProfile: 'tailor-profile',
      OrderScreen: 'order-screen',
      NotificationScreen: 'notification-screen',
      ChatScreen: 'chat-screen',
      ClientLandingScreen: 'client-landing',
      ClientProfileScreen: 'client-profile',
      AppointmentScreen: 'appointment-screen',
      TailorAppointmentScreen: 'tailor-appointment',
      // Example deep link for password reset
    
    },
  },
};
