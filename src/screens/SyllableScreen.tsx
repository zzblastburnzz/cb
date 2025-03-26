import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { getPhone } from '../utils/session';
import { grantReward } from '../utils/reward';

const syllables = [
  { start: 'c', middle: 'a', end: '', word: 'ca' },
  { start: 'b', middle: 'e', end: '', word: 'be' },
  { start: 'm', middle: 'é', end: '', word: 'mé' },
  { start: 'c', middle: 'o', end: 'n', word: 'con' },
  { start: 'g', middle: 'à', end: '', word: 'gà' },
];

const SyllableScreen = () => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState({ start: '', middle: '', end: '' });
  const [correctCount, setCorrectCount] = useState(0);

  const current = syllables[index];

  const select = (type, value) => {
    setPicked((prev) => ({ ...prev, [type]: value }));
  };

  const check = async () => {
    const word = picked.start + picked.middle + picked.end;

    if (word === current.word) {
      Alert.alert('✅ Chính xác!', `Từ "${word}" là đúng!`);
      setCorrectCount((prev) => prev + 1);

      const phone = await getPhone();
      if (phone) {
        await axios.patch('https://conhocgioi-api.onrender.com/update-progress', {
          phone,
          childIndex: 0,
          subject: 'syllable',
          amount: 10
        });

        if ((correctCount + 1) % 3 === 0) {
          await grantReward({
            phone,
            childIndex: 0,
            type: 'stickers',
            reward: 'banana'
          });
          Alert.alert('🎉 Bé được sticker vì ghép từ siêu quá!');
        }
      }

      // Reset và sang từ mới
      setPicked({ start: '', middle: '', end: '' });
      setIndex((prev) => (prev + 1 < syllables.length ? prev + 1 : 0));
    } else {
      Alert.alert('❌ Chưa đúng', `Từ bạn tạo là "${word}", thử lại nha!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Ghép vần: {current.word.length} chữ</Text>

      <View style={styles.row}>
        {['c', 'b', 'm', 'g'].map((s) => (
          <TouchableOpacity key={s} onPress={() => select('start', s)} style={styles.box}>
            <Text style={styles.letter}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['a', 'e', 'é', 'o', 'à'].map((m) => (
          <TouchableOpacity key={m} onPress={() => select('middle', m)} style={styles.box}>
            <Text style={styles.letter}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {['n', '', 'p'].map((e) => (
          <TouchableOpacity key={e || 'none'} onPress={() => select('end', e)} style={styles.box}>
            <Text style={styles.letter}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={{ fontSize: 24, marginTop: 16 }}>
        🔤 Từ bạn tạo: {picked.start}{picked.middle}{picked.end}
      </Text>

      <TouchableOpacity onPress={check} style={styles.button}>
        <Text style={styles.buttonText}>Kiểm tra</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SyllableScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 },
  box: { padding: 16, backgroundColor: '#ecf0f1', margin: 6, borderRadius: 10 },
  letter: { fontSize: 24 },
  button: { marginTop: 20, backgroundColor: '#3498db', padding: 14, borderRadius: 10 },
  buttonText: { color: 'white', fontSize: 18, textAlign: 'center' }
});