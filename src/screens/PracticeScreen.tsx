import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { getPhone } from '../utils/session';
import { grantReward } from '../utils/reward';

const allQuestions = [
  { question: '2 + 1 = ?', options: [2, 3, 4], correct: 3 },
  { question: 'Số nào lớn hơn?', options: [1, 4, 3], correct: 4 },
  { question: 'Chữ nào là nguyên âm?', options: ['a', 'b', 'm'], correct: 'a' },
  { question: 'Từ nào đúng chính tả?', options: ['cát', 'bôm', 'lơp'], correct: 'cát' },
  { question: '3 - 1 = ?', options: [1, 2, 3], correct: 2 },
  // ... anh có thể thêm bao nhiêu câu tùy ý
];

const PracticeScreen = () => {
  const [step, setStep] = useState<'menu' | 'quiz' | 'result'>('menu');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const start = (count: number) => {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
    setQuestions(shuffled);
    setCurrent(0);
    setScore(0);
    setStep('quiz');
  };

  const answer = async (opt) => {
    const correct = questions[current].correct === opt;
    if (correct) setScore((prev) => prev + 1);

    if (current + 1 === questions.length) {
      const phone = await getPhone();
      if (phone) {
        await axios.patch('https://conhocgioi-api.onrender.com/update-progress', {
          phone,
          childIndex: 0,
          subject: 'quiz',
          amount: score * 4
        });

        if (score >= questions.length * 0.8) {
          await grantReward({
            phone,
            childIndex: 0,
            type: 'unlockedSkins',
            reward: 'bon-doctor'
          });
          Alert.alert('🎉 Bé đạt điểm cao và mở khóa Bon bác sĩ!');
        }
      }
      setStep('result');
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  if (step === 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🧠 Chọn số câu luyện tập</Text>
        {[5, 10, 15].map((n) => (
          <TouchableOpacity key={n} style={styles.button} onPress={() => start(n)}>
            <Text style={styles.buttonText}>{n} câu</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  if (step === 'quiz') {
    const q = questions[current];
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{q.question}</Text>
        {q.options.map((o, i) => (
          <TouchableOpacity key={i} style={styles.option} onPress={() => answer(o)}>
            <Text style={{ fontSize: 20 }}>{o}</Text>
          </TouchableOpacity>
        ))}
        <Text style={{ marginTop: 12 }}>Câu {current + 1} / {questions.length}</Text>
      </View>
    );
  }

  if (step === 'result') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Bé đã hoàn thành luyện tập!</Text>
        <Text style={{ fontSize: 22 }}>Số câu đúng: {score} / {questions.length}</Text>
        <TouchableOpacity onPress={() => setStep('menu')} style={styles.button}>
          <Text style={styles.buttonText}>Làm lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

export default PracticeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#1abc9c', padding: 16, borderRadius: 10, marginBottom: 12 },
  buttonText: { color: 'white', fontSize: 20 },
  option: { backgroundColor: '#ecf0f1', padding: 14, borderRadius: 10, marginVertical: 6, width: '100%', alignItems: 'center' }
});