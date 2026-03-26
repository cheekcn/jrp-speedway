// src/firebase/services.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, orderBy, where, serverTimestamp, limit
} from 'firebase/firestore'
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject
} from 'firebase/storage'
import { db, storage } from './config'

// ─── Generic helpers ────────────────────────────────────────────────────────
export const getCollection = async (col, ...queryConstraints) => {
  const q = queryConstraints.length
    ? query(collection(db, col), ...queryConstraints)
    : collection(db, col)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const getDocById = async (col, id) => {
  const snap = await getDoc(doc(db, col, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const addDocument = async (col, data) => {
  const docRef = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  return docRef.id
}

export const updateDocument = async (col, id, data) => {
  await updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() })
}

export const deleteDocument = async (col, id) => {
  await deleteDoc(doc(db, col, id))
}

// ─── Image upload ────────────────────────────────────────────────────────────
export const uploadImage = async (file, path) => {
  const sRef = storageRef(storage, path)
  const snapshot = await uploadBytes(sRef, file)
  return getDownloadURL(snapshot.ref)
}

export const deleteImage = async (url) => {
  try {
    const sRef = storageRef(storage, url)
    await deleteObject(sRef)
  } catch (e) {
    console.warn('Image delete failed:', e)
  }
}

// ─── Blog ───────────────────────────────────────────────────────────────────
export const getBlogPosts = (publishedOnly = true) => {
  const constraints = publishedOnly
    ? [where('published', '==', true), orderBy('createdAt', 'desc')]
    : [orderBy('createdAt', 'desc')]
  return getCollection('blog', ...constraints)
}

export const getBlogPost = (id) => getDocById('blog', id)
export const addBlogPost = (data) => addDocument('blog', data)
export const updateBlogPost = (id, data) => updateDocument('blog', id, data)
export const deleteBlogPost = (id) => deleteDocument('blog', id)

// ─── Events ─────────────────────────────────────────────────────────────────
export const getEvents = () =>
  getCollection('events', orderBy('eventDate', 'asc'))
export const getUpcomingEvents = () =>
  getCollection('events', where('eventDate', '>=', new Date()), orderBy('eventDate', 'asc'))
export const addEvent = (data) => addDocument('events', data)
export const updateEvent = (id, data) => updateDocument('events', id, data)
export const deleteEvent = (id) => deleteDocument('events', id)

// ─── Products (karts & tires for sale) ──────────────────────────────────────
export const getProducts = () =>
  getCollection('products', orderBy('category', 'asc'), orderBy('name', 'asc'))
export const addProduct = (data) => addDocument('products', data)
export const updateProduct = (id, data) => updateDocument('products', id, data)
export const deleteProduct = (id) => deleteDocument('products', id)

// ─── Admin users ────────────────────────────────────────────────────────────
export const getAdminUsers = () => getCollection('admins')
export const addAdminUser = (data) => addDocument('admins', data)
export const updateAdminUser = (id, data) => updateDocument('admins', id, data)
export const deleteAdminUser = (id) => deleteDocument('admins', id)
