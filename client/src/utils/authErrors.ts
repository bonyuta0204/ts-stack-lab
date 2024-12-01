import { FirebaseError } from 'firebase/app'

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No user found with this email address.'
      case 'auth/wrong-password':
        return 'Invalid password.'
      case 'auth/email-already-in-use':
        return 'This email is already registered.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/invalid-email':
        return 'Invalid email address.'
      case 'auth/operation-not-allowed':
        return 'Operation not allowed.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.'
      default:
        return 'An error occurred during authentication.'
    }
  }
  return 'An unexpected error occurred.'
}
