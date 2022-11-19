import { React, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from './Monedero.css'


const Interacciones = (props) => {

	

	const [transfererenciaHash, setTransferenciaHash] = useState();


	const transferenciaHandler = async (e) => {
		e.preventDefault();
		let cantidadTransferencia = e.target.sendAmount.value;
		let direccionDestinatario = e.target.recieverAddress.value;

		let txt = await props.contrato.transfer(direccionDestinatario, cantidadTransferencia);
		console.log(txt);
		setTransferenciaHash("Hash de confirmacion de la transferencia: " + txt.hash);
	}

	return (
			<div className="tarjetaMonedero">
				<form onSubmit={transferenciaHandler}>
					<h3> Monedas a transferir </h3>
						<p> Direccion de destinatario </p>
						<input type='text' id='recieverAddress' className="direccion"/>

						<p> Cantidad para Enviar </p>
						<input type='number' id='sendAmount' min='0' step='1'/>

						<button type='submit' className="boton">Enviar</button>
						<div>
							{transfererenciaHash}
						</div>
			</form>
			</div>
		)
	
}

export default Interacciones;