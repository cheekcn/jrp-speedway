// src/store/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { initializeApp, deleteApp } from 'firebase/app'
import {
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged, createUserWithEmailAndPassword,
  getAuth
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, firebaseConfig } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const adminProfile = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => !!adminProfile.value)
  const isSuperAdmin = computed(() => adminProfile.value?.role === 'superadmin')

  const fetchAdminProfile = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'admins', uid))
      adminProfile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
    } catch {
      adminProfile.value = null
    }
  }

  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        user.value = firebaseUser
        if (firebaseUser) await fetchAdminProfile(firebaseUser.uid)
        else adminProfile.value = null
        loading.value = false
        resolve()
      })
    })
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    await fetchAdminProfile(cred.user.uid)
    if (!adminProfile.value) {
      await signOut(auth)
      throw new Error('Account does not have admin privileges.')
    }
    return cred.user
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
    adminProfile.value = null
  }

  // Creates a new admin account using a secondary Firebase app instance
  // so the superadmin's session is never interrupted.
  const createAdmin = async (email, password, profileData) => {
    const secondaryApp = initializeApp(firebaseConfig, `secondary_${Date.now()}`)
    const secondaryAuth = getAuth(secondaryApp)
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
      await setDoc(doc(db, 'admins', cred.user.uid), {
        email,
        ...profileData,
        createdAt: new Date()
      })
      await signOut(secondaryAuth)
      return cred.user
    } finally {
      await deleteApp(secondaryApp)
    }
  }

  return { user, adminProfile, loading, isLoggedIn, isAdmin, isSuperAdmin, init, login, logout, createAdmin }
})
