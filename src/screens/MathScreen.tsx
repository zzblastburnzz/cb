import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { getPhone } from '../utils/session';
import { grantReward } from '../utils/reward';

const questions = [
  { question: '2 + 1 = ?', options: [2, 3, 4], correct: 3 },
  { question: 'Số nào lớn hơn?', options: [5, 2, 1], correct: 5 },
  { question: '3 - 1 = ?', options: [2, 1, 4], correct: 2 },
  { question: '1 + 1 = ?', options: [3, 1, 2], correct: 2 },
  { question: 'Số nào bé nhất?', options: [9, 4, 1], correct: 1 },
];

const MathScreen = () => {
  const [index, setIndex] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);

  const current = questions[index];

  const handleAnswer = async (choice: number) => {
    const isCorrect = choice === current.correct;

    if (isCorrect) {
      Alert.alert('✅ Chính xác!');
      setCorrectStreak((prev) => prev + 1);

      const phone = await getPhone();
      if (!phone) return;

      await axios.patch('https://conhocgioi-api.onrender.com/update-progress', {
        phone,
        childIndex: 0,
        subject: 'math',
        amount: 10
      });

      // Tặng sticker mỗi 3 câu đúng
      if ((correctStreak + 1) % 3 === 0) {
        await grantReward({
          phone,
          childIndex: 0,
          type: 'stickers',
          reward: 'math-star'
        });
        Alert.alert('🎉 Bé được thưởng sticker vì học toán giỏi!');
      }

    } else {
      Alert.alert('❌ Sai rồi! Thử lại nha!');
    }

    setTimeout(() => {
      setIndex((prev) => (prev + 1 < questions.length ? prev + 1 : 0));
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{current.question}</Text>
      {current.options.map((opt, i) => (
        <TouchableOpacity key={i} style={styles.option} onPress={() => handleAnswer(opt)}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MathScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  question: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  option: {
    backgroundColor: '#ecf0f1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center'
  },
  optionText: { fontSize: 20 }
});