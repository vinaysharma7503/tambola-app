import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather'; // optional - used for Phone/Mail/Lock/Chrome-like icons

type LoginProps = {
  onLogin: () => void;
};

const OTP_LENGTH = 6;

export default function Login({ onLogin }: LoginProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }).map(() => ''));

  // refs for OTP inputs so we can focus next
  const otpRefs = useRef<Array<TextInput | null>>(Array(OTP_LENGTH).fill(null));

  // small entrance animations
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, [containerOpacity, cardScale]);

  // handlers
  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      setShowOTP(true);
      // focus first otp input after small delay (allow animation)
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    }
  };

  const handleOTPChange = (index: number, value: string | undefined) => {
    const text = (value ?? '').replace(/\D/g, '').slice(0, 1);
    const newOTP = [...otp];
    newOTP[index] = text;
    setOtp(newOTP);

    if (text && index < OTP_LENGTH - 1) {
      // focus next
      otpRefs.current[index + 1]?.focus();
    }

    // auto-submit when all digits entered
    if (newOTP.every(d => d) && index === OTP_LENGTH - 1) {
      setTimeout(() => {
        onLogin();
      }, 500);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // mock/login flow
    setTimeout(onLogin, 500);
  };

  const handleChangeNumber = () => {
    setShowOTP(false);
    setOtp(Array.from({ length: OTP_LENGTH }).map(() => ''));
    // optionally clear phone
    // setPhoneNumber('');
  };

  // small UI helpers
  const isSendEnabled = phoneNumber.length === 10;
  const otpDisplay = otp.join('');

  return (
    <LinearGradient
      colors={['#FBF7FF', '#FFF7F4', '#FFF1EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.full}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.inner, { opacity: containerOpacity, transform: [{ scale: cardScale }] }]}>
            {/* Logo & heading */}
            <View style={styles.logoWrap}>
              <Animated.View style={styles.logoBadge}>
                <Text style={styles.logoEmoji}>🎱</Text>
              </Animated.View>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Login to continue playing</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              {!showOTP ? (
                <>
                  {/* Phone input */}
                  <View style={styles.field}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.inputRow}>
                      <View style={styles.leftIcon}>
                        <Icon name="phone" size={18} color="#9CA3AF" />
                      </View>
                      <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        maxLength={10}
                        placeholder="Enter 10-digit number"
                        value={phoneNumber}
                        onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, '').slice(0, 10))}
                        returnKeyType="done"
                      />
                    </View>
                  </View>

                  {/* Send OTP */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleSendOTP}
                    disabled={!isSendEnabled}
                    style={[
                      styles.primaryButton,
                      !isSendEnabled && styles.disabledButton,
                    ]}
                  >
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.dividerWrap}>
                    <View style={styles.dividerLine} />
                    <View style={styles.dividerTextWrap}>
                      <Text style={styles.dividerText}>Or continue with</Text>
                    </View>
                  </View>

                  {/* Social buttons */}
                  <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('google')}>
                      <Icon name="globe" size={18} color="#374151" />
                      <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('apple')}>
                      <Text style={styles.socialEmoji}>🍎</Text>
                      <Text style={styles.socialText}>Apple</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.field}>
                    <Text style={[styles.label, { textAlign: 'center' }]}>Enter OTP sent to</Text>
                    <Text style={[styles.label, { textAlign: 'center', marginTop: 8, color: '#374151' }]}>
                      +91 {phoneNumber}
                    </Text>

                    <View style={styles.otpRow}>
                      {otp.map((digit, idx) => (
                        <TextInput
                          key={idx}
                          ref={(el:any) => (otpRefs.current[idx] = el)}
                          value={digit}
                          onChangeText={(t) => handleOTPChange(idx, t)}
                          keyboardType="number-pad"
                          maxLength={1}
                          style={styles.otpInput}
                          textContentType="oneTimeCode"
                          returnKeyType={idx === OTP_LENGTH - 1 ? 'done' : 'next'}
                          onSubmitEditing={() => {
                            if (idx < OTP_LENGTH - 1) {
                              otpRefs.current[idx + 1]?.focus();
                            } else {
                              onLogin();
                            }
                          }}
                          accessible
                          accessibilityLabel={`OTP digit ${idx + 1}`}
                        />
                      ))}
                    </View>

                    <TouchableOpacity style={styles.linkBtn} onPress={() => { /* implement resend */ }}>
                      <Text style={styles.linkText}>Resend OTP</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onLogin}
                    style={[styles.primaryButton]}
                  >
                    <Text style={styles.primaryButtonText}>Verify & Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleChangeNumber} style={{ marginTop: 12 }}>
                    <Text style={styles.mutedLink}>Change Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Text style={styles.terms}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  flex: { flex: 1 },
  container: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoBadge: {
    backgroundColor: '#7C3AED',
    padding: 18,
    borderRadius: 24,
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  logoEmoji: { fontSize: 36 },
  title: { fontSize: 20, color: '#111827', fontWeight: '700' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },

  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  field: { marginBottom: 12 },
  label: { color: '#374151', marginBottom: 8 },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.6,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  leftIcon: { width: 28, alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  input: { flex: 1, fontSize: 16, color: '#111827' },

  primaryButton: {
    marginTop: 6,
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  dividerWrap: {
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerTextWrap: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
  },
  dividerText: {
    backgroundColor: '#fff',
    color: '#6B7280',
  },

  socialRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  socialText: { marginLeft: 8, color: '#374151' },
  socialEmoji: { fontSize: 18, marginRight: 8 },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  otpInput: {
    width: 48,
    height: 56,
    textAlign: 'center',
    borderRadius: 12,
    borderWidth: 1.6,
    borderColor: '#E5E7EB',
    fontSize: 18,
    marginHorizontal: 4,
  },

  linkBtn: { marginTop: 12, alignItems: 'center' },
  linkText: { color: '#7C3AED', fontWeight: '600' },

  mutedLink: { color: '#6B7280', textAlign: 'center' },

  terms: {
    marginTop: 16,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    paddingHorizontal: 10,
  },
});
