import { useContext } from "react"
import { AuthContext } from "../auth.context"
import {
  login,
  register,
  logout,
  getMe
} from "../services/auth.api"

const useAuth = () => {
  const context = useContext(AuthContext)

  const {
    user,
    setUser,
    loading,
    setLoading
  } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)

    try {
      const data = await login({
        email,
        password
      })

      setUser(data.user)

      return true
    } catch (err) {
      console.log(
        err.response?.data || err.message
      )

      setUser(null)

      return false
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async ({
    username,
    email,
    password
  }) => {
    setLoading(true)

    try {
      const data = await register({
        username,
        email,
        password
      })

      setUser(data.user)

      return true
    } catch (err) {
      console.log(
        err.response?.data || err.message
      )

      setUser(null)

      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()

      setUser(null)
    } catch (err) {
      console.log(
        err.response?.data || err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    handleRegister,
    handleLogin,
    handleLogout
  }
}

export default useAuth