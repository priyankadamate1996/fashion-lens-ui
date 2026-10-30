import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

function configuredAuth() {
  const config = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  };
  if (Object.values(config).some((value) => !value)) {
    throw new Error(
      'Firebase is not configured for web yet. Add the Firebase web app values to .env.local.',
    );
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return getAuth(app);
}

export function subscribeToAuth(
  onUserChanged: (user: { email: string | null } | null) => void,
  onError: (error: Error) => void,
) {
  try {
    return onAuthStateChanged(
      configuredAuth(),
      (user) => onUserChanged(user ? { email: user.email } : null),
      (error) => onError(error),
    );
  } catch (error) {
    queueMicrotask(() =>
      onError(
        error instanceof Error
          ? error
          : new Error('Could not initialize authentication.'),
      ),
    );
    return () => {};
  }
}

export async function createEmailAccount(email: string, password: string) {
  await createUserWithEmailAndPassword(configuredAuth(), email, password);
}

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(configuredAuth(), email, password);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(configuredAuth(), email);
}

export async function signOutUser() {
  await signOut(configuredAuth());
}
