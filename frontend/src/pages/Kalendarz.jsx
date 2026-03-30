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
        <div style={styles.header}>
          <h1 style={styles.title}>Kalendarz Gildii</h1>
          <button style={styles.btnDodaj} onClick={() => setFormularz(!formularz)}>
            {formularz ? 'Anuluj' : '+ Dodaj Wydarzenie'}
          </button>
        </div>

        {formularz && (
          <div style={styles.formularz}>
            <h3 style={styles.formularzTitle}>Nowe Wydarzenie</h3>
            <form onSubmit={dodajWydarzenie}>
              <input
                style={styles.input}
                placeholder="Tytuł np. Rajd — Blackwing Lair"
                value={nowe.tytul}
                onChange={(e) => setNowe({...nowe, tytul: e.target.value})}
                required
              />
              <input
                style={styles.input}
                type="datetime-local"
                value={nowe.data}
                onChange={(e) => setNowe({...nowe, data: e.target.value})}
                required
              />
              <textarea
                style={styles.input}
                placeholder="Opis wydarzenia..."
                value={nowe.opis}
                onChange={(e) => setNowe({...nowe, opis: e.target.value})}
              />
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={nowe.obowiazkowe}
                  onChange={(e) => setNowe({...nowe, obowiazkowe: e.target.checked})}
                />
                <span style={{color: '#ccc', marginLeft: '8px'}}>Obowiązkowe</span>
              </label>
              <button style={styles.btnZapisz} type="submit">Zapisz</button>
            </form>
          </div>
        )}

        <div style={styles.lista}>
          {wydarzenia.length === 0 && (
            <p style={styles.info}>Brak wydarzeń — dodaj pierwsze!</p>
          )}
          {wydarzenia.map((w) => (
            <div key={w.id} style={styles.karta}>
              <div style={styles.kartaHeader}>
                <h3 style={styles.tytul}>{w.tytul}</h3>
                {w.obowiazkowe && (
                  <span style={styles.obowiazkowe}>⚠️ Obowiązkowe</span>
                )}
              </div>
              <p style={styles.data}>📅 {w.data}</p>
              {w.opis && <p style={styles.opis}>{w.opis}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  strona:{ 
    minHeight: '100vh', 
    backgroundColor: '#1a1a2e' 
},
  container:{ 
    padding: '24px' 
},
  header:{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '24px' 
},
  title:{ 
    color: '#e2b96f', 
    fontSize: '28px' 
},
  btnDodaj:{ 
    padding: '10px 20px', 
    backgroundColor: '#e2b96f', 
    color: '#1a1a2e', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
},
  formularz:{ 
    backgroundColor: '#16213e', 
    padding: '24px', 
    borderRadius: '12px', 
    marginBottom: '24px', 
    border: '1px solid #0f3460' 
},
  formularzTitle:{ 
    color: '#e2b96f', 
    marginBottom: '16px' 
},
  input:{ 
    display: 'block', 
    width: '100%', 
    padding: '10px 14px', 
    backgroundColor: '#0f3460', 
    border: '1px solid #1a4a7a', 
    borderRadius: '8px', 
    color: '#fff', 
    fontSize: '14px', 
    marginBottom: '12px', 
    boxSizing: 'border-box' 
},
  checkbox:{ 
    display: 'flex', 
    alignItems: 'center', 
    marginBottom: '16px', 
    cursor: 'pointer' 
},
  btnZapisz:{ 
    padding: '10px 24px', 
    backgroundColor: '#6ee7b7', 
    color: '#1a1a2e', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold' 
},
  lista:{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '12px'
},
  karta:{ 
    backgroundColor: '#16213e', 
    padding: '20px', 
    borderRadius: '12px', 
    border: '1px solid #0f3460' 
},
  kartaHeader:{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '8px' 
},
  tytul:{ 
    color: '#fff', 
    fontSize: '18px' 
},
  obowiazkowe:{ 
    padding: '4px 12px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    backgroundColor: '#fbbf24', 
    color: '#1a1a2e', 
    fontWeight: 'bold' 
},
  data:{ 
    color: '#888', 
    fontSize: '13px', 
    marginBottom: '8px' 
},
  opis:{ 
    color: '#aaa', 
    fontSize: '14px' 
},
  info:{ 
    color: '#888', 
    padding: '24px' 
},
}