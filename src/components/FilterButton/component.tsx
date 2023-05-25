import React, { useState } from 'react';
import FilterSvg from './FilterSvg';
import { createPortal } from 'react-dom';
import './index.css'
import Portal from '../Portal'
export default () => {
    const [show, setShow] = useState(false)
    const handleClick = () => { setShow(prev => !prev) }
    return <><button onClick={handleClick}><FilterSvg /></button>{show && createPortal(
        <Portal />,
        document.body
    )}</>

}