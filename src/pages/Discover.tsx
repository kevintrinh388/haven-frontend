import { useEffect, useState } from "react"
import api from "../api/api"
import type { Profile } from "../types/Profile"
import SwipeCard from "../components/SwipeCard"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"

const Discover = () => {

    const [profiles, setProfiles] = useState<Profile[]>([])
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()


    const loadProfiles = async (pageNum: number) => {
        setLoading(true)
        try {
            const res = await api.get(`/discover?page=${pageNum}&size=20`)
            if (res.data.length === 0) {
                setHasMore(false)
            } else {
                setProfiles(prev => pageNum === 0 ? res.data : [...prev, ...res.data])
                setPage(pageNum)
            }
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    useEffect(() => {
        const init = async () => {
            await loadProfiles(0)
        }
        init()
    }, [])

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const res = await api.get("/profile/status")
                if (!res.data.completed) {
                    navigate("/profile-setup")
                }
            } catch (err) {
                // If error, redirect to profile setup
                console.error("Profile check failed:", err)
                navigate("/profile-setup")
            }
        }
        checkProfile()
    }, [navigate])

    const handleSwipe = async (direction: "left" | "right") => {
        if (profiles.length === 0) return

        const profile = profiles[0]
        const liked = direction === "right"

        try {
            await api.post("/swipe", {
                swipedUserId: profile.user.id,
                liked
            })
        } catch (err) {
            console.error("Swipe failed:", err)
        }

        setProfiles(prev => {
            const newProfiles = prev.slice(1)

            if (newProfiles.length < 5 && hasMore && !loading) {
                loadProfiles(page + 1)
            }

            return newProfiles
        })
    }

    return (
        <>
            <Navbar />
            <div style={{
                position: "relative",
                width: 350,
                height: 500,
                margin: "auto",
                touchAction: "none",
            }}>
                {loading && profiles.length === 0 && <LoadingSpinner size="large" />}

                {profiles.length === 0 && !loading && (
                    <div style={styles.emptyContainer}>
                        <div style={styles.emptyIcon}>🔍</div>
                        <h3 style={styles.emptyTitle}>No more profiles</h3>
                        <p style={styles.emptyText}>Check back later for new matches!</p>
                        <button
                            onClick={() => {
                                setHasMore(true)
                                loadProfiles(0)
                            }}
                            style={styles.refreshButton}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0066cc"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                        >
                            Refresh
                        </button>
                    </div>
                )}

                {profiles.map((profile, i) => {
                    const isTop = i === 0

                    return (
                        <SwipeCard
                            key={profile.id}
                            profile={profile}
                            onSwipe={isTop ? handleSwipe : () => { }}
                            draggable={isTop}
                            zIndex={100 - i}
                        />
                    )
                })}
            </div>
        </>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    emptyContainer: {
        textAlign: "center",
        padding: "40px 20px",
    },
    emptyIcon: {
        fontSize: "3rem",
        marginBottom: "10px",
    },
    emptyTitle: {
        margin: "0 0 8px 0",
        color: "#333",
    },
    emptyText: {
        color: "#666",
        margin: "0 0 20px 0",
    },
    refreshButton: {
        padding: "12px 24px",
        backgroundColor: "#0084ff",
        color: "white",
        border: "none",
        borderRadius: "25px",
        cursor: "pointer",
        fontSize: "1rem",
    },
}

export default Discover
