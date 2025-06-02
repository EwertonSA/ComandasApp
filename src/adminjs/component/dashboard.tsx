import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'
import "../../../custon-theme.css"
export default function Dashboard() {
  const [resource, setResource] = useState<{ [key: string]: number }>({})
  const api = new ApiClient()

  useEffect(() => {
    fetchDashData()
  }, [])

  async function fetchDashData() {
    const res = await api.getDashboard()
    setResource(res.data as { [key: string]: number })
  }

  return (
    <section style={{ padding: '1.5rem' }}>
      <h1>Seja Bem vindo(a)</h1>

      <section>
        <h2>Resumo</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#fff' }}>Recurso</th>
              <th style={{ textAlign: 'left', padding: '8px', color: '#fff' }}>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {resource &&
              Object.entries(resource).map(([key, count]) => (
                <tr key={key}>
                  <td style={{ padding: '8px', color: '#fff' }}>{key}</td>
                  <td style={{ padding: '8px', color: '#fff' }}>{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}
