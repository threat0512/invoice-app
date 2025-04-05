/* eslint-disable @typescript-eslint/ban-types */
import { ReactElement, createContext } from "react";
import { UserProfile } from "../data";
import { usePersistedState } from "./PersistedState";
// import createPersistedState from 'use-persisted-state'

interface AuthContextT {
  currentUser: UserProfile | null,
  setCurrentUser: Function
}

export const AuthContext = createContext<AuthContextT>({
  currentUser: null,
  setCurrentUser: () => null
})


export default function AuthContextProvider({ children }: { children: ReactElement }) {
  const [currentUser, setCurrentUser] = usePersistedState<UserProfile | null>(null, 'currentUser')
  // console.log(currentUser);


  return (
    <AuthContext.Provider value={{
      currentUser: currentUser,
      setCurrentUser: setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
