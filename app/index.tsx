import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to signin page as default
  return <Redirect href="/(auth)/signin" />;
}