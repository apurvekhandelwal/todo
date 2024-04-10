import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const getUserById = async (uid) => {
    const userDocRef = doc(db, "Users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
        return userSnapshot.data();
    }
};