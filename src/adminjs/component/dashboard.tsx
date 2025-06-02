import { ApiClient } from 'adminjs'
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
      
       <section style={{backgroundColor:'black'}}>
        <H2>Resumo</H2>
        <Table>
            <TableHead>
                <TableRow style={{backgroundColor:'blue'}}>
                    <TableCell style={{backgroundColor:'white'}}></TableCell>
                    <TableCell style={{backgroundColor:'white'}}></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
            {
                resource?
                Object.entries(resource).map(([resource,count])=>(
                    <TableRow key={resource}>
                        <TableCell  style={{color:'white'}} >{resource}</TableCell>
                        <TableCell style={{color:'white'}} >{count}</TableCell>
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