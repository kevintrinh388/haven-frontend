import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import api from "../../api/api"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [touched, setTouched] = useState({ email: false, password: false })
    const navigate = useNavigate()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const emailError = touched.email && !email.trim()
    const emailFormatError = touched.email && email.trim() && !emailRegex.test(email)
    const passwordError = touched.password && !password.trim()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ email: true, password: true })

        if (!email.trim() || !password.trim() || !emailRegex.test(email)) return

        setLoading(true)
        setError("")

        try {
            const res = await api.post("/auth/login", { email, password })
            const token = res.data
            localStorage.setItem("token", token)
            localStorage.setItem("userEmail", email)

            const profileRes = await api.get("/profile/status")
            navigate(profileRes.data.completed ? "/discover" : "/profile-setup")
        } catch (err: unknown) {
            const data = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
            const message = typeof data === "string" ? data : (data?.message as string) || (data?.error as string) || "Invalid email or password"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.wrapper}>
            <motion.div
                style={styles.card}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div style={styles.logoSection}>
                    <div style={styles.logoIcon}>H</div>
                    <h1 style={styles.logoText}>Haven</h1>
                </div>

                <form onSubmit={handleSubmit} style={styles.form} noValidate>
                    {error && <div style={styles.errorBanner}>{error}</div>}

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                            style={{
                                ...styles.input,
                                borderColor: emailError || emailFormatError ? "#dc2626" : "var(--border)",
                            }}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                                style={{
                                    ...styles.input,
                                    ...styles.inputWithToggle,
                                    borderColor: passwordError ? "#dc2626" : "var(--border)",
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                style={styles.toggleButton}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? (
                            <span style={styles.buttonContent}>
                                <span style={styles.spinner} />
                                Signing in...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.link}>Sign up</Link>
                </p>
            </motion.div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    wrapper: {
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
    },
    card: {
        width: "100%",
        maxWidth: 400,
        background: "var(--bg)",
        borderRadius: 16,
        padding: "40px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid var(--border)",
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        marginBottom: 32,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: "var(--accent)",
        color: "#fff",
        fontSize: 20,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    logoText: {
        fontSize: 28,
        fontWeight: 700,
        color: "var(--text-h)",
        margin: 0,
        letterSpacing: "-0.5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
        color: "var(--text-h)",
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        fontSize: 15,
        border: "1.5px solid var(--border)",
        borderRadius: 10,
        outline: "none",
        background: "var(--bg)",
        color: "var(--text-h)",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputWithToggle: {
        paddingRight: 44,
    },
    toggleButton: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text)",
        display: "flex",
        padding: 4,
    },
    submitButton: {
        width: "100%",
        padding: "12px 0",
        fontSize: 16,
        fontWeight: 600,
        color: "#fff",
        background: "var(--accent)",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        transition: "opacity 0.2s",
        marginTop: 4,
    },
    buttonContent: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    spinner: {
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
    },
    errorBanner: {
        background: "#fef2f2",
        color: "#dc2626",
        fontSize: 14,
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #fecaca",
    },
    footerText: {
        textAlign: "center",
        marginTop: 24,
        fontSize: 14,
        color: "var(--text)",
    },
    link: {
        color: "var(--accent)",
        fontWeight: 600,
        textDecoration: "none",
    },
}

export default Login
