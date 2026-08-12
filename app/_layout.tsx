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

  const [fontLoaded, fontError] = useFonts({
    Tinos: require('../assets/fonts/Tinos-Regular.ttf'),
    IrishGrover: require('../assets/fonts/IrishGrover-Regular.ttf'),
    Roboto: require('../assets/fonts/Roboto.ttf'),
    Agbalumo: require('../assets/fonts/Agbalumo-Regular.ttf'),
  });

  // Resilient Font Handling: Continue if fonts fail or take too long
  useEffect(() => {
    if (fontError) {
      console.warn('⚠️ Font loading failed, falling back to system fonts:', fontError);
    }
  }, [fontError]);

  const isReady = fontLoaded || fontError;

  useEffect(() => {
    const checkSecurity = async () => {
      // In development mode, we skip strict security checks to allow testing
      if (__DEV__) {
        console.log('🛠️ Development mode detected: Skipping hardware security checks');
        setIsSecurityCheckPassed(true);
        return;
      }

      try {
        const isRooted = JailMonkey.isJailBroken();
        const isEmulator = !Device.isDevice;
        const isHooked = JailMonkey.hookDetected();
        const isDebugged = await JailMonkey.isDevelopmentSettingsMode();

        // Critical violations: Rooting or Hooking
        if (isRooted || isHooked) {
          Alert.alert(
            "Security Violation",
            "This application cannot run on compromised (rooted/jailbroken) devices for your privacy and data security.",
            [{ text: "Exit App", onPress: () => BackHandler.exitApp() }]
          );
          return;
        }

        // High risk: Emulators in production (optional blocking)
        if (isEmulator) {
          console.warn('⚠️ Emulator detected in non-dev build');
          // For now we allow emulators but could block them here if needed for strict production
          setIsSecurityCheckPassed(true);
        } else {
          setIsSecurityCheckPassed(true);
        }
      } catch (err) {
        console.error('Security check failed:', err);
        // Fail-safe: allow if check itself fails, but log it
        setIsSecurityCheckPassed(true);
      }
    };

    if (isReady) {
      checkSecurity();
    }
  }, [isReady]);

  if (!isReady || !isSecurityCheckPassed) {
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

