import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const ParentZoneScreen = ({ route }) => {
  const { phone } = route.params;
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('https://conhocgioi-api.onrender.com/get-parent-info', {
        params: { phone }
      });
      setChildren(res.data.children || []);
    } catch (error) {
      Alert.alert('Lỗi', 'Không lấy được dữ liệu phụ huynh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👨‍👧 Bé của bạn</Text>
      {children.length === 0 && <Text>Bạn chưa thêm bé nào</Text>}
      {children.map((child, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.name}>{child.name} ({child.age} tuổi)</Text>
          <Text>📐 Toán: {child.progress?.math || 0}%</Text>
          <Text>🔤 Chữ cái: {child.progress?.alphabet || 0}%</Text>
          <Text>🧩 Ghép vần: {child.progress?.syllable || 0}%</Text>
          <Text>🧠 Kiểm tra: {child.progress?.quiz || 0}%</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default ParentZoneScreen;

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 16, backgroundColor: '#fff' },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
});