import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        gestureEnabled: true,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="restaurant-list"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="screens/restaurant-details"
        options={{
          title: "Szczegóły Restauracji",
          headerStyle: {
            backgroundColor: 'rgb(46, 204, 113)',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
