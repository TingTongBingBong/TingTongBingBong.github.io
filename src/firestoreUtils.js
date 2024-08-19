import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const createNote = async (noteId, initialContent = "This is your first note!") => {
  try {
    await setDoc(doc(db, "notes", noteId), {
      content: initialContent,
      updatedAt: new Date(),
    });
    console.log("Note created with ID:", noteId);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
