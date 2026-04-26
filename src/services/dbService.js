import { db, auth } from './firebaseConfig';
import {
  collection, addDoc, getDocs,
  query, orderBy, deleteDoc, doc, updateDoc
} from 'firebase/firestore';

// Post save karo Firestore mein
export const savePost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: new Date().toISOString(),
      userId: auth.currentUser?.uid || 'anonymous',
    });
    return docRef.id;
  } catch (e) {
    console.error('Save error:', e);
    return null;
  }
};

// Sare posts load karo
export const loadPosts = async () => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error('Load error:', e);
    return [];
  }
};

// Post delete karo
export const deletePost = async (id) => {
  try {
    await deleteDoc(doc(db, 'posts', id));
    return true;
  } catch (e) {
    return false;
  }
};

// Post update karo
export const updatePost = async (id, data) => {
  try {
    await updateDoc(doc(db, 'posts', id), data);
    return true;
  } catch (e) {
    return false;
  }
};