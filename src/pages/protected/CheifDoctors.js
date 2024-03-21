import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import CheifDoctors from '../../features/cheifdoctors'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Cheif Doctors"}))
      }, [])


    return(
        <CheifDoctors />
    )
}

export default InternalPage