import { useEffect, useState } from "react"
import api from "../api/api"
import Navbar from "../components/Navbar"

interface ProfileData {
    id: number
    bio: string
    age: number
    gender: string
    location: string
    interests: string
    photoUrl: string
    user: {
        name: string
        email: string
    }
}

function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState<File | null>(null)
    const [photoPreview, setPhotoPreview] = useState<string>("")

    // Edit form state
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [bio, setBio] = useState("")
    const [location, setLocation] = useState("")
    const [interests, setInterests] = useState("")

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const res = await api.get("/profile")
            setProfile(res.data)

            // Populate edit form
            setAge(res.data.age?.toString() || "")
            setGender(res.data.gender || "")
            setBio(res.data.bio || "")
            setLocation(res.data.location || "")
            setInterests(res.data.interests || "")

            // Set photo preview with full URL
            setPhotoPreview(res.data.photoUrl)
        } catch (err) {
            console.error(err)
        }
    }


    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPhoto(file)
            setPhotoPreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // 1. Update profile data
            await api.put("/profile", {
                age: parseInt(age),
                gender,
                bio,
                location,
                interests
            })

            // 2. Upload new photo if selected
            if (photo) {
                const formData = new FormData()
                formData.append("file", photo)
                await api.post("/profile/photo", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                })
            }

            setIsEditing(false)
            fetchProfile()
        } catch (err) {
            console.error(err)
            alert("Failed to save profile")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        if (profile) {
            setAge(profile.age?.toString() || "")
            setGender(profile.gender || "")
            setBio(profile.bio || "")
            setLocation(profile.location || "")
            setInterests(profile.interests || "")
            setPhotoPreview(profile.photoUrl)
            setPhoto(null)
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
                <h2>My Profile</h2>

                <div style={styles.photoSection}>
                    <div style={styles.avatar}>
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile" style={styles.avatarImg} />
                        ) : (
                            <span style={styles.avatarText}>{profile.user.name?.charAt(0).toUpperCase()}</span>
                        )}
                    </div>
                    {isEditing && (
                        <label style={styles.uploadBtn}>
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                style={{ display: "none" }}
                            />
                        </label>
                    )}
                </div>

                <div style={styles.infoSection}>
                    <h3 style={styles.name}>{profile.user.name}</h3>
                    <p style={styles.email}>{profile.user.email}</p>
                </div>

                {isEditing ? (
                    <div style={styles.form}>
                        <div style={styles.field}>
                            <label>Age</label>
                            <input
                                type="number"
                                min="18"
                                value={age}
                                onChange={e => setAge(e.target.value)}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Gender</label>
                            <select value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="">Select</option>
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
                                rows={3}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Interests</label>
                            <input
                                type="text"
                                value={interests}
                                onChange={e => setInterests(e.target.value)}
                            />
                        </div>

                        <div style={styles.buttonRow}>
                            <button
                                onClick={handleCancel}
                                style={styles.cancelBtn}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#bbb"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#ccc"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                style={styles.saveBtn}
                                disabled={loading}
                                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0066cc")}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.viewSection}>
                        <div style={styles.detail}>
                            <strong>Age:</strong> {profile.age}
                        </div>
                        <div style={styles.detail}>
                            <strong>Gender:</strong> {profile.gender}
                        </div>
                        <div style={styles.detail}>
                            <strong>Bio:</strong> {profile.bio || "Not set"}
                        </div>
                        <div style={styles.detail}>
                            <strong>Location:</strong> {profile.location || "Not set"}
                        </div>
                        <div style={styles.detail}>
                            <strong>Interests:</strong> {profile.interests || "Not set"}
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            style={styles.editBtn}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0066cc"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0084ff"}
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f5f5f5" },
    content: { maxWidth: "500px", margin: "0 auto", padding: "20px" },
    photoSection: { display: "flex", flexDirection: "column" as const, alignItems: "center", marginBottom: "20px" },
    avatar: { width: "120px", height: "120px", borderRadius: "60px", backgroundColor: "#0084ff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "10px" },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" as const },
    avatarText: { fontSize: "3rem", color: "white" },
    uploadBtn: { padding: "8px 16px", backgroundColor: "#666", color: "white", borderRadius: "20px", cursor: "pointer", fontSize: "0.9rem" },
    infoSection: { textAlign: "center" as const, marginBottom: "20px" },
    name: { margin: 0, fontSize: "1.5rem" },
    email: { margin: "5px 0 0", color: "#666" },
    form: { display: "flex", flexDirection: "column" as const, gap: "16px" },
    field: { display: "flex", flexDirection: "column" as const, gap: "6px" },
    viewSection: { backgroundColor: "white", padding: "20px", borderRadius: "12px" },
    detail: { padding: "10px 0", borderBottom: "1px solid #eee" },
    buttonRow: { display: "flex", gap: "10px", marginTop: "10px" },
    cancelBtn: { flex: 1, padding: "12px", backgroundColor: "#ccc", border: "none", borderRadius: "8px", cursor: "pointer" },
    saveBtn: { flex: 1, padding: "12px", backgroundColor: "#0084ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" },
    editBtn: { width: "100%", padding: "12px", backgroundColor: "#0084ff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "20px" }
}

export default Profile
