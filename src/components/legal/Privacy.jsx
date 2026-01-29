export default function Privacy() {
    return (
        <div
            style={{
                paddingTop: 155,            // 👈 espacio para el Navbar
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
                    Política de Privacidad
                </h1>

                <p style={pStyle}>
                    Esta aplicación utiliza WhatsApp Cloud API para recibir y responder
                    mensajes de los usuarios.
                </p>

                <p style={pStyle}>
                    Se recopila el número de teléfono y el contenido del mensaje únicamente
                    para fines de atención automatizada o atención humana cuando
                    corresponda.
                </p>

                <p style={pStyle}>
                    Los datos no se venden, ceden ni comparten con terceros y se utilizan
                    solo para prestar el servicio solicitado.
                </p>

                <hr style={{ margin: "28px 0", borderColor: "#e5e7eb" }} />

                <p
                    style={{
                        fontSize: 14,
                        color: "#374151",
                        fontWeight: 600,
                    }}
                >
                    Contacto
                </p>

                <p style={{ fontSize: 14, color: "#2563eb" }}>
                    plataformas.web.cl@gmail.com
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
