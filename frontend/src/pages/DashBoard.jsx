import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const KLASY_ROLE = {
  'Death Knight': 'Tank/DPS',
  'Demon Hunter': 'Tank/DPS',
  'Druid':        'Tank/Healer/DPS',
  'Hunter':       'DPS',
  'Mage':         'DPS',
  'Monk':         'Tank/Healer/DPS',
  'Paladin':      'Tank/Healer/DPS',
  'Priest':       'Healer/DPS',
  'Rogue':        'DPS',
  'Shaman':       'Healer/DPS',
  'Warlock':      'DPS',
  'Warrior':      'Tank/DPS',
}

const KLASY_KOLORY = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  'Druid':        '#FF7C0A',
  'Hunter':       '#AAD372',
  'Mage':         '#3FC7EB',
  'Monk':         '#00FF98',
  'Paladin':      '#F48CBA',
  'Priest':       '#aaaaaa',
  'Rogue':        '#FFF468',
  'Shaman':       '#0070DD',
  'Warlock':      '#8788EE',
  'Warrior':      '#C69B3A',
}

export default function Dashboard(){
    const [czlonkowie, setCzlonkowie] = useState([])
    const [rajdy, setRajdy]           = useState([])
    const [wydarzenia, setWydarzenia] = useState([])
    const [ladowanie, setLadowanie]   = useState(true)
    const navigate = useNavigate()

    useEffect(() => {pobierzDane()} , [])

    async function pobierzDane(){
        try{
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }

            const [rCzlonkowie, rRajdy, rWydarzenia] =await Promise.all([
                api.get('/roster', {headers}),
                api.get('/rajdy', {headers}),
                api.get('/kalendarz', {headers}),
            ])

            setCzlonkowie(rCzlonkowie.data)
            setRajdy(rRajdy.data)
            setWydarzenia(rWydarzenia.data)
        } catch(err){
            if(err.response?.status === 401) navigate('/login')
        } finally{
        setLadowanie(false)
        }
    }

    const statKlas = czlonkowie.reduce((acc,c) => {
        acc[c.klasa] =(acc[c.klasa] || 0) + 1
        return acc
    }, {})

    const udaneRajdy = rajdy.filter(r => r.udany).length
    const nieudaneRajdy = rajdy.filter(r => !r.udany).length

    const ostatnieRajdy = [...rajdy]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3)

    const teraz = new Date()
    const najblizsze = wydarzenia
    .filter(w=>new Date(w.data) >= teraz)
    .slice(0,3)

    if (ladowanie) return(
        <>
      <Navbar />
      <p style={styles.info}>Ładowanie dashboardu...</p>
    </>
    )
    return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.naglowek}>
          <h1 style={styles.tytul}>Dashboard Gildii</h1>
          <p style={styles.podtytul}>Witaj z powrotem!</p>
        </div>

        {/* Karty statystyk */}
        <div style={styles.statsGrid}>
          <div style={styles.statKarta} onClick={() => navigate('/roster')}>
            <div style={styles.statLiczba}>{czlonkowie.length}</div>
            <div style={styles.statNazwa}>Członków</div>
          </div>
          <div style={styles.statKarta} onClick={() => navigate('/rajdy')}>
            <div style={styles.statLiczba}>{rajdy.length}</div>
            <div style={styles.statNazwa}>Rajdów</div>
          </div>
          <div style={styles.statKarta} onClick={() => navigate('/rajdy')}>
            <div style={styles.statIkona}>✅</div>
            <div style={{...styles.statLiczba, color: '#3fb950'}}>{udaneRajdy}</div>
            <div style={styles.statNazwa}>Udanych rajdów</div>
          </div>
          <div style={styles.statKarta} onClick={() => navigate('/kalendarz')}>
            <div style={styles.statLiczba}>{wydarzenia.length}</div>
            <div style={styles.statNazwa}>Wydarzeń</div>
          </div>
        </div>

        <div style={styles.dwieKolumny}>

          {/* Ostatnie rajdy */}
          <div style={styles.sekcja}>
            <h2 style={styles.sekcjaTytul}>Ostatnie Rajdy</h2>
            {ostatnieRajdy.length === 0 ? (
              <p style={styles.pusty}>Brak rajdów</p>
            ) : (
              ostatnieRajdy.map(rajd => (
                <div key={rajd.id} style={styles.listaItem}>
                  <div style={styles.listaItemLewo}>
                    <div style={{
                      ...styles.statusKropka,
                      backgroundColor: rajd.udany ? '#3fb950' : '#f85149'
                    }}/>
                    <div>
                      <p style={styles.listaItemTytul}>{rajd.nazwa}</p>
                      <p style={styles.listaItemData}>
                        {rajd.data ? rajd.data.split('T')[0] : ''}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: rajd.udany ? '#1a3a2a' : '#3a1a1a',
                    color:           rajd.udany ? '#3fb950' : '#f85149',
                    border: `1px solid ${rajd.udany ? '#3fb950' : '#f85149'}`,
                  }}>
                    {rajd.udany ? '✓ Udany' : '✗ Nieudany'}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Najbliższe wydarzenia */}
          <div style={styles.sekcja}>
            <h2 style={styles.sekcjaTytul}>Najbliższe Wydarzenia</h2>
            {najblizsze.length === 0 ? (
              <p style={styles.pusty}>Brak nadchodzących wydarzeń</p>
            ) : (
              najblizsze.map(w => (
                <div key={w.id} style={styles.listaItem}>
                  <div style={styles.listaItemLewo}>
                    <div style={styles.dataBlok}>
                      <span style={styles.dataLiczba}>
                        {w.data ? w.data.split('T')[0]?.split('-')[2] : '?'}
                      </span>
                      <span style={styles.dataMiesiac}>
                        {w.data ? new Date(w.data).toLocaleString('pl-PL', { month: 'short' }) : ''}
                      </span>
                    </div>
                    <div>
                      <p style={styles.listaItemTytul}>{w.tytul}</p>
                      <p style={styles.listaItemData}>
                        {w.data ? w.data.split('T')[1]?.substring(0, 5) : ''}
                      </p>
                    </div>
                  </div>
                  {w.obowiazkowe && (
                    <span style={styles.obowiazkowe}></span>
                  )}
                </div>
              ))
            )}
          </div>

        </div>

        {/* Skład klasowy */}
        <div style={styles.sekcja}>
          <h2 style={styles.sekcjaTytul}>Skład Klasowy</h2>
          {czlonkowie.length === 0 ? (
            <p style={styles.pusty}>Brak członków</p>
          ) : (
            <div style={styles.klasyGrid}>
              {Object.entries(statKlas)
                .sort((a, b) => b[1] - a[1])
                .map(([klasa, liczba]) => (
                    <div key={klasa} style={styles.klasaItem}>
                    <div style={styles.klasaInfo}>
                    <div style={{
                     ...styles.klasaKropka,
                    backgroundColor: KLASY_KOLORY[klasa] || '#888'
                    }}/>
                    <div>
                    <span style={styles.klasaNazwa}>{klasa}</span>
                    <p style={styles.klasaRola}>{KLASY_ROLE[klasa]}</p>  {/* ← dodaj */}
                    </div>
                    </div>
                    <div style={styles.klasaPasek}>
                    <div style={{
                     ...styles.klasaPasekWypelnienie,
                    width: `${(liczba / czlonkowie.length) * 100}%`,
                    backgroundColor: KLASY_KOLORY[klasa] || '#888',
                    }}/>
                    </div>
                    <span style={styles.klasaLiczba}>{liczba}</span>
                    </div>
                    ))
                }
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const styles = {
  strona:       { minHeight: '100vh', backgroundColor: '#0d1117' },
  container:    { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  naglowek:     { marginBottom: '24px' },
  tytul:        { color: '#e6edf3', fontSize: '26px', fontWeight: 'bold' },
  podtytul:     { color: '#8b949e', fontSize: '14px', marginTop: '4px' },
  info:         { color: '#8b949e', textAlign: 'center', padding: '48px' },

  statsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statKarta:    { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer' },
  statIkona:    { fontSize: '28px', marginBottom: '12px' },
  statLiczba:   { color: '#e2b96f', fontSize: '36px', fontWeight: 'bold', marginBottom: '4px' },
  statNazwa:    { color: '#8b949e', fontSize: '14px' },

  dwieKolumny:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' },
  sekcja:       { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', marginBottom: '16px' },
  sekcjaTytul:  { color: '#e6edf3', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' },
  pusty:        { color: '#8b949e', fontSize: '14px', textAlign: 'center', padding: '16px' },

  listaItem:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #21262d' },
  listaItemLewo:{ display: 'flex', alignItems: 'center', gap: '12px' },
  listaItemTytul: { color: '#e6edf3', fontSize: '14px', fontWeight: '500' },
  listaItemData:{ color: '#8b949e', fontSize: '12px', marginTop: '2px' },
  statusKropka: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  badge:        { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' },

  dataBlok:     { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', padding: '6px 10px', minWidth: '44px' },
  dataLiczba:   { color: '#e2b96f', fontSize: '18px', fontWeight: 'bold', lineHeight: 1 },
  dataMiesiac:  { color: '#8b949e', fontSize: '11px', marginTop: '2px' },
  obowiazkowe:  { fontSize: '16px' },

  klasyGrid:    { display: 'flex', flexDirection: 'column', gap: '10px' },
  klasaItem:    { display: 'flex', alignItems: 'center', gap: '12px' },
  klasaInfo: { display: 'flex', alignItems: 'center', gap: '8px', width: '180px', flexShrink: 0 },
  klasaKropka:  { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0 },
  klasaNazwa:   { color: '#8b949e', fontSize: '13px' },
  klasaPasek:   { flex: 1, backgroundColor: '#21262d', borderRadius: '4px', height: '8px', overflow: 'hidden' },
  klasaPasekWypelnienie: { height: '100%', borderRadius: '4px', transition: 'width 0.3s' },
  klasaLiczba:  { color: '#e6edf3', fontSize: '14px', fontWeight: 'bold', minWidth: '20px', textAlign: 'right' },
  klasaRola: { color: '#8b949e', fontSize: '11px', marginTop: '2px' },
}
