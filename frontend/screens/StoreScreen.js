import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';
import api from '../services/api';

const StoreScreen = () => {
  const [catalog, setCatalog] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await api.get('/store/catalog', { params: { search } });
        setCatalog(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCatalog();
  }, [search]);

  return (
    <View>
      <TextInput
        placeholder="Pesquisar..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={catalog}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>R$ {item.price.toFixed(2)}</Text>
            <Button title="Adicionar ao Carrinho" onPress={() => {}} />
          </View>
        )}
      />
    </View>
  );
};

export default StoreScreen;
