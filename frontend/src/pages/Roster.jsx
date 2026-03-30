import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Roster(){
    const [czlonkowie, setCzlonkowie] = useState([])
    const [ladowanie, setLadowanie] = useState(true)
    const [blad, setBlad] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        pobierzRoster()
    }, [])

    async function pobierzRoster() {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/roster', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCzlonkowie(response.data)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        setBlad('Błąd pobierania danych')
      }
    } finally {
      setLadowanie(false)
    }
  }

    const rangiKolory = {
        'Guild Master': '#e2b96f',
        'Officer': '#a78bfa',
        'Member': '#6ee7b7',
    }

    if (ladowanie) return <p style={styles.info}>Ładowanie...</p>
    if (blad) return <p style={styles.blad}>{blad}</p>

     return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Roster Gildii</h1>
        <p style={styles.liczba}>Członkowie: {czlonkowie.length}</p>
        <div style={styles.grid}>
          {czlonkowie.map((czlonek) => (
            <div key={czlonek.id} style={styles.karta}>
              <h3 style={styles.imie}>{czlonek.imie}</h3>
              <p style={styles.klasa}>{czlonek.klasa}</p>
              <p style={styles.poziom}>Poziom {czlonek.poziom}</p>
              <span style={{
                ...styles.ranga,
                backgroundColor: rangiKolory[czlonek.ranga] || '#888',
              }}>
                {czlonek.ranga}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const styles = {
    strona: {
    minHeight: 
    '100vh', 
    backgroundColor: '#1a1a2e' 
  },
    container: {
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  title: {
    color: '#e2b96f',
    fontSize: '28px',
  },
   liczba: {
    color: '#888',
    marginBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  karta: {
    backgroundColor: '#16213e',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #0f3460',
  },
  imie: {
    color: '#fff',
    marginBottom: '4px',
    fontSize: '18px',
  },
  klasa: {
    color: '#a78bfa',
    marginBottom: '4px',
    fontSize: '14px',
  },
  poziom: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '12px',
  },
   ranga: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#1a1a2e',
    fontWeight: 'bold',
  },
  info: { color: '#888', padding: '24px' },
  blad: { color: '#ff6b6b', padding: '24px' },
}