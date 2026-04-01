import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import Navbar from "../components/Navbar"

function ProfileSetup() {
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")
    const [interests, setInterests] = useState("")
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhoto(file)
            setPhotoPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        if (!age || !gender) {
            alert("Age and gender are required")
            return
        }

        setLoading(true)
        try {
            // 1. Save profile data first
            await api.put("/profile", {
                age: parseInt(age),
                gender,
                bio,
                location,
                interests
            })

            // 2. Upload photo if selected
            if (photo) {
                const formData = new FormData()
                formData.append("file", photo)
                await api.post("/profile/photo", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
                // Fetch updated profile to get the photo URL with full path
                const profileRes = await api.get("/profile")
                const newPhotoUrl = profileRes.data.photoUrl
                setPhotoPreview(newPhotoUrl)
            }

            navigate("/discover")
        } catch (err) {
            console.error(err)
            alert("Failed to save profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                <h2>Complete Your Profile</h2>
                <p style={styles.subtitle}>Add a photo and details to start matching</p>

                <div style={styles.photoSection}>
                    <div style={styles.avatar}>
                        {photoPreview ? (
                            <img src={photoPreview} alt="Preview" style={styles.avatarImg} />
                        ) : (
                            <span style={styles.avatarText}>+</span>
                        )}
                    </div>
                    <label style={styles.uploadBtn}>
                        {photo ? "Change Photo" : "Add Photo"}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                        />
                    </label>
                    <p style={styles.photoHint}>Optional</p>
                </div>

                <div style={styles.form}>
                    <div style={styles.field}>
                        <label>Age *</label>
                        <input
                            type="number"
                            min="18"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            placeholder="18"
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Gender *</label>
                        <select value={gender} onChange={e => setGender(e.target.value)}>
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label>Bio</label>
                        <textarea
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={3}
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="City, Country"
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Interests</label>
                        <input
                            type="text"
                            value={interests}
                            onChange={e => setInterests(e.target.value)}
                            placeholder="Hobbies, sports, music..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        style={styles.button}
                        disabled={loading}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0066cc")}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                    >
                        {loading ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
    content: { maxWidth: "500px", margin: "0 auto", padding: "20px" },
    subtitle: { color: "#666", marginBottom: "20px" },
    photoSection: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: "30px" },
    avatar: { width: "120px", height: "120px", borderRadius: "60px", backgroundColor: "#ddd", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" as const },
    avatarText: { fontSize: "3rem", color: "#999" },
    uploadBtn: { padding: "8px 16px", backgroundColor: "#0084ff", color: "white", borderRadius: "20px", cursor: "pointer", fontSize: "0.9rem" },
    photoHint: { fontSize: "0.8rem", color: "#999", marginTop: "5px" },
    form: { display: "flex", flexDirection: "column" as const, gap: "16px" },
    field: { display: "flex", flexDirection: "column" as const, gap: "6px" },
    button: { padding: "14px", backgroundColor: "#0084ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", marginTop: "10px" }
}

export default ProfileSetup
