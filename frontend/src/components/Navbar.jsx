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

    return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <span style={styles.logoTekst}>Guild Manager</span>
      </div>

      <div style={styles.linki}>
        {linki.map((link) => {
          const aktywny = location.pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                ...styles.link,
                ...(aktywny ? styles.linkAktywny : {})
              }}
            >
              <span>{link.label}</span>
            </button>
          )
        })}
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
    padding: '0 24px',
    height: '60px',
    backgroundColor: '#161b22',
    borderBottom: '1px solid #30363d',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIkona: {
    fontSize: '22px',
  },
  logoTekst: {
    color: '#e2b96f',
    fontSize: '16px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  linki: {
    display: 'flex',
    gap: '4px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    color: '#8b949e',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
  },
  linkAktywny: {
    color: '#e2b96f',
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
  },
  wyloguj: {
    padding: '7px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #f85149',
    borderRadius: '8px',
    color: '#f85149',
    cursor: 'pointer',
    fontSize: '13px',
  },
}