interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large"
    color?: string
}

const LoadingSpinner = ({ size = "medium", color = "#0084ff" }: LoadingSpinnerProps) => {
    const sizeValue = size === "small" ? 20 : size === "large" ? 50 : 30

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px"
        }}>
            <div style={{
                width: sizeValue,
                height: sizeValue,
                border: `3px solid #f3f3f3`,
                borderTop: `3px solid ${color}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }} />
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default LoadingSpinner