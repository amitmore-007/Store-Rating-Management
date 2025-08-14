import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === null) {
        return false
      }
      // Handle both old string format and new JSON format
      if (savedTheme === 'dark') {
        return true
      }
      if (savedTheme === 'light') {
        return false
      }
      // Try to parse as JSON for new format
      return JSON.parse(savedTheme)
    } catch (error) {
      // If parsing fails, clear localStorage and default to light mode
      localStorage.removeItem('theme')
      return false
    }
  })

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
