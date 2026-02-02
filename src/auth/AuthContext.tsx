import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_TIMEOUT = 14 * 60 * 1000; // 14 minutes (show warning 1 minute before)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);

  const signOutUser = async () => {
    if (!firebaseAuth) return;
    try {
      await signOut(firebaseAuth);
      setUser(null);
      // Clear timers on logout
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const resetTimers = () => {
    if (!user) return;

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      toast({
        title: "Inactivity Warning",
        description: "You will be logged out in 1 minute due to inactivity.",
        variant: "default",
      });
    }, WARNING_TIMEOUT);

    // Set logout timer
    inactivityTimerRef.current = setTimeout(() => {
      signOutUser();
      toast({
        title: "Logged Out",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (!firebaseAuth) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
      setIsLoading(false);
      if (u) {
        resetTimers();
      } else {
        // Clear timers if user is not logged in
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      }
    });

    return unsubscribe;
  }, []);

  // Set up event listeners for activity tracking
  useEffect(() => {
    if (!user) return;

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    const handleActivity = () => resetTimers();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signInWithGoogle: async () => {
        if (!firebaseAuth || !googleAuthProvider) {
          throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars.");
        }
        await signInWithPopup(firebaseAuth, googleAuthProvider);
      },
      signInWithEmail: async (email: string, password: string) => {
        if (!firebaseAuth) {
          throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars.");
        }
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      },
      resetPassword: async (email: string) => {
        if (!firebaseAuth) {
          throw new Error("Firebase is not configured. Set VITE_FIREBASE_* env vars.");
        }
        await sendPasswordResetEmail(firebaseAuth, email);
      },
      signOutUser,
      getIdToken: async () => {
        if (!firebaseAuth?.currentUser) return null;
        return firebaseAuth.currentUser.getIdToken();
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
