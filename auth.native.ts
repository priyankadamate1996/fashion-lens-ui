import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

function configuredAuth() {
  try {
    return getAuth();
  } catch {
    throw new Error(
      'Firebase is not configured for Android yet. Add your Firebase google-services.json and rebuild the app.',
    );
  }
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
