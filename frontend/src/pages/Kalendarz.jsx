import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Kalendarz(){
    const [wydarzenia, setWydarzenia] = useState([])
    const [ladowanie, setLadowanie] = useState(true)
    const [formularz, setFormularz] = useState(false)
    const [nowe, setNowe] = useState({
        tytul:'', data:'', opis:'', obowiazkowe: false
    })
    const navigate = useNavigate()

    useEffect(() => {pobierzWydarzenia()}, [])

    async function pobierzWydarzenia() {
        try{
            const token = localStorage.getItem('token')
            const response = await api.get('/kalendarz', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setWydarzenia(response.data)
        } catch(err){
            if(err.response?.status === 401) navigate('/login')
        } finally{
          setLadowanie(false)      
        }
    }

    async function dodajWydarzenie(e){
        e.preventDefault()
        try{
            const token = localStorage.getItem('token')
            await api.post('/kalendarz',{
                tytul: nowe.tytul,
                data: new Date(nowe.data).toISOString(),
                opis: nowe.opis,
                obowiazkowe: nowe.obowiazkowe,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setFormularz(false)
            setNowe({tytul: '', data:'', opis:'', obowiazkowe: false})
            pobierzWydarzenia()
        } catch (err){
            console.log('Błąd dodawania wydarzenia', err)
        }
    }

     if (ladowanie) return <><Navbar /><p style={styles.info}>Ładowanie...</p></>
 return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>

        <div style={styles.naglowek}>
          <div>
            <h1 style={styles.tytul}>Kalendarz Gildii</h1>
            <p style={styles.podtytul}>{wydarzenia.length} wydarzeń</p>
          </div>
          <button style={styles.btnDodaj} onClick={() => setFormularz(!formularz)}>
            {formularz ? '✕ Anuluj' : '+ Dodaj Wydarzenie'}
          </button>
        </div>

        {formularz && (
          <div style={styles.formularz}>
            <h3 style={styles.formularzTytul}>Nowe Wydarzenie</h3>
            <form onSubmit={dodajWydarzenie}>
              <div style={styles.formularzGrid}>
                <div style={styles.pole}>
                  <label style={styles.label}>Tytuł</label>
                  <input
                    style={styles.input}
                    placeholder="np. Rajd — Blackwing Lair"
                    value={nowe.tytul}
                    onChange={(e) => setNowe({...nowe, tytul: e.target.value})}
                    required
                  />
                </div>
                <div style={styles.pole}>
                  <label style={styles.label}>Data i godzina</label>
                  <input
                    style={styles.input}
                    type="datetime-local"
                    value={nowe.data}
                    onChange={(e) => setNowe({...nowe, data: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div style={styles.pole}>
                <label style={styles.label}>Opis</label>
                <textarea
                  style={{...styles.input, height: '80px', resize: 'vertical'}}
                  placeholder="Opis wydarzenia..."
                  value={nowe.opis}
                  onChange={(e) => setNowe({...nowe, opis: e.target.value})}
                />
              </div>
              <div style={styles.checkboxWrap}>
                <input
                  type="checkbox"
                  id="obowiazkowe"
                  checked={nowe.obowiazkowe}
                  onChange={(e) => setNowe({...nowe, obowiazkowe: e.target.checked})}
                />
                <label htmlFor="obowiazkowe" style={styles.checkboxLabel}>
                  Wydarzenie obowiązkowe
                </label>
              </div>
              <button style={styles.btnZapisz} type="submit">
                Zapisz wydarzenie
              </button>
            </form>
          </div>
        )}

        {ladowanie ? (
          <p style={styles.info}>Ładowanie...</p>
        ) : wydarzenia.length === 0 ? (
          <div style={styles.pusty}>
            <p style={styles.pustyTekst}>Brak wydarzeń — dodaj pierwsze!</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {wydarzenia.map((w) => (
              <div key={w.id} style={styles.karta}>
                <div style={styles.kartaLewo}>
                  <div style={styles.dataBlok}>
                    <span style={styles.dataLiczba}>
                    {w.data ? w.data.split('T')[0]?.split('-')[2] : '?'}
                    </span>
                    <span style={styles.dataMiesiac}>
                    {w.data ? new Date(w.data).toLocaleString('pl-PL', { month: 'short' }) : ''}
                    </span>
                  </div>
                  <div>
                    <h3 style={styles.nazwaTytul}>{w.tytul}</h3>
                    <p style={styles.godzina}>
                       {w.data ? w.data.split('T')[1]?.substring(0, 5) : ''}
                    </p>
                    {w.opis && <p style={styles.opis}>{w.opis}</p>}
                  </div>
                </div>
                {w.obowiazkowe && (
                  <span style={styles.obowiazkowe}>Obowiązkowe</span>
                )}
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
  dataBlok:     { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#21262d', border: '1px solid #30363d', borderRadius: '8px', padding: '8px 14px', minWidth: '56px' },
  dataLiczba:   { color: '#e2b96f', fontSize: '22px', fontWeight: 'bold', lineHeight: 1 },
  dataMiesiac:  { color: '#8b949e', fontSize: '12px', marginTop: '2px' },
  nazwaTytul:   { color: '#e6edf3', fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  godzina:      { color: '#8b949e', fontSize: '13px', marginBottom: '4px' },
  opis:         { color: '#8b949e', fontSize: '13px' },
  obowiazkowe:  { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#2d2a1a', color: '#e2b96f', border: '1px solid #e2b96f', whiteSpace: 'nowrap' },
  pusty:        { textAlign: 'center', padding: '64px' },
  pustyTekst:   { color: '#8b949e', fontSize: '16px' },
  info:         { color: '#8b949e', textAlign: 'center', padding: '48px' },
}