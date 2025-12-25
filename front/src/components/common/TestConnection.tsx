// src/components/TestConnection.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import axiosInstance from '@/api/axios';

function TestConnection() {
  const [status, setStatus] = useState('확인 중...');
  const [serverInfo, setServerInfo] = useState('');

  const testConnection = async () => {
    setStatus('테스트 중...');
    try {
      // Health check 엔드포인트 호출
      const response = await axiosInstance.get('/health');
      setStatus('✅ 연결 성공!');
      setServerInfo(JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      setStatus('❌ 연결 실패');
      setServerInfo(
        error.response?.data
          ? JSON.stringify(error.response.data, null, 2)
          : error.message,
      );
      console.error('연결 오류:', error);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EC2 연결 상태</Text>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.info}>{serverInfo}</Text>
      <Button title="다시 테스트" onPress={testConnection} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginVertical: 10,
  },
  info: {
    fontSize: 12,
    color: '#666',
    marginVertical: 10,
  },
});

export default TestConnection;
