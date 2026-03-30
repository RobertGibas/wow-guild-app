import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    function wyloguj() {
        localStorage.removeItem('token')
        navigate('/login')
    }
    const linki = [
        {path: '/roster', label:'Roster' },
        {path: '/rajdy', label:'Rajdy'},
        {path: '/kalendarz', label:'Kalendarz'},
    ]

    return(
        <nav style={styles.nav}>
            <span style={styles.logo}>Guild App</span>
            <div style={styles.linki}>
                {linki.map((link)=> (
                <button 
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    style={{
                        ...styles.link,
                        ...(location.pathname === link.path ? styles.aktywny : {})
                    }}
                >
                    {link.label}
                </button>
                ))}
            </div>
            <button style={styles.wyloguj} onClick={wyloguj}>
                Wyloguj
            </button>
        </nav>
    )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#16213e',
    borderBottom: '1px solid #0f3460',
  },
  logo: {
    color: '#e2b96f',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  linki: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
  },
  aktywny: {
    color: '#e2b96f',
    border: '1px solid #e2b96f',
  },
  wyloguj: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #ff6b6b',
    borderRadius: '8px',
    color: '#ff6b6b',
    cursor: 'pointer',
    fontSize: '14px',
  },
}