import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import api from '../services/api';

const HealthScreen = () => {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await api.get('/health/medication');
        setMedications(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMedications();
  }, []);

  return (
    <View>
      <Text>Meus Medicamentos</Text>
      <FlatList
        data={medications}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>Quantidade: {item.quantity}</Text>
          </View>
        )}
      />
      <Button title="Adicionar Medicamento" onPress={() => {}} />
    </View>
  );
};

export default HealthScreen;
