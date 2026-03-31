import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Rajdy() {
    const [rajdy, setRajdy] = useState([])
    const [ladowanie, setLadowanie] = useState(true)
    const [formularz, setFormularz] = useState(false)
    const [nowyRajd, setNowyRajd] = useState({
        nazwa: '', data: '', udany: false, notatki: ''
    })
    const navigate = useNavigate()

    useEffect(() => {pobierzRajdy()}, [])

    async function pobierzRajdy(){
        try{
            const token = localStorage.getItem('token')
            const response = await api.get('/rajdy', {
                headers: { Authorization: `Bearer ${token}`}
            })
            setRajdy(response.data)
        } catch (err){
            if (err.response?.status === 401) navigate('/login')
        }finally {
            setLadowanie(false)
        }
    }

    async function dodajRajd(e){
        e.preventDefault()
        try{
            const token = localStorage.getItem('token')
            await api.post('/rajdy',{
                nazwa: nowyRajd.nazwa,
                data: new Date(nowyRajd.data).toISOString(),
                udany: nowyRajd.udany,
                notatki: nowyRajd.notatki
            }, {
                headers: {Authorization: `Bearer ${token}`}
            })
            setFormularz(false)
            setNowyRajd({nazwa: '', data:'', udany: false, notatki:''})
            pobierzRajdy()
        } catch (err){
            setBlad('Błąd dodawania rajdu')
        }
    }
    return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.naglowek}>
          <div>
            <h1 style={styles.tytul}>Logi Rajdowe</h1>
            <p style={styles.podtytul}>{rajdy.length} rajdów w historii</p>
          </div>
          <button style={styles.btnDodaj} onClick={() => setFormularz(!formularz)}>
            {formularz ? '✕ Anuluj' : '+ Dodaj Rajd'}
          </button>
        </div>

        {formularz && (
          <div style={styles.formularz}>
            <h3 style={styles.formularzTytul}>Nowy Rajd</h3>
            <form onSubmit={dodajRajd}>
              <div style={styles.formularzGrid}>
                <div style={styles.pole}>
                  <label style={styles.label}>Nazwa rajdu</label>
                  <input
                    style={styles.input}
                    placeholder="np. Blackwing Lair"
                    value={nowyRajd.nazwa}
                    onChange={(e) => setNowyRajd({...nowyRajd, nazwa: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.pole}>
                  <label style={styles.label}>Data i godzina</label>
                  <input
                    style={styles.input}
                    type="datetime-local"
                    value={nowyRajd.data}
                    onChange={(e) => setNowyRajd({...nowyRajd, data: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div style={styles.pole}>
                <label style={styles.label}>Notatki</label>
                <textarea
                  style={{...styles.input, height: '80px', resize: 'vertical'}}
                  placeholder="Notatki z rajdu..."
                  value={nowyRajd.notatki}
                  onChange={(e) => setNowyRajd({...nowyRajd, notatki: e.target.value})}
                />
              </div>
              <div style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  id="udany"
                  checked={nowyRajd.udany}
                  onChange={(e) => setNowyRajd({...nowyRajd, udany: e.target.checked})}
                />
                <label htmlFor="udany" style={styles.checkboxLabel}>
                  Rajd się udał
                </label>
              </div>
              <button style={styles.btnZapisz} type="submit">
                Zapisz rajd
              </button>
            </form>
          </div>
        )}

        {ladowanie ? (
          <p style={styles.info}>Ładowanie...</p>
        ) : rajdy.length === 0 ? (
          <div style={styles.pusty}>
            <p style={styles.pustyTekst}>Brak rajdów — dodaj pierwszy!</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {rajdy.map((rajd) => (
              <div key={rajd.id} style={styles.karta}>
                <div style={styles.kartaLewo}>
                  <div style={{
                    ...styles.statusKropka,
                    backgroundColor: rajd.udany ? '#3fb950' : '#f85149'
                  }}/>
                  <div>
                    <h3 style={styles.nazwa}>{rajd.nazwa}</h3>
                    <p style={styles.data}>
                    {rajd.data ? rajd.data.split('T')[0] + ' ' + rajd.data.split('T')[1]?.substring(0, 5) : ''}
                    </p>
                    {rajd.notatki && (
                      <p style={styles.notatki}>{rajd.notatki}</p>
                    )}
                  </div>
                </div>
                <span style={{
                  ...styles.status,
                  backgroundColor: rajd.udany ? '#1a3a2a' : '#3a1a1a',
                  color:           rajd.udany ? '#3fb950' : '#f85149',
                  border: `1px solid ${rajd.udany ? '#3fb950' : '#f85149'}`,
                }}>
                  {rajd.udany ? '✓ Udany' : '✗ Nieudany'}
                </span>
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
  container:    { padding: '24px', maxWidth: '1000px', margin: '0 auto' },
  naglowek:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
  tytul:        { color: '#e6edf3', fontSize: '26px', fontWeight: 'bold' },
  podtytul:     { color: '#8b949e', fontSize: '14px', marginTop: '4px' },
  btnDodaj:     { padding: '10px 20px', backgroundColor: '#e2b96f', color: '#0d1117', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
  formularz:    { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '24px', marginBottom: '24px' },
  formularzTytul: { color: '#e2b96f', fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' },
  formularzGrid:{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  pole:         { marginBottom: '16px' },
  label:        { display: 'block', color: '#8b949e', fontSize: '13px', marginBottom: '6px' },
  input:        { width: '100%', padding: '10px 14px', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', color: '#e6edf3', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  checkboxWrap: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  checkboxLabel:{ color: '#8b949e', fontSize: '14px', cursor: 'pointer' },
  btnZapisz:    { padding: '10px 24px', backgroundColor: '#238636', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' },
  lista:        { display: 'flex', flexDirection: 'column', gap: '12px' },
  karta:        { backgroundColor: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  kartaLewo:    { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  statusKropka: { width: '12px', height: '12px', borderRadius: '50%', marginTop: '4px', flexShrink: 0 },
  nazwa:        { color: '#e6edf3', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  data:         { color: '#8b949e', fontSize: '13px', marginBottom: '4px' },
  notatki:      { color: '#8b949e', fontSize: '13px' },
  status:       { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  pusty:        { textAlign: 'center', padding: '64px' },
  pustyTekst:   { color: '#8b949e', fontSize: '16px' },
  info:         { color: '#8b949e', textAlign: 'center', padding: '48px' },
}