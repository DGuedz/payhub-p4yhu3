import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Pressable, Text, Animated } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useRef } from 'react'

import LoginScreen from './src/screens/Login'
import PosScreen from './src/screens/Pos'
import DashboardScreen from './src/screens/Dashboard'
import { ThemeProvider, useTheme, useThemeActions } from './src/theme-provider'

const Stack = createNativeStackNavigator()

function AppInner() {
  const theme = useTheme()
  const { name, toggleTheme } = useThemeActions()
  const toggleScale = useRef(new Animated.Value(1)).current
  return (
    <NavigationContainer>
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={({}) => ({
          headerStyle: { backgroundColor: theme.colors.surface2 },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.bg },
          headerRight: () => (
            <Animated.View style={{ transform: [{ scale: toggleScale }] }}>
              <Pressable
                onPress={toggleTheme}
                onPressIn={() => Animated.spring(toggleScale, { toValue: 0.95, useNativeDriver: true }).start()}
                onPressOut={() => Animated.spring(toggleScale, { toValue: 1, useNativeDriver: true }).start()}
                style={{ paddingHorizontal: 12, paddingVertical: 6 }}
              >
                <Text style={{ color: theme.colors.text }}>{name === 'dark' ? '🌙' : '☀️'}</Text>
              </Pressable>
            </Animated.View>
          ),
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'PAYHUB — Login' }} />
        <Stack.Screen name="POS" component={PosScreen} options={{ title: 'Soft-POS' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({})
