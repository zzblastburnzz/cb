import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import firebaseApp from '../firebase/firebaseConfig'; // file cấu hình Firebase
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const auth = getAuth(firebaseApp);

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const recaptchaVerifier = useRef(null);
  const navigation = useNavigation();

  const sendVerification = async () => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phoneNumber, recaptchaVerifier.current!);
      setVerificationId(id);
      setStep('otp');
    } catch (err: any) {
      Alert.alert('Lỗi gửi mã OTP', err.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);

      // Sau khi xác minh OTP, gọi API Render
      const response = await axios.post('https://conhocgioi-api.onrender.com/login-or-create-parent', {
        phone: phoneNumber,
      });

      Alert.alert('Đăng nhập thành công!');
      navigation.navigate('ParentZone'); // hoặc điều hướng về khu phụ huynh
    } catch (err: any) {
      Alert.alert('Lỗi xác minh', err.message);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center' }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseApp.options}
      />

      {step === 'input' ? (
        <>
          <Text style={{ fontSize: 24, marginBottom: 16 }}>Nhập số điện thoại</Text>
          <TextInput
            placeholder="+84..."
            keyboardType="phone-pad"
            style={{ borderWidth: 1, padding: 10, marginBottom: 16 }}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity onPress={sendVerification} style={{ backgroundColor: '#1E90FF', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Gửi mã OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 24, marginBottom: 16 }}>Nhập mã OTP</Text>
          <TextInput
            placeholder="123456"
            keyboardType="number-pad"
            style={{ borderWidth: 1, padding: 10, marginBottom: 16 }}
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity onPress={confirmCode} style={{ backgroundColor: '#32CD32', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Xác minh</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default LoginScreen;