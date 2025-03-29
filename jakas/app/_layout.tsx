import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="screens/restaurant-details"
        options={{
          title: "Restaurant Details",
          headerStyle: {
            backgroundColor: '#f8f8f8',
          },
        }}
      />
    </Stack>
  );
}
