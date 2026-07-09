import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Alert, BackHandler } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';
import '@/constants/GlobalStyles'; // Import global styles to make Tinos font available
import QueryProvider from '@/providers/QueryProvider';
import AuthProvider from '@/providers/AuthProvider';
import toastConfig from '@/components/CustomToast';
import Toast from 'react-native-toast-message';
import * as Device from 'expo-device';
import JailMonkey from 'jail-monkey';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isSecurityCheckPassed, setIsSecurityCheckPassed] = useState(false);

  const [loaded] = useFonts({
    Tinos: require('../assets/fonts/Tinos-Regular.ttf'),
    IrishGrover: require('../assets/fonts/IrishGrover-Regular.ttf'),
    Roboto: require('../assets/fonts/Roboto.ttf'),
    Agbalumo: require('../assets/fonts/Agbalumo-Regular.ttf'),
  });

  useEffect(() => {
    const checkSecurity = () => {
      if (__DEV__) {
        setIsSecurityCheckPassed(true);
        return;
      }

      const isRooted = JailMonkey.isJailBroken();
      const isEmulator = !Device.isDevice;

      if (isRooted || isEmulator) {
        Alert.alert(
          "Security Violation",
          "This application cannot run on rooted devices, emulators, or devices with high security risks for your safety.",
          [{ text: "OK", onPress: () => BackHandler.exitApp() }]
        );
      } else {
        setIsSecurityCheckPassed(true);
      }
    };

    if (loaded) {
      checkSecurity();
    }
  }, [loaded]);

  if (!loaded || !isSecurityCheckPassed) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
        <Toast config={toastConfig}/>
      </QueryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );

}

