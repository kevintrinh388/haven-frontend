import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/api"
import Navbar from "../components/Navbar"
import type { Match } from "../types/Match"

interface Profile {
    id: number
    age: number
    gender: string
    bio: string
    location: string
    interests: string
    photoUrl: string
    user: {
        name: string
        email: string
    }
}

function MatchProfile() {
    const { userId } = useParams<{ userId: string }>()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [matchId, setMatchId] = useState<number | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!userId) return

        // Fetch the user's profile
        api.get(`/profile/user/${userId}`)
            .then(res => setProfile(res.data))
            .catch(err => console.error(err))

        // Also fetch matches to find the matchId for this user
        api.get("/matches")
            .then(res => {
                const currentUserEmail = localStorage.getItem("userEmail")
                const match = res.data.find((m: Match) => // TODO?: Any
                    m.user1.email === currentUserEmail && m.user2.id === parseInt(userId) ||
                    m.user2.email === currentUserEmail && m.user1.id === parseInt(userId)
                )
                if (match) setMatchId(match.id)
            })
            .catch(err => console.error(err))
    }, [userId])

    const handleChatClick = () => {
        if (matchId) {
            navigate(`/chat/${matchId}`)
        }
    }

    if (!profile) {
        return (
            <div style={styles.container}>
                <Navbar />
                <div style={styles.content}>Loading...</div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <div style={styles.photoSection}>
                    {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt={profile.user.name} style={styles.photo} />
                    ) : (
                        <div style={styles.photoPlaceholder}>
                            {profile.user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <h2 style={styles.name}>{profile.user.name}</h2>
                <p style={styles.ageGender}>{profile.age} • {profile.gender}</p>

                {profile.location && (
                    <p style={styles.location}>📍 {profile.location}</p>
                )}

                {profile.bio && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>About</h3>
                        <p style={styles.bio}>{profile.bio}</p>
                    </div>
                )}

                {profile.interests && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Interests</h3>
                        <p style={styles.interests}>{profile.interests}</p>
                    </div>
                )}

                {matchId && (
                    <button
                        onClick={handleChatClick}
                        style={styles.chatBtn}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0066cc"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                    >
                        💬 Chat
                    </button>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
    content: { maxWidth: "500px", margin: "0 auto", padding: "20px", textAlign: "center" as const },
    photoSection: { marginBottom: "20px" },
    photo: { width: "200px", height: "200px", borderRadius: "100px", objectFit: "cover" as const },
    photoPlaceholder: { width: "200px", height: "200px", borderRadius: "100px", backgroundColor: "#0084ff", color: "white", fontSize: "4rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" },
    name: { margin: 0, fontSize: "2rem" },
    ageGender: { margin: "5px 0", color: "#666", fontSize: "1.1rem" },
    location: { color: "#666", margin: "10px 0" },
    section: { textAlign: "left" as const, marginTop: "20px", backgroundColor: "white", padding: "15px", borderRadius: "12px" },
    sectionTitle: { margin: "0 0 10px", fontSize: "1rem" },
    bio: { margin: 0, color: "#333" },
    interests: { margin: 0, color: "#333" },
    chatBtn: { marginTop: "30px", padding: "14px 30px", backgroundColor: "#0084ff", color: "white", border: "none", borderRadius: "25px", fontSize: "1.1rem", cursor: "pointer" }
}

export default MatchProfile