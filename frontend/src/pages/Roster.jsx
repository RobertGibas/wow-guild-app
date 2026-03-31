import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const KLASY_KOLORY = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  'Druid':        '#FF7C0A',
  'Hunter':       '#AAD372',
  'Mage':         '#3FC7EB',
  'Monk':         '#00FF98',
  'Paladin':      '#F48CBA',
  'Priest':       '#FFFFFF',
  'Rogue':        '#FFF468',
  'Shaman':       '#0070DD',
  'Warlock':      '#8788EE',
  'Warrior':      '#C69B3A',
}

const RANGI_KOLORY = {
        'Guild Master': '#e2b96f',
        'Officer': '#a78bfa',
        'Member': '#6ee7b7',
}

export default function Roster(){
    const [czlonkowie, setCzlonkowie] = useState([])
    const [ladowanie, setLadowanie] = useState(true)
    const [szukaj, setSzukaj] = useState('')
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
      }} 
      finally {
      setLadowanie(false)
    }
  }
    const przefiltrowane = czlonkowie.filter(c =>
    c.imie.toLowerCase().includes(szukaj.toLowerCase()) ||
    c.klasa.toLowerCase().includes(szukaj.toLowerCase())
  )

     return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.naglowek}>
          <div>
            <h1 style={styles.tytul}>Roster Gildii</h1>
            <p style={styles.podtytul}>{czlonkowie.length} członków</p>
          </div>
          <input
            style={styles.szukaj}
            placeholder="🔍 Szukaj gracza lub klasy..."
            value={szukaj}
            onChange={(e) => setSzukaj(e.target.value)}
          />
        </div>

        {ladowanie ? (
          <p style={styles.info}>Ładowanie...</p>
        ) : (
          <div style={styles.grid}>
            {przefiltrowane.map((czlonek) => (
              <div key={czlonek.id} style={styles.karta}>
                <div style={styles.kartaGora}>
                  <div style={{
                    ...styles.klasaKropka,
                    backgroundColor: KLASY_KOLORY[czlonek.klasa] || '#888'
                  }}/>
                  <span style={styles.klasa}>{czlonek.klasa}</span>
                </div>
                <h3 style={styles.imie}>{czlonek.imie}</h3>
                <div style={styles.kartaDol}>
                  <span style={styles.poziom}>Poziom {czlonek.poziom}</span>
                  <span style={{
                    ...styles.ranga,
                    color: RANGI_KOLORY[czlonek.ranga] || '#888',
                    borderColor: RANGI_KOLORY[czlonek.ranga] || '#888',
                  }}>
                    {czlonek.ranga}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
const styles = {
  strona:    { minHeight: '100vh', backgroundColor: '#0d1117' },
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  naglowek:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  tytul:     { color: '#e6edf3', fontSize: '26px', fontWeight: 'bold' },
  podtytul:  { color: '#8b949e', fontSize: '14px', marginTop: '4px' },
  szukaj:    { padding: '10px 16px', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', width: '280px', outline: 'none' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  karta:     { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', transition: 'border-color 0.2s' },
  kartaGora: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  klasaKropka: { width: '10px', height: '10px', borderRadius: '50%' },
  klasa:     { color: '#8b949e', fontSize: '13px' },
  imie:      { color: '#e6edf3', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' },
  kartaDol:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  poziom:    { color: '#8b949e', fontSize: '13px' },
  ranga:     { fontSize: '12px', border: '1px solid', borderRadius: '20px', padding: '3px 10px' },
  info:      { color: '#8b949e', textAlign: 'center', padding: '48px' },
}