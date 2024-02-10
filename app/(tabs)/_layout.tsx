import {
  FontAwesome,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        tabBarLabelStyle: {
          fontFamily: 'mon',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }: any) => (
            <Ionicons name='search' color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name='wishlists'
        options={{
          title: 'Wishlists',
          tabBarIcon: ({ color, size }: any) => (
            <Ionicons name='heart-outline' size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='trips'
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, size }: any) => (
            <FontAwesome5 name='airbnb' size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='inbox'
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }: any) => (
            <MaterialCommunityIcons
              name='message-outline'
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }: any) => (
            <Ionicons name='person-circle-outline' size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
