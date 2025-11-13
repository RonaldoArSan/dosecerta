import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HealthScreen from './screens/HealthScreen';
import StoreScreen from './screens/StoreScreen';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Saúde" component={HealthScreen} />
        <Tab.Screen name="Loja" component={StoreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
