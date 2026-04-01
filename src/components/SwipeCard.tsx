import { motion, type PanInfo } from "framer-motion"
import type { Profile } from "../types/Profile"
import { useState } from "react"

interface Props {
    profile: Profile
    onSwipe: (direction: "left" | "right") => void
    draggable?: boolean
    zIndex?: number
}

const SwipeCard = ({ profile, onSwipe, draggable, zIndex }: Props) => {
    const [isExiting, setIsExiting] = useState(false)
    const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe("right")
            setIsExiting(true)
        } else if (info.offset.x < -100) {
            onSwipe("left")
            setIsExiting(true)
        }
        setDragDirection(null)
    }

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 30) {
            setDragDirection("right")
        } else if (info.offset.x < -30) {
            setDragDirection("left")
        } else {
            setDragDirection(null)
        }
    }

    return (
        <motion.div
            drag={draggable ? "x" : false}
            dragElastic={0.9}
            dragConstraints={{ left: -300, right: 300 }}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            whileTap={{ scale: 1.05 }}
            style={{
                ...styles.card,
                zIndex: zIndex,
                touchAction: "none",
                pointerEvents: draggable ? "auto" : "none",
                userSelect: "none",
            }}
            animate={isExiting ? {
                x: dragDirection === "right" ? 500 : -500
            } : { x: 0 }}
        >
            {/* Photo or Placeholder */}
            {profile.photoUrl ? (
                <img
                    src={profile.photoUrl}
                    style={styles.photo}
                    alt={profile.user.name}
                />
            ) : (
                <div style={styles.placeholder}>
                    {profile.user.name.charAt(0).toUpperCase()}
                </div>
            )}

            {/* LIKE Badge */}
            {dragDirection === "right" && (
                <div style={styles.likeBadge}>LIKE</div>
            )}

            {/* PASS Badge */}
            {dragDirection === "left" && (
                <div style={styles.passBadge}>PASS</div>
            )}

            {/* Info Overlay */}
            <div style={styles.overlay}>
                <h2 style={styles.name}>
                    {profile.user.name}, {profile.age}
                </h2>
                {profile.bio && (
                    <p style={styles.bio}>
                        {profile.bio.length > 50
                            ? profile.bio.substring(0, 50) + "..."
                            : profile.bio}
                    </p>
                )}
            </div>
        </motion.div>
    )
}

const styles = {
    card: {
        position: "absolute" as const,
        width: 350,
        height: 500,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "#333",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    },
    photo: {
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        pointerEvents: "none" as const,
    },
    placeholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#0084ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "5rem",
        color: "white",
    },
    overlay: {
        position: "absolute" as const,
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
        color: "white",
        textAlign: "left" as const,
        pointerEvents: "none" as const,
    },
    name: {
        margin: 0,
        fontSize: "1.8rem",
        fontWeight: "bold" as const,
    },
    bio: {
        margin: "5px 0 0",
        fontSize: "0.95rem",
        opacity: 0.9,
    },
    passBadge: {
        position: "absolute" as const,
        top: 40,
        left: 20,
        padding: "10px 20px",
        border: "4px solid #FF5252",
        borderRadius: 8,
        color: "#FF5252",
        fontSize: "2rem",
        fontWeight: "bold" as const,
        transform: "rotate(-15deg)",
    },
    likeBadge: {
        position: "absolute" as const,
        top: 40,
        right: 20,
        padding: "10px 20px",
        border: "4px solid #4CAF50",
        borderRadius: 8,
        color: "#4CAF50",
        fontSize: "2rem",
        fontWeight: "bold" as const,
        transform: "rotate(15deg)",
    },
}

export default SwipeCard