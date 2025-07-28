import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()

// Sign up with email and password
export const handleSignUp = async (email: string, password: string, name?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Create user profile in Firestore
    await createUserProfile(user, { name })
    
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign in with email and password
export const handleSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign in with Google
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    if (!userDoc.exists()) {
      await createUserProfile(user, { 
        name: user.displayName || undefined,
        photoURL: user.photoURL || undefined 
      })
    }
    
    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

// Sign out
export const handleSignOut = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Reset password
export const handlePasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Create user profile in Firestore
export const createUserProfile = async (
  user: User, 
  additionalData?: { name?: string; photoURL?: string }
) => {
  try {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      const { name, photoURL } = additionalData || {}
      const createdAt = new Date()
      
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: name || user.displayName || '',
        photoURL: photoURL || user.photoURL || '',
        createdAt,
        lastSignIn: createdAt,
        onboardingComplete: false,
        joyfulThings: [],
        deprivingThings: [],
        mindsetPrompts: [],
      })
    }
    
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
} 