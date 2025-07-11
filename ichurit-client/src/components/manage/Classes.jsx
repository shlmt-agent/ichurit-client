import { useEffect, useRef } from 'react'
import { useGetAllClassesQuery } from '../../features/class/classApiSlice'
import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast'
import Class from './Class'
import NewClass from './NewClass'

const Classes = () => {

    const { data: classes = [], isLoading, isError, error } = useGetAllClassesQuery()

    const toast = useRef(null)

    useEffect(()=>{
        if (isError) 
            toast.current.show({ severity: 'error', summary: 'שגיאה בשליפת הכיתות', details: error.error || 'ארעה שגיאה. נסה שוב מאוחר יותר', life: 3000 })
    },[isError])

    return (
        <>
            <Card title='ניהול כיתות' style={{ maxWidth: '50%', marginRight: '25%' }}>
                <NewClass />
            </Card>

            <div style={{ display: 'flex', padding: '50px', flexWrap: 'wrap', justifyContent: "center" }}>
                {classes.map(c => <><Class grade={c.grade} number={c.number} teacher={c.teacher} id={c._id} email={c.email} style={{ width: '300px', height: '200px', margin: '10px' }} /><br /></>)}
            </div>

            <Toast ref={toast} position="top-left" />
        </>
    )
}

export default Classes