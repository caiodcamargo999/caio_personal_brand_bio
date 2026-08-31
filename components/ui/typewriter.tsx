"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
  words?: string[]
  speed?: number
  delayBetweenWords?: number
  cursor?: boolean
  cursorChar?: string
  className?: string
  loop?: boolean
}

export function Typewriter({
  words = [],
  speed = 100,
  delayBetweenWords = 4000,
  cursor = true,
  cursorChar = "|",
  className = "",
  loop = true,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [isFinished, setIsFinished] = useState(false)

  const currentWord = words[wordIndex] || ""

  useEffect(() => {
    if (!currentWord || isFinished) return
    const timeout = setTimeout(
      () => {
        // Typing logic
        if (!isDeleting) {
          if (charIndex < currentWord.length) {
            setDisplayText(currentWord.substring(0, charIndex + 1))
            setCharIndex(charIndex + 1)
          } else {
            // Word is complete, wait before deleting
            if (!loop || words.length === 1) {
              setIsFinished(true)
              setTimeout(() => setShowCursor(false), 3000)
              return
            }
            setTimeout(() => {
              setIsDeleting(true)
            }, delayBetweenWords)
          }
        } else {
          // Deleting logic
          if (charIndex > 0) {
            setDisplayText(currentWord.substring(0, charIndex - 1))
            setCharIndex(charIndex - 1)
          } else {
            // Word is deleted, move to next word
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
          }
        }
      },
      isDeleting ? speed / 2 : speed
    )

    return () => clearTimeout(timeout)
  }, [
    charIndex,
    currentWord,
    isDeleting,
    speed,
    delayBetweenWords,
    wordIndex,
    words,
    loop,
    isFinished
  ])

  // Cursor blinking effect
  useEffect(() => {
    if (!cursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [cursor])

  return (
    <div className="inline-block align-middle">
      <span className={className}>
        {displayText}
        {cursor && (
          <span
            className="ml-1 transition-opacity duration-75"
            style={{ opacity: showCursor ? 1 : 0 }}
          >
            {cursorChar}
          </span>
        )}
      </span>
    </div>
  )
}
