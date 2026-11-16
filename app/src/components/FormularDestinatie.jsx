import { useState } from 'react'

export default function FormularDestinatie({ onAdd, seTrimite }) {
  // Exercițiul 2a: Valorile într-un singur obiect
  const [valori, setValori] = useState({ oras: '', tara: '', zile: '' })
  const [erori, setErori] = useState({})

  function valideaza(v) {
    const err = {}
    if (v.oras.trim().length < 2) {
      err.oras = 'Orașul are cel puțin două caractere.'
    }
    if (v.tara.trim() === '') {
      err.tara = 'Țara este obligatorie.'
    }
    const z = Number(v.zile)
    if (v.zile === '' || Number.isNaN(z) || z < 1 || z > 30) {
      err.zile = 'Numărul de zile este între 1 și 30.'
    }
    return err
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValori((curent) => ({ ...curent, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    
    const eroriNoi = valideaza(valori)
    if (Object.keys(eroriNoi).length > 0) {
      setErori(eroriNoi)
      return
    }
    
    setErori({})
    onAdd({
      oras: valori.oras.trim(),
      tara: valori.tara.trim(),
      zile: Number(valori.zile),
      vizitat: false,
    })
    setValori({ oras: '', tara: '', zile: '' })
  }

  return (
    <form className="formular" onSubmit={handleSubmit} noValidate>
      <div className="camp">
        <input
          name="oras"
          placeholder="Oraș"
          value={valori.oras}
          onChange={handleChange}
          className={erori.oras ? 'invalid' : ''}
        />
        {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
      </div>
      
      <div className="camp">
        <input
          name="tara"
          placeholder="Țară"
          value={valori.tara}
          onChange={handleChange}
          className={erori.tara ? 'invalid' : ''}
        />
        {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
      </div>

      <div className="camp">
        <input
          type="number"
          name="zile"
          placeholder="Zile"
          value={valori.zile}
          onChange={handleChange}
          className={erori.zile ? 'invalid' : ''}
        />
        {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
      </div>

      {/* Butonul dezactivat cât timp cererea este în curs */}
      <button type="submit" disabled={seTrimite}>
        {seTrimite ? 'Se trimite...' : 'Adaugă'}
      </button>
    </form>
  )
}