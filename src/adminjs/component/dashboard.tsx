import React, { useEffect, useState } from 'react'
import { ApiClient } from 'adminjs'

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
        <table >
          <thead>
            <tr>
              <th >Recurso</th>
              <th>Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {resource &&
              Object.entries(resource).map(([key, count]) => (
                <tr key={key}>
                  <td style={{color:'#ffffff'}} >{key}</td>
                  <td  style={{color:'#ffffff'}} >{count}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </section>
  )
}
