export default function DataDeletion() {
    return (
        <div
            style={{
                paddingTop: 155,
                paddingBottom: 48,
                paddingLeft: 16,
                paddingRight: 16,
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    maxWidth: 820,
                    margin: "0 auto",
                    background: "#ffffff",
                    borderRadius: 12,
                    padding: "32px 28px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <h1
                    style={{
                        marginBottom: 20,
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Eliminación de Datos
                </h1>

                <p style={pStyle}>
                    Los usuarios pueden solicitar la eliminación de sus datos personales
                    asociados al uso de esta aplicación.
                </p>

                <p style={pStyle}>
                    Para solicitar la eliminación de tus datos, envía un correo electrónico
                    indicando tu número de teléfono.
                </p>

                <hr style={{ margin: "28px 0", borderColor: "#e5e7eb" }} />

                <p
                    style={{
                        fontSize: 14,
                        color: "#374151",
                        fontWeight: 600,
                    }}
                >
                    Correo de contacto
                </p>

                <p style={{ fontSize: 14, color: "#2563eb" }}>
                    plataformas.web.cl@gmail.com
                </p>

                <p
                    style={{
                        marginTop: 12,
                        fontSize: 14,
                        color: "#6b7280",
                    }}
                >
                    Las solicitudes serán procesadas en un plazo máximo de 30 días.
                </p>
            </div>
        </div>
    );
}

const pStyle = {
    fontSize: 16,
    lineHeight: 1.65,
    color: "#374151",
    marginBottom: 14,
};
