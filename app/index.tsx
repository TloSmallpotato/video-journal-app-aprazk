
import { Redirect } from 'expo-router';
import { useBiometricAuth } from '../contexts/BiometricAuthContext';

export default function Index() {
  const { isAuthenticated } = useBiometricAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/profile" />;
  }

  return <Redirect href="/auth" />;
}
