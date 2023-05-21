
import { useAuth,useLoggedInAuth } from "../context/AuthContext"
import {
  useEffect,
} from "react"



export function LogoutPage() {
  
  const { logout} = useLoggedInAuth()
  const { login, user } = useAuth()
  useEffect(() => {
    logout.mutate ()
  }, []);
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Logged Out</h1>
    
    </>
  )
}
