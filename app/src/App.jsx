import { useEffect, useState } from 'react'
import { getDestinatii, patchVizitat, postDestinatie } from './api/destinatii.js'
import { getNevizitate, totalZile, adaugaDestinatie } from './utils/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import Rezumat from './components/Rezumat.jsx'
import './App.css'
import Cautare from './components/Cautare.jsx'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [cautare, setCautare] = useState('')
  const [pagina, setPagina] = useState(1)
  const [totalPagini, setTotalPagini] = useState(1)

  useEffect(() => {
    async function incarca() {
      try {
        const rezultat = await getDestinatii(pagina)
        setDestinatii(rezultat.data) // lista e acum în rezultat.data
        setTotalPagini(rezultat.pages) // numărul total e în rezultat.pages
      } catch (error) {
        setEroare(error.message)
      } finally {
        setIncarcare(false)
      }
    }
    incarca()
  }, [pagina])

  async function handleToggle(id) {
    const dest = destinatii.find((d) => d.id === id)
    try {
      const salvata = await patchVizitat(id, !dest.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (error) {
      console.error(error)
    }
  }

  async function handleAdd(destinatie) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(destinatie)
      setDestinatii((current) => adaugaDestinatie(current, salvata))
    } catch (error) {
      console.error(error)
    } finally {
      setSeTrimite(false)
    }
  }

  const nevizitate = getNevizitate(destinatii)

  if (incarcare) {
    return (
      <main>
        <h1>City Explorer</h1>
        <p className="stare">Se încarcă destinațiile...</p>
      </main>
    )
  }

  if (eroare) {
    return (
      <main>
        <h1>City Explorer</h1>
        <p className="stare eroare">{eroare}</p>
      </main>
    )
  }

  const text = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) => d.oras.toLowerCase().includes(text) || 
           d.tara.toLowerCase().includes(text)
  )

  return (
    <main>
      <h1>City Explorer</h1>
      <PanouStatistici />
      <Rezumat 
        total={destinatii.length} 
        nevizitate={nevizitate.length} 
        zile={totalZile(nevizitate)} 
      />
      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
      <Cautare valoare={cautare} onChange={(e) => setCautare(e.target.value)} />
      
      {destinatii.length === 0 ? (
        <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
      ) : afisate.length === 0 ? (
        <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
      ) : (
        <ListaDestinatii destinatii={afisate} onToggle={handleToggle} />
      )}

      {/* Butoanele de paginare cu clasa CSS separată */}
      <div className="paginare">
        <button 
          disabled={pagina === 1} 
          onClick={() => setPagina(pagina - 1)}
        >
          Înapoi
        </button>
        
        <span>pagina {pagina} din {totalPagini}</span>
        
        <button 
          disabled={pagina === totalPagini} 
          onClick={() => setPagina(pagina + 1)}
        >
          Înainte
        </button>
      </div>
    </main>
  )
}