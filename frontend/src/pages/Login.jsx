import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login(){
    const [email, setEmail] = useState('')
    const [haslo, setHaslo] = useState('')
    const [blad, setBlad] = useState('')
    const [laduje, setLaduje] = useState(false)
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setBlad('')
        setLaduje(true)
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
        }finally {
            setLaduje(false)
        }
    }
     return (
    <div style={styles.strona}>
      <div style={styles.karta}>
        <div style={styles.naglowek}>
          <h1 style={styles.tytul}>Guild Manager</h1>
          <p style={styles.podtytul}>Zaloguj się do panelu gildii</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.pole}>
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

          <div style={styles.pole}>
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
          <button style={styles.przycisk} type="submit" disabled={laduje}>
            {laduje ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  strona: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d1117',
    padding: '24px',
  },
  karta: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '16px',
    padding: '40px',
  },
  naglowek: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  ikona: {
    fontSize: '48px',
    marginBottom: '12px',
  },
  tytul: {
    color: '#e2b96f',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  podtytul: {
    color: '#8b949e',
    fontSize: '14px',
  },
  pole: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#8b949e',
    fontSize: '13px',
    marginBottom: '6px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
    borderRadius: '8px',
    color: '#e6edf3',
    fontSize: '14px',
    outline: 'none',
  },
  blad: {
    backgroundColor: '#2d1b1b',
    border: '1px solid #f85149',
    borderRadius: '8px',
    color: '#f85149',
    padding: '10px 14px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  przycisk: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e2b96f',
    color: '#0d1117',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
}