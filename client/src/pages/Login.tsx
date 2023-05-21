import { FormEvent, useRef } from "react"
import { Navigate } from "react-router-dom"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useAuth,useLoggedInAuth } from "../context/AuthContext"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

export function Login() {
  const { login, user } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)
  const isAuthenticated = useRef(false);
 

  const urlParams = new URLSearchParams(window.location.search)
  const username = urlParams.get('username')
  
  useEffect(() => {
    if (username && !isAuthenticated.current) {
      isAuthenticated.current = true;
      login.mutate(username);
    }
  }, [username, login]);
  
  if (user != null) return <Navigate to="/" />
  

  function handleSubmit(e: FormEvent): void {
    e.preventDefault()
    if (login.isLoading) return
    
    const username = usernameRef.current?.value
    
    if (username == null || username === "") {
      return
    }

    login.mutate(username)
  }


  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-5 items-center justify-items-end"
      >
        <label htmlFor="userName">Username</label>
        <Input id="userName" required ref={usernameRef} />
        <Button
          disabled={login.isLoading}
          type="submit"
          className="col-span-full"
        >
          {login.isLoading ? "Loading.." : "Log In"}
        </Button>
      </form>
    </>
  )
}
