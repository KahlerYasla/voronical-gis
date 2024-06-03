import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

const Layout = () => {
    return (

        <Stack screenOptions={{
            headerShown: false,
            navigationBarHidden: false,
        }}>
            <Stack.Screen name="home" />
        </Stack>

    );
};

export default Layout;
