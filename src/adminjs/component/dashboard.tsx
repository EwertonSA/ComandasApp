import { ApiClient } from 'adminjs'
import "../../../public/admin/frontend/assets/custom-theme.css"
import {H1, H2, Table, TableBody, TableCell, TableHead, TableRow} from '@adminjs/design-system'
import React ,{useEffect, useState} from 'react'
export default function Dashboard(){
    const [resource,setResource]= useState<{[key:string]:number}>()
    const api=new ApiClient()
    useEffect(()=>{
fetchDashData()
    },[])
    async function fetchDashData(){
        const res=await api.getDashboard()
        setResource(res.data as {[key:string]:number})
    }
    return(
       <section style={{padding:'1.5rem'}}>
        <H1>Seja Bem vindo(a)</H1>
      
       <section >
        <H2>Resumo</H2>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell ></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {
                resource?
                Object.entries(resource).map(([resource,count])=>(
                    <TableRow key={resource}>
                        <TableCell  className="adminjs_TableCell" >{resource}</TableCell>
                        <TableCell className="adminjs_TableCell" >{count}</TableCell>
                    </TableRow>
                )):
                <></>
            }
            </TableBody>
        </Table>
       </section>
       </section>
    )
}