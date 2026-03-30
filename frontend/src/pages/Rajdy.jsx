import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

export default function Rajdy() {
    const [rajdy, setRajdy] = useState([])
    const [ladowanie, setLadowanie] = useState(true)
    const [blad, setBlad] = useState('')
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
            else setBlad('Błąd pobierania rajdów')
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
    if(ladowanie) return <><Navbar /><p style={styles.info}>Ładowanie...</p></>
    if(blad) return <><Navbar /><p style={styles.blad}>{blad}</p></>
return (
    <div style={styles.strona}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Logi Rajdowe</h1>
          <button style={styles.btnDodaj} onClick={() => setFormularz(!formularz)}>
            {formularz ? 'Anuluj' : '+ Dodaj Rajd'}
          </button>
        </div>

        {formularz && (
          <div style={styles.formularz}>
            <h3 style={styles.formularzTitle}>Nowy Rajd</h3>
            <form onSubmit={dodajRajd}>
              <input
                style={styles.input}
                placeholder="Nazwa rajdu np. Blackwing Lair"
                value={nowyRajd.nazwa}
                onChange={(e) => setNowyRajd({...nowyRajd, nazwa: e.target.value})}
                required
              />
              <input
                style={styles.input}
                type="datetime-local"
                value={nowyRajd.data}
                onChange={(e) => setNowyRajd({...nowyRajd, data: e.target.value})}
                required
              />
              <textarea
                style={styles.input}
                placeholder="Notatki..."
                value={nowyRajd.notatki}
                onChange={(e) => setNowyRajd({...nowyRajd, notatki: e.target.value})}
              />
              <label style={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={nowyRajd.udany}
                  onChange={(e) => setNowyRajd({...nowyRajd, udany: e.target.checked})}
                />
                <span style={{color: '#ccc', marginLeft: '8px'}}>Rajd się udał</span>
              </label>
              <button style={styles.btnZapisz} type="submit">Zapisz</button>
            </form>
          </div>
        )}

        <div style={styles.lista}>
          {rajdy.length === 0 && (
            <p style={styles.info}>Brak rajdów — dodaj pierwszy!</p>
          )}
          {rajdy.map((rajd) => (
            <div key={rajd.id} style={styles.karta}>
              <div style={styles.kartaHeader}>
                <h3 style={styles.nazwa}>{rajd.nazwa}</h3>
                <span style={{
                  ...styles.status,
                  backgroundColor: rajd.udany ? '#6ee7b7' : '#ff6b6b',
                  color: '#1a1a2e'
                }}>
                  {rajd.udany ? '✓ Udany' : '✗ Nieudany'}
                </span>
              </div>
              <p style={styles.data}>📅 {rajd.data}</p>
              {rajd.notatki && <p style={styles.notatki}>{rajd.notatki}</p>}
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
  nazwa:{ 
    color: '#fff', 
    fontSize: '18px' 
},
  status:{ 
    padding: '4px 12px', 
    borderRadius: '20px', 
    fontSize: '12px', 
    fontWeight: 'bold' },
  data:{ 
    color: '#888', 
    fontSize: '13px', 
    marginBottom: '8px' 
},
  notatki:{ 
    color: '#aaa', 
    fontSize: '14px' 
},
  info:{ 
    color: '#888', 
    padding: '24px' 
},
  blad:{ 
    color: '#ff6b6b', 
    padding: '24px' 
},
}