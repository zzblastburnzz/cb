import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator } from 'react-native';

// Import các màn hình
import LoginScreen from './screens/LoginScreen';
import AddChildScreen from './screens/AddChildScreen';
import ParentZoneScreen from './screens/ParentZoneScreen';
import AlphabetScreen from './screens/AlphabetScreen';
import MathScreen from './screens/MathScreen';
import SyllableScreen from './screens/SyllableScreen';
import PracticeScreen from './screens/PracticeScreen';
import RewardScreen from './screens/RewardScreen';
import { getPhone } from './utils/session';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs chính cho bé học & phụ huynh
const HomeTabs = ({ phone }) => (
  <Tab.Navigator>
    <Tab.Screen name="Bé học toán" component={MathScreen} />
    <Tab.Screen name="Bé học chữ" component={AlphabetScreen} />
    <Tab.Screen name="Ghép vần" component={SyllableScreen} />
    <Tab.Screen name="Luyện tập" component={PracticeScreen} />
    <Tab.Screen name="Bộ sưu tập" component={RewardScreen} />
    <Tab.Screen name="Phụ huynh" options={{ headerShown: false }}>
      {() => <ParentZoneScreen route={{ params: { phone } }} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const AppNavigator = () => {
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhone().then((value) => {
      setPhone(value);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {phone ? (
          <>
            <Stack.Screen name="Home">
              {() => <HomeTabs phone={phone} />}
            </Stack.Screen>
            <Stack.Screen name="AddChild" component={AddChildScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;