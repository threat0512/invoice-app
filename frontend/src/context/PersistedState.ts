import { useState } from "react"

/**
 * wrapper around react useState which saves the state to browser local storage
 * @param defaultVal T: value you want to store. NOTE it must be JSONable
 * @param storageName string: name of item in storage 
 * @returns 
 */
export function usePersistedState<T>(defaultVal: T, storageName: string): [T, (newStateVal: T) => void] {
  // get value if already there
  const localVal = localStorage.getItem(storageName)
  const val = localVal ? JSON.parse(localVal) as T : defaultVal
  const [state, setState] = useState(val)

  const setStateVal = (newStateVal: T) => {
    setState(newStateVal)
    localStorage.setItem(storageName, JSON.stringify(newStateVal))
  }

  return [state, setStateVal]
}