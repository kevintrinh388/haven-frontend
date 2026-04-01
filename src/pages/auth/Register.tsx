import { useState } from "react"
import api from "../../api/api"
import { useNavigate } from "react-router-dom"

function Register() {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleRegister = async () => {

        try {

            await api.post("/auth/register", {
                email,
                name,
                password
            })

            navigate("/login")

        } catch (err) {
            console.error(err)
            alert("Registration failed")
        }

    }

    return (

        <div>

            <h2>Register</h2>

            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button onClick={handleRegister}>
                Register
            </button>

        </div>

    )

}

export default Register