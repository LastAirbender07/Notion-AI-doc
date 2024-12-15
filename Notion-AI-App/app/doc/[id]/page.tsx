"use client";
import React, { use } from 'react'
import Document from '@/components/Document'

const documentPage = ({params}: {params: Promise<{id: string}>}) => {
    const {id} = use(params);
  return (
    <div className='flex flex-col flex-1 min-h-screen'>
        <Document id={id}/>

    </div>
  )
}

export default documentPage