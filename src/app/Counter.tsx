'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="mt-4 flex gap-4 items-center">
      <button
        className="py-1 px-4 rounded-md shadow-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-400"
        disabled={count === 0}
        onClick={_ => setCount(count-1)}
      >
        Decrement
      </button>
      <span className="text-center w-4">
        {count}
      </span>
      <button
        className="py-1 px-4 rounded-md shadow-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-400"
        disabled={count === 20}
        onClick={_ => setCount(count+1)}
      >
        Increment
      </button>
    </div>
  )
}