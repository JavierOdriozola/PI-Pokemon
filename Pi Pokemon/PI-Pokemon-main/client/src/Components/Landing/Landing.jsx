import React from "react"
import { Link } from "react-router-dom"
import clases from './Landing.module.css'
import pokemon from '../../Assets/gentlemon.jpg'
import family from '../../Assets/FamilyPokes.png'


export default function Landing(){
    

    return(
        <div className={clases.imgPrincipal}>
            <div/>
            <Link to='/home' >
                <button className={clases.botonGo}>Go</button>
            </Link>
            <img className={clases.imgSecundaria} src={family} alt="PokeFamily" />
        </div>
    )
}

