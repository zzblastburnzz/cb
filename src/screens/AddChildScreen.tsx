import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

const AddChildScreen = ({ navigation, route }) => {
  const { phone } = route.params; // nhận từ login
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const handleAdd = async () => {
    try {
      const response = await axios.post('https://conhocgioi-api.onrender.com/add-child', {
        phone,
        child: { name, age }
      });

      Alert.alert('Thành công', 'Đã thêm bé!');
      navigation.navigate('ParentZone', { phone });
    } catch (error) {
      if (error.response?.status === 403) {
        Alert.alert('Giới hạn', 'Tài khoản chỉ thêm tối đa 2 bé');
      } else {
        Alert.alert('Lỗi', 'Không thêm được bé');
      }
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Thêm bé mới</Text>

      <TextInput
        placeholder="Tên bé"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Tuổi"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        style={{ borderWidth: 1, padding: 10, marginBottom: 16 }}
      />

      <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#2ecc71', padding: 14, borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddChildScreen;