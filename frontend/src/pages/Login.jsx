import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login(){
    const [email, setEmail] = useState('')
    const [haslo, setHaslo] = useState('')
    const [blad, setBlad] = useState('')
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setBlad('')

        try {
            const params = new URLSearchParams()
            params.append('username', email)
            params.append('password', haslo)

            const response = await api.post('/auth/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            })

            localStorage.setItem('token', response.data.access_token)
            navigate('/roster')

        } catch (err) {
            console.log('Status:', err.response?.status)
            console.log('Dane błędu:', err.response?.data)
            setBlad('Nieprawidłowy email lub hasło')
        }
    }
    return(
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>WoWGuildApp</h1>
                <p style={styles.subtitle}>zaloguj się aby kontynuować</p>

                <form onSubmit={handleLogin}>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                        style={styles.input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="gracz@wow.pl"
                        required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Hasło</label>
                        <input
                        style={styles.input}
                        type="password"
                        value={haslo}
                        onChange={(e) => setHaslo(e.target.value)}
                        placeholder="••••••••"
                        required
                        />
                    </div>

                    {blad && <p style={styles.blad}>{blad}</p>}

                    <button style={styles.button} type="submit">
                        Zaloguj się
                    </button>
                </form>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a2e',
    },
    card: {
        backgroundColor: '#16213e',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #0f3460',
    },
    title: {
        color: '#e2b96f',
        textAlign: 'center',
        marginBottom: '8px',
        fontSize: '24px',
    },
    subtitle: {
        color: '#888',
        textAlign: 'center',
        marginBottom: '32px',
    },
    field: {
        marginBottom: '16px',
    },
    label: {
        display: 'block',
        color: '#ccc',
        marginBottom: '6px',
        fontSize: '14px',
    },
    input: {
        width: '100%',
        padding: '10px 14px',
        backgroundColor: '#0f3460',
        border: '1px solid #1a4a7a',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#e2b96f',
        color: '#1a1a2e',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeigth: 'bold',
        cursor: 'pointer',
        marginTop: '8px',
    },
}