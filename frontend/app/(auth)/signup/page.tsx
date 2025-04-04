"use client"
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [type, setType] = useState<'Freelancer' | 'Client'>('Freelancer')
  const [error, setError] = useState<{message: string | null }>({ message: null })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password !== passwordConfirmation) {
      setError({ message: 'Passwords do not match' })
      return
    }
    try {
      console.log(name, email, password, type)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-500 to-sky-700"
    >
      <div className="text-5xl font-bold text-white mb-6">
        <span className="text-teal-400">B</span>angla
        <span className="text-teal-400">H</span>ire
      </div>

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">
          Sign up
        </h2>
        <div className="flex justify-center mb-4">
          {['Freelancer', 'Client'].map((option) => (
            <button
              key={option}
              onClick={() => setType(option as 'Freelancer' | 'Client')}
              className={`px-4 py-2 mx-2 font-semibold rounded-md shadow-sm cursor-pointer ${
                type === option ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="password-confirmation"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="password-confirmation"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40"
              required
            />
          </div>
          {error && (
            <p className="text-center text-sm text-red-600">{error.message}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            Sign up
          </button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?
            <Link href="/signin">
              <p className="text-blue-500 hover:underline">Sign in</p>
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

