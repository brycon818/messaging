import { FormEvent, useRef } from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useAuth } from "../context/AuthContext"

export function Signup() {
  const { signup } = useAuth()
  const usernameRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const imageUrlRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (signup.isLoading) return

    const username = usernameRef.current?.value
    const name = nameRef.current?.value
    const imageUrl = imageUrlRef.current?.value
    if (username == null || username === "" || name == null || name === "") {
      return
    }

    signup.mutate({ id: username, name, image: imageUrl })
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">Logged Out</h1>
      
    </>
  )
}
