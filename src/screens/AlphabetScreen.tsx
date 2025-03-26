import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';
import { grantReward } from '../utils/reward'; // đã tạo trước đó
import { getPhone } from '../utils/session';   // lấy session lưu từ trước

const alphabetList = [
  { letter: 'a', word: 'áo', image: require('../assets/alphabet/ao.png') },
  { letter: 'ă', word: 'ăn', image: require('../assets/alphabet/an.png') },
  { letter: 'â', word: 'ấm', image: require('../assets/alphabet/am.png') },
  { letter: 'b', word: 'bé', image: require('../assets/alphabet/be.png') },
  { letter: 'c', word: 'cá', image: require('../assets/alphabet/ca.png') },
  // ... anh thêm đầy đủ bảng chữ cái tiếng Việt ở đây
];

const AlphabetScreen = () => {
  const [index, setIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  const current = alphabetList[index];

  const speak = () => {
    Speech.speak(current.letter, { language: 'vi-VN' });
  };

  const next = async () => {
    try {
      const phone = await getPhone();
      if (!phone) return Alert.alert('Chưa xác thực người dùng');

      // Cập nhật tiến độ học chữ cái
      await axios.patch('https://conhocgioi-api.onrender.com/update-progress', {
        phone,
        childIndex: 0,
        subject: 'alphabet',
        amount: 5
      });

      // Cộng chuỗi đúng + thưởng nếu đạt mốc
      const nextStreak = correctStreak + 1;
      setCorrectStreak(nextStreak);

      if (nextStreak > 0 && nextStreak % 5 === 0) {
        await grantReward({
          phone,
          childIndex: 0,
          type: 'stickers',
          reward: 'star'
        });
        Alert.alert('🎉 Bé nhận được 1 sticker ⭐ vì học siêng!');
      }

      // Chuyển sang chữ tiếp theo
      setIndex((prev) => (prev + 1 < alphabetList.length ? prev + 1 : 0));
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật tiến độ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.letter}>{current.letter}</Text>
      <Image source={current.image} style={styles.image} />
      <Text style={styles.word}>Ví dụ: {current.word}</Text>

      <TouchableOpacity onPress={speak} style={styles.button}>
        <Text style={styles.buttonText}>🔊 Nghe phát âm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={next} style={[styles.button, { backgroundColor: '#27ae60' }]}>
        <Text style={styles.buttonText}>➡️ Tiếp theo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AlphabetScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 96, fontWeight: 'bold', marginBottom: 16, color: '#2c3e50' },
  image: { width: 200, height: 200, marginBottom: 16 },
  word: { fontSize: 24, marginBottom: 20 },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12
  },
  buttonText: { color: 'white', fontSize: 18 }
});