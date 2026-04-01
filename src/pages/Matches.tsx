import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import type { User } from "../types/User"
import Navbar from "../components/Navbar"
import LoadingSpinner from "../components/LoadingSpinner"

interface Match {
    id: number
    user1: User
    user2: User
}

function Matches() {
    const [matches, setMatches] = useState<Match[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const currentUserEmail = localStorage.getItem("userEmail")

    useEffect(() => {
        api.get("/matches")
            .then((res) => {
                setMatches(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                console.error(err)
                setIsLoading(false)
            })
    }, [])

    const getPartnerId = (match: Match): number => {
        return match.user1.email === currentUserEmail
            ? match.user2.id
            : match.user1.id
    }

    const getPartnerName = (match: Match): string => {
        return match.user1.email === currentUserEmail
            ? match.user2.name
            : match.user1.name
    }

    const getPartnerEmail = (match: Match): string => {
        return match.user1.email === currentUserEmail
            ? match.user2.email
            : match.user1.email
    }

    const handleProfileClick = (userId: number) => {
        navigate(`/match-profile/${userId}`)
    }

    const handleChatClick = (matchId: number) => {
        navigate(`/chat/${matchId}`)
    }

    return (
        <div style={styles.container}>
            <Navbar />

            <div style={styles.content}>
                <h2 style={styles.title}>Your Matches</h2>

                {isLoading ? (
                    <LoadingSpinner size="large" />
                ) : matches.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyTitle}>No matches yet</p>
                        <p style={styles.emptySubtitle}>Start swiping to find your match!</p>
                    </div>
                ) : (
                    <div style={styles.matchesGrid}>
                        {matches.map((match) => {
                            const partnerId = getPartnerId(match)

                            return (
                                <div
                                    key={match.id}
                                    style={styles.matchCard}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)"
                                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)"
                                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)"
                                    }}
                                >
                                    <div
                                        onClick={() => handleProfileClick(partnerId)}
                                        style={styles.clickableArea}
                                    >
                                        <div style={styles.avatar}>
                                            {getPartnerName(match).charAt(0).toUpperCase()}
                                        </div>
                                        <div style={styles.matchInfo}>
                                            <h3 style={styles.matchName}>
                                                {getPartnerName(match)}
                                            </h3>
                                            <p style={styles.matchEmail}>
                                                {getPartnerEmail(match)}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => handleChatClick(match.id)}
                                        style={styles.chatIcon}
                                    >
                                        💬
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
    },
    content: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
    },
    title: {
        marginBottom: "20px",
    },
    emptyContainer: {
        textAlign: "center",
        padding: "40px 20px",
    },
    emptyTitle: {
        fontSize: "1.2rem",
        color: "#333",
        margin: "0 0 8px 0",
    },
    emptySubtitle: {
        color: "#666",
        margin: 0,
    },
    matchesGrid: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    matchCard: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    clickableArea: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flex: 1,
        cursor: "pointer",
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        backgroundColor: "#0084ff",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    matchInfo: {
        flex: 1,
    },
    matchName: {
        margin: 0,
        fontSize: "1.1rem",
    },
    matchEmail: {
        margin: "4px 0 0",
        fontSize: "0.85rem",
        color: "#666",
    },
    chatIcon: {
        fontSize: "1.5rem",
        cursor: "pointer",
        padding: "8px",
    },
}

export default Matches