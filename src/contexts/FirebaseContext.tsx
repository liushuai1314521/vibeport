import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  orderBy, 
  limit,
  serverTimestamp,
  getDocFromServer
} from "firebase/firestore";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import { auth, db, storage, OperationType, handleFirestoreError } from "../firebase";

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
  products: any[];
  myProducts: any[];
  getProducts: (tag?: string) => void;
  getMyProducts: () => void;
  getProduct: (id: string) => Promise<any>;
  createProduct: (data: any) => Promise<string>;
  updateProduct: (id: string, data: any) => Promise<void>;
  boostProduct: (id: string, currentBoosts: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getMakerProfile: (uid: string) => Promise<any>;
  getMakerProducts: (uid: string) => Promise<any[]>;
  uploadFile: (file: File, path: string) => Promise<string>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      setIsAuthReady(true);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            name: user.displayName || "User",
            username: user.email?.split("@")[0] || "user",
            avatar_url: user.photoURL || "",
            bio: "",
            website: "",
            created_at: serverTimestamp(),
            role: "user",
          });
        }
      }
    });

    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();

    return () => unsubscribe();
  }, []);

  const getProducts = (tag?: string) => {
    const productsRef = collection(db, "products");
    let q = query(productsRef, where("status", "==", "published"));

    if (tag && tag !== "All") {
      q = query(productsRef, where("status", "==", "published"), where("tags", "array-contains", tag));
    }

    return onSnapshot(q, async (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const userIds = [...new Set(items.map((item: any) => item.user_id))];
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("__name__", "in", userIds));
      const usersSnapshot = await getDocs(usersQuery);
      const usersMap = new Map(usersSnapshot.docs.map(doc => [doc.id, doc.data()]));

      const enriched = items.map((item: any) => {
        const userData = usersMap.get(item.user_id);
        return {
          ...item,
          maker_name: userData?.name || "Maker",
          maker_avatar: userData?.avatar_url || "",
          maker_username: userData?.username || "",
        };
      });
      const sorted = enriched.sort((a: any, b: any) => {
        const dateA = a.created_at?.seconds || 0;
        const dateB = b.created_at?.seconds || 0;
        return dateB - dateA;
      });
      setProducts(sorted);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "products");
    });
  };

  const getMyProducts = () => {
    if (!user) return;
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("user_id", "==", user.uid));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in client
      const sorted = items.sort((a: any, b: any) => {
        const dateA = a.created_at?.seconds || 0;
        const dateB = b.created_at?.seconds || 0;
        return dateB - dateA;
      });
      setMyProducts(sorted);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "products");
    });
  };

  const getProduct = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `products/${id}`);
    }
  };

  const createProduct = async (data: any) => {
    if (!user) throw new Error("User not authenticated");
    try {
      const productsRef = collection(db, "products");
      const docData = {
        ...data,
        user_id: user.uid,
        boost_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };
      const docRef = await addDoc(productsRef, docData);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "products");
      return "";
    }
  };

  const updateProduct = async (id: string, data: any) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const boostProduct = async (id: string, currentBoosts: number) => {
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        boost_count: currentBoosts + 1,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  const getMakerProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  };

  const getMakerProducts = async (uid: string) => {
    try {
      const q = query(
        collection(db, "products"),
        where("user_id", "==", uid),
        where("status", "==", "published")
      );
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in client
      return items.sort((a: any, b: any) => {
        const dateA = a.created_at?.seconds || 0;
        const dateB = b.created_at?.seconds || 0;
        return dateB - dateA;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, "products");
      return [];
    }
  };

  const uploadFile = (file: File, path: string): Promise<string> => {
    console.log(`Starting upload for ${file.name} to ${path}`);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Upload timed out after 60 seconds. This may be due to a slow connection or Firebase Storage configuration."));
      }, 60000);

      try {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress for ${file.name}: ${progress.toFixed(2)}%`);
          },
          (error) => {
            clearTimeout(timeout);
            console.error("Upload task failed:", error);
            reject(error);
          },
          () => {
            clearTimeout(timeout);
            console.log(`Upload task completed for ${file.name}, getting download URL...`);
            getDownloadURL(uploadTask.snapshot.ref)
              .then((downloadURL) => {
                console.log(`Download URL obtained: ${downloadURL}`);
                resolve(downloadURL);
              })
              .catch((error) => {
                console.error("Error getting download URL:", error);
                reject(error);
              });
          }
        );
      } catch (error) {
        clearTimeout(timeout);
        console.error("Error initializing upload task:", error);
        reject(error);
      }
    });
  };

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      loading, 
      isAuthReady, 
      products, 
      myProducts, 
      getProducts, 
      getMyProducts, 
      getProduct, 
      createProduct, 
      updateProduct,
      boostProduct,
      deleteProduct,
      getMakerProfile,
      getMakerProducts,
      uploadFile
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
