import { useEffect, useRef, useState } from "react"
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
    const [filters, setFilters] = useState({ gender: "", minAge: "", maxAge: "" })
    const [initialized, setInitialized] = useState(false)
    const isFirstLoad = useRef(true)
    const navigate = useNavigate()

    const loadProfiles = async (pageNum: number) => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.set("page", pageNum.toString())
            params.set("size", "20")
            if (filters.gender) params.set("gender", filters.gender)
            if (filters.minAge) params.set("minAge", filters.minAge)
            if (filters.maxAge) params.set("maxAge", filters.maxAge)

            const res = await api.get(`/discover?${params}`)
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
            try {
                const res = await api.get("/preferences")
                const prefs = res.data
                setFilters({
                    gender: prefs.preferredGender || "",
                    minAge: prefs.minAge?.toString() || "",
                    maxAge: prefs.maxAge?.toString() || "",
                })
            } catch (err) {
                console.error("Failed to load preferences:", err)
            }
            setInitialized(true)
        }
        init()
    }, [])

    useEffect(() => {
        if (!initialized) return

        if (isFirstLoad.current) {
            isFirstLoad.current = false
            loadProfiles(0)
            return
        }

        const saveAndReload = async () => {
            setProfiles([])
            setHasMore(true)
            try {
                await api.put("/preferences", {
                    preferredGender: filters.gender || null,
                    minAge: filters.minAge ? parseInt(filters.minAge) : null,
                    maxAge: filters.maxAge ? parseInt(filters.maxAge) : null,
                })
            } catch (err) {
                console.error("Failed to save preferences:", err)
            }
            loadProfiles(0)
        }
        saveAndReload()
    }, [initialized, filters.gender, filters.minAge, filters.maxAge])

    useEffect(() => {
        const checkProfile = async () => {
            try {
                const res = await api.get("/profile/status")
                if (!res.data.completed) {
                    navigate("/profile-setup")
                }
            } catch (err) {
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

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <>
            <Navbar />
            <div style={{
                position: "relative",
                width: 350,
                margin: "auto",
                touchAction: "none",
            }}>
                <div style={styles.filterBar}>
                    <select
                        value={filters.gender}
                        onChange={(e) => handleFilterChange("gender", e.target.value)}
                        style={styles.filterSelect}
                    >
                        <option value="">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Min age"
                        min={18}
                        value={filters.minAge}
                        onChange={(e) => handleFilterChange("minAge", e.target.value)}
                        style={styles.filterInput}
                    />
                    <input
                        type="number"
                        placeholder="Max age"
                        min={18}
                        value={filters.maxAge}
                        onChange={(e) => handleFilterChange("maxAge", e.target.value)}
                        style={styles.filterInput}
                    />
                </div>
                <div style={{
                    position: "relative",
                    width: 350,
                    height: 500,
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
            </div>
        </>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    filterBar: {
        display: "flex",
        gap: 8,
        marginBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    filterSelect: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "0.9rem",
        backgroundColor: "white",
        cursor: "pointer",
    },
    filterInput: {
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "0.9rem",
        width: 80,
    },
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
