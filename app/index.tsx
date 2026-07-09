import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/providers/AuthProvider';

export default function FrontPage() {
  const router = useRouter();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { session, loading } = useAuth();

  const isCaptchaAuthError = (error: { message?: string } | null | undefined) => {
    const message = (error?.message || '').toLowerCase();
    return (
      message.includes('captcha') ||
      message.includes('bot protection') ||
      message.includes('verification required')
    );
  };

  const getAuthErrorDetails = (error: { message?: string } | null | undefined, fallback: string) => {
    if (isCaptchaAuthError(error)) {
      return {
        title: 'Captcha protection enabled',
        message:
          'Supabase Auth is requiring a captcha token. This app does not provide one yet, so login and password reset will continue to fail until captcha is disabled in Supabase or a captcha flow is added.',
      };
    }

    const message = error?.message || fallback;

    if (message.toLowerCase().includes('network') || message.toLowerCase().includes('fetch')) {
      return {
        title: 'Network error',
        message: 'Please check your internet connection and try again.',
      };
    }

    return {
      title: fallback,
      message,
    };
  };

  const handleForgotPassword = async () => {
    console.log("hello")
  if (!loginInput.trim()) {
    Toast.show({ type: 'error', text1: 'Enter your email or registration number first' });
    return;
  }

  setIsForgotPasswordLoading(true);
  try {
    // If user typed registration number → convert to email first (same logic you already have)
    let emailToUse = loginInput;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginInput)) {
      const { data } = await supabase
        .from('profiles')
        .select('email')
        .eq('registration_number', loginInput)
        .maybeSingle();
      if (!data) {
        Toast.show({ type: 'error', text1: 'Registration number not found'});
        setIsForgotPasswordLoading(false);
        return;
      }
      emailToUse = data.email;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(emailToUse, {
      redirectTo: 'calmspace://reset-password',   // ← THIS IS THE ONLY LINE YOU NEED
    });

    if (error) {
      const authError = getAuthErrorDetails(error, 'Failed to send reset email');
      Toast.show({
        type: 'error',
        text1: authError.title,
        text2: authError.message,
      });
    } else {
      Toast.show({ 
        type: 'success', 
        text1: 'Check your email', 
        text2: 'Password reset link sent!' 
      });
    }
  } catch (err: any) {
    Toast.show({ 
      type: 'error', 
      text1: 'Network error', 
      text2: 'Please check your internet connection' 
    });
  } finally {
    setIsForgotPasswordLoading(false);
  }
};

useEffect(() => {
  const redirectUser = async () => {
    // 1. Wait for session loading
    if (loading) return;
    
    // 2. No session? Stop and show login
    if (!session?.user?.id) {
      setIsRedirecting(false);
      return;
    }

    // 3. Prevent multiple redirect triggers
    if (isRedirecting || isProfileLoading) return;

    setIsRedirecting(true);
    setIsProfileLoading(true);

    try {
      // 4. Fetch profile type to determine destination
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('type')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error || !profile) {
        console.error('Profile fetch error:', error);
        // Safety fallback: if session exists but profile doesn't,
        // they might need to complete registration or we default safely.
        router.replace('/student/student-home');
        return;
      }

      // 5. Route based on verified type
      switch (profile.type) {
        case 'STUDENT':
        case 'PEER':
          router.replace('/student/student-home');
          break;
        case 'EXPERT':
          router.replace('/expert/expert-home');
          break;
        case 'ADMIN':
          router.replace('/admin/admin-home');
          break;
        default:
          router.replace('/student/student-home');
      }
    } catch (err) {
      console.error('Redirect exception:', err);
      router.replace('/student/student-home');
    } finally {
      setIsProfileLoading(false);
    }
  };

  redirectUser();
}, [session?.user?.id, loading]);

  async function signInWithEmail() {
    setIsLoading(true);
    
    try {
      // Check if input is email or registration number
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmail = emailRegex.test(loginInput);
      
      let email = loginInput;
      
      // If input is not email, treat it as registration number
      if (!isEmail) {
        // Find user by registration number
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('registration_number', loginInput)
          .maybeSingle();
        
        if (profileError) {
          console.error('Profile lookup error:', profileError);
          Toast.show({ 
            type: 'error', 
            text1: 'Login error', 
            text2: 'Please check your credentials',
            position: 'top', 
            visibilityTime: 2000 
          });
          setIsLoading(false);
          return;
        }
        
        if (!profileData) {
          Toast.show({ 
            type: 'error', 
            text1: 'Registration number not found', 
            text2: 'Please check your registration number',
            position: 'top', 
            visibilityTime: 2000 
          });
          setIsLoading(false);
          return;
        }
        
        email = profileData.email;
      }
      
      // Login with email and password
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const authError = getAuthErrorDetails(error, 'Login failed');
        Toast.show({
          type: 'error',
          text1: authError.title,
          text2: authError.message,
          position: 'top',
          visibilityTime: 2000,
        });
        setIsLoading(false);
        return;
      }
      
      // Success - close modal and let useEffect handle redirect
      Toast.show({ type: 'success', text1: 'Login successful', position: 'top', visibilityTime: 1000 });
      setLoginModalVisible(false);
      setLoginInput('');
      setPassword('');
      setIsLoading(false);
      // useEffect will automatically redirect when session updates
    } catch (err: any) {
      Toast.show({ 
        type: 'error', 
        text1: 'Network error', 
        text2: 'Please check your internet connection',
        position: 'top', 
        visibilityTime: 2000 
      });
      setIsLoading(false);
    }
  }

  // Show loader while determining destination to prevent UI flash
  if (loading || isRedirecting || isProfileLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F21A2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Help Button - Top Right */}
      <View style={{ position: 'absolute', top: 60, right: 16, zIndex: 100 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4F21A2',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 20,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}
          onPress={() => router.push('./help')}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', fontFamily: 'Tinos' }}>Help</Text>
        </TouchableOpacity>
      </View>

      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
      <Text style={styles.mainTitle}>Calm Space</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={() => setLoginModalVisible(true)}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={() => router.push('/student-register')}>
          <Text style={styles.signupButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={loginModalVisible} animationType="slide" transparent={true} onRequestClose={() => setLoginModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Login</Text>

            <Text style={styles.inputLabel}>Registration No / Email</Text>
            <TextInput style={styles.input} placeholder="Enter registration number or email" value={loginInput} onChangeText={setLoginInput} autoCapitalize="none" />

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput style={styles.passwordInput} placeholder="Enter password" value={password} onChangeText={setPassword} secureTextEntry={!passwordVisible} />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
                <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="#4F21A2" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={handleForgotPassword} 
              style={{ alignSelf: 'flex-end', marginBottom: 20, marginTop: -10, opacity: isForgotPasswordLoading ? 0.5 : 1 }}
              disabled={isForgotPasswordLoading}
            >
              <Text style={{ color: '#4F21A2', fontSize: 15, fontWeight: '600', fontFamily: 'Tinos', textDecorationLine: 'underline' }}>
                {isForgotPasswordLoading ? 'Sending...' : 'Forgot Password?'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => { setLoginModalVisible(false); setLoginInput(''); setPassword(''); }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={() => { signInWithEmail(); }}>
                <Text style={styles.confirmButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  logo: { width: 400, height: 250, marginLeft: 5 },
  mainTitle: { textAlign: 'center', fontSize: 80, fontWeight: '600', color: '#4F21A2', fontFamily: 'Agbalumo', letterSpacing: -1 },
  buttonContainer: { marginTop: 40, width: '80%', alignItems: 'center' },
  loginButton: { backgroundColor: '#4F21A2', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginBottom: 15, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  loginButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: 'Tinos' },
  signupButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#4F21A2', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, width: '100%', alignItems: 'center' },
  signupButtonText: { color: '#4F21A2', fontSize: 18, fontWeight: 'bold', fontFamily: 'Tinos' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { backgroundColor: 'white', borderRadius: 20, padding: 30, width: '90%', maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#4F21A2', textAlign: 'center', marginBottom: 20, fontFamily: 'Tinos' },
  inputLabel: { fontSize: 16, color: '#666', marginBottom: 8, fontFamily: 'Tinos' },
  input: { borderWidth: 2, borderColor: '#4F21A2', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15, fontFamily: 'Tinos', color: '#000' },
  passwordContainer: { position: 'relative', marginBottom: 20 },
  passwordInput: { borderWidth: 2, borderColor: '#4F21A2', borderRadius: 10, padding: 12, paddingRight: 45, fontSize: 16, fontFamily: 'Tinos', color: '#000' },
  eyeIcon: { position: 'absolute', right: 12, top: 12, padding: 4 },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#4F21A2', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flex: 0.45 },
  cancelButtonText: { color: '#4F21A2', fontSize: 16, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Tinos' },
  confirmButton: { backgroundColor: '#4F21A2', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flex: 0.45 },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center', fontFamily: 'Tinos' },
});
