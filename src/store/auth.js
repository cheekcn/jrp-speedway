// src/store/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword, signOut,
  onAuthStateChanged, createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const adminProfile = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => !!adminProfile.value)
  const isSuperAdmin = computed(() => adminProfile.value?.role === 'superadmin')

  const fetchAdminProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'admins', uid))
    adminProfile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
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

  // Only superadmins can create new admin accounts
  const createAdmin = async (email, password, profileData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'admins', cred.user.uid), {
      email,
      ...profileData,
      createdAt: new Date()
    })
    return cred.user
  }

  return { user, adminProfile, loading, isLoggedIn, isAdmin, isSuperAdmin, init, login, logout, createAdmin }
})
