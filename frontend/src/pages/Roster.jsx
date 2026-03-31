import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const KLASY = [
  'Death Knight', 'Demon Hunter', 'Druid', 'Hunter',
  'Mage', 'Monk', 'Paladin', 'Priest',
  'Rogue', 'Shaman', 'Warlock', 'Warrior'
]

const RANGI = ['Guild Master', 'Officer', 'Member']

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
    const [formularz, setFormularz] = useState(false)
    const [szukaj, setSzukaj] = useState('')
    const [blad, setBlad] = useState('')
    const [nowy, setNowy]             = useState({
    imie: '', klasa: 'Warrior', poziom: 80, ranga: 'Member'
    })
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

    async function dodajCzlonka(e) {
    e.preventDefault()
    setBlad('')
    try {
      const token = localStorage.getItem('token')
      await api.post('/roster', {
        imie:   nowy.imie,
        klasa:  nowy.klasa,
        poziom: parseInt(nowy.poziom),
        ranga:  nowy.ranga,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const response = await api.get('/roster', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCzlonkowie(response.data)
      setFormularz(false)
      setNowy({ imie: '', klasa: 'Warrior', poziom: 80, ranga: 'Member' })
    } catch (err) {
      if (err.response?.status === 403) {
        setBlad('Tylko oficerowie mogą dodawać członków!')
      }
    }
  }

    async function usunCzlonka(id, imie){
      if(!window.confirm(`Czy na pewno chcesz usunąć ${imie} z gildii?`)) return
      try{
        const token = localStorage.getItem('token')
        await api.delete(`/roster/${id}`, {
          headers: { Authorization: `Bearer ${token}`}
        })
        pobierzRoster()
      } catch (err){
        if (err.response?.status === 403) {
        alert('Tylko oficerowie mogą usuwać członków!')
      }
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
          <div style={styles.naglowekPrawo}>
            <input
              style={styles.szukaj}
              placeholder="Szukaj gracza lub klasy..."
              value={szukaj}
              onChange={(e) => setSzukaj(e.target.value)}
            />
            <button style={styles.btnDodaj} onClick={() => setFormularz(!formularz)}>
              {formularz ? '✕ Anuluj' : '+ Dodaj Członka'}
            </button>
          </div>
        </div>

        {formularz && (
          <div style={styles.formularz}>
            <h3 style={styles.formularzTytul}>Nowy Członek Gildii</h3>
            {blad && <div style={styles.blad}>{blad}</div>}
            <form onSubmit={dodajCzlonka}>
              <div style={styles.formularzGrid}>
                <div style={styles.pole}>
                  <label style={styles.label}>Imię postaci</label>
                  <input
                    style={styles.input}
                    placeholder="np. Arthas"
                    value={nowy.imie}
                    onChange={(e) => setNowy({...nowy, imie: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.pole}>
                  <label style={styles.label}>Klasa</label>
                  <select
                    style={styles.input}
                    value={nowy.klasa}
                    onChange={(e) => setNowy({...nowy, klasa: e.target.value})}
                  >
                    {KLASY.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.pole}>
                  <label style={styles.label}>Poziom</label>
                  <input
                    style={styles.input}
                    type="number"
                    min="1"
                    max="80"
                    value={nowy.poziom}
                    onChange={(e) => setNowy({...nowy, poziom: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.pole}>
                  <label style={styles.label}>Ranga</label>
                  <select
                    style={styles.input}
                    value={nowy.ranga}
                    onChange={(e) => setNowy({...nowy, ranga: e.target.value})}
                  >
                    {RANGI.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button 
              style={styles.btnZapisz} 
              type="button"
              onClick={dodajCzlonka}
              >
              Dodaj do gildii
              </button>
            </form>
          </div>
        )}

        {ladowanie ? (
          <p style={styles.info}>Ładowanie...</p>
        ) : przefiltrowane.length === 0 ? (
          <div style={styles.pusty}>
            <p style={styles.pustyTekst}>Brak członków — dodaj pierwszego!</p>
          </div>
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
                  <button
                    style={styles.btnUsun}
                    onClick={() => usunCzlonka(czlonek.id, czlonek.imie)}
                    title="Usuń z gildii"
                  >
                    ✕
                  </button>
                </div>
                <h3 style={styles.imie}>{czlonek.imie}</h3>
                <div style={styles.kartaDol}>
                  <span style={styles.poziom}>Poziom {czlonek.poziom}</span>
                  <span style={{
                    ...styles.ranga,
                    color:       RANGI_KOLORY[czlonek.ranga] || '#888',
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
  strona:       { minHeight: '100vh', backgroundColor: '#0d1117' },
  container:    { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  naglowek:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  tytul:        { color: '#e6edf3', fontSize: '26px', fontWeight: 'bold' },
  podtytul:     { color: '#8b949e', fontSize: '14px', marginTop: '4px' },
  naglowekPrawo:{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  szukaj:       { padding: '10px 16px', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', width: '260px', outline: 'none' },
  btnDodaj:     { padding: '10px 20px', backgroundColor: '#e2b96f', color: '#0d1117', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap' },
  formularz:    { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  formularzTytul: { color: '#e2b96f', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' },
  formularzGrid:{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' },
  pole:         { display: 'flex', flexDirection: 'column' },
  label:        { color: '#8b949e', fontSize: '13px', marginBottom: '6px' },
  input:        { padding: '10px 14px', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none' },
  blad:         { backgroundColor: '#2d1b1b', border: '1px solid #f85149', borderRadius: '8px', color: '#f85149', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' },
  btnZapisz:    { padding: '10px 24px', backgroundColor: '#238636', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  karta:        { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px' },
  kartaGora:    { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' },
  klasaKropka:  { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  klasa:        { color: '#8b949e', fontSize: '13px', flex: 1 },
  btnUsun:      { background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: '14px', padding: '2px 6px', borderRadius: '4px' },
  imie:         { color: '#e6edf3', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' },
  kartaDol:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  poziom:       { color: '#8b949e', fontSize: '13px' },
  ranga:        { fontSize: '12px', border: '1px solid', borderRadius: '20px', padding: '3px 10px' },
  pusty:        { textAlign: 'center', padding: '64px' },
  pustyTekst:   { color: '#8b949e', fontSize: '16px' },
  info:         { color: '#8b949e', textAlign: 'center', padding: '48px' },
}