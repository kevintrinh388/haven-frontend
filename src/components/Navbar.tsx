import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Custom NavLink component with hover effect
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const navigate = useNavigate()
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            onClick={() => navigate(to)}
            style={{
                textDecoration: "none",
                color: isHovered ? "#0084ff" : "#333",
                fontWeight: 500,
                padding: "8px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: isHovered ? "#f0f0f0" : "transparent",
                transition: "background-color 0.2s, color 0.2s",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </div>
    )
}

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.logo}>Haven</div>

            <div style={styles.links}>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/matches">Matches</NavLink>
                <NavLink to="/profile">Profile</NavLink>

                <button onClick={handleLogout} style={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </nav>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000
    },
    logo: {
        fontSize: "1.5rem",
        fontWeight: "bold"
    },
    links: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },
    logoutButton: {
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        backgroundColor: "#f5f5f5",
        color: "#333",
        transition: "background-color 0.2s",
    }
}

export default Navbar