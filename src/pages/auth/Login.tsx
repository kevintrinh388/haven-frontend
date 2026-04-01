import { useState } from "react"
import api from "../../api/api"
import { useNavigate } from "react-router-dom"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleLogin = async () => {

        try {

            const res = await api.post("/auth/login", {
                email,
                password
            })

            const token = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("userEmail", email)

            // Check profile status
            const profileRes = await api.get("/profile/status")

            if (!profileRes.data.completed) {
                navigate("/profile-setup")
            } else {
                navigate("/discover")
            }

        } catch (err) {
            console.error(err)
            alert("Login failed")
        }

    }

    return (

        <div>

            <h2>Login</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Login
            </button>

        </div>

    )

}

export default Login