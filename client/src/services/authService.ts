import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  NextOrObserver,
} from 'firebase/auth'
import { auth } from '../config/firebase'

export interface User {
  id: number
  email: string
  name: string
  firebaseUid: string
}

class AuthService {
  private currentUser: User | null = null

  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await credential.user.getIdToken()
    return this.authenticateWithServer(idToken)
  }

  async loginWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    const idToken = await credential.user.getIdToken()
    return this.authenticateWithServer(idToken)
  }

  async register(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const idToken = await credential.user.getIdToken()
    return this.authenticateWithServer(idToken)
  }

  async logout(): Promise<void> {
    await signOut(auth)
    this.currentUser = null
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const observer: NextOrObserver<FirebaseUser> = (firebaseUser) => {
      const handleAuthStateChange = async () => {
        if (firebaseUser) {
          const idToken = await firebaseUser.getIdToken()
          try {
            const user = await this.authenticateWithServer(idToken)
            callback(user)
          } catch (error) {
            console.error('Error authenticating with server:', error)
            callback(null)
          }
        } else {
          callback(null)
        }
      }

      // 非同期処理を明示的に呼び出す
      void handleAuthStateChange()
    }

    return onAuthStateChanged(auth, observer)
  }

  private async authenticateWithServer(idToken: string): Promise<User> {
    const response = await fetch('/api/auth/firebase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })

    if (!response.ok) {
      throw new Error('Failed to authenticate with server')
    }

    const { user } = await response.json()
    this.currentUser = user
    return user
  }
}

export const authService = new AuthService()
