import { Stack } from "expo-router";

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
