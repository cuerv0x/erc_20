import { React, useState, useEffect } from 'react'
import { ethers } from 'ethers'
import styles from './Monedero.css'
import token_de_abi from './Contratos/token_de_abi.json'
import Interacciones from './Interacciones'

const Monedero = () => {

	const [nombreToken, setNombreToken] = useState("Token");
	const [mensajeError,setMensajeError] = useState(null);
	const [cuentaDefecto,setCuentaDefecto] = useState(null);
	const [balance, setBalance] = useState(null);
	const [proveedor, setProveedor] = useState(null);
	const [firma, setFirma] = useState(null);
	const [contrato, setContrato] = useState(null);
	const [transferirHash, setTransferirHash] = useState(null);
	const [textoBotonConexion, setTextoBotonConexion] = useState("Conectar al Monedero");
	const direccionContrato = "0x448d1b114e9c36fb6e4020b44803d1412a2fcb531c2e2d7b44ed4eae5885f4d7";
	
	const conexionMonederoHandler = async () => {
		if (window.ethereum) { //check if Metamask is installed
	        try {
	            const address = await window.ethereum.enable(); //connect Metamask
	            const resultado = {
	                    connectedStatus: true,
	                    status: "",
	                    address: address
	            }
                cuentaModificadaHandler(resultado.address[0]);
				setTextoBotonConexion("Monedero Conectado");
				//console.log(resultado);
	             
	        } catch (error) {
	            setMensajeError(error.message);
	        }
		}else{
			console.log("Necesita instalar metamask");
			setMensajeError("Instalar metamask");
		}

	}

	const actualizarNombreToken = async () => {
		setNombreToken(await contrato.name());
	}

	const actualizarBalance = async () => {
		let balanceNumeroGrande = await contrato.balanceOf(cuentaDefecto);
		let numeroBalance = balanceNumeroGrande.toNumber();

		let decimalesToken = await contrato.decimals();

		let balanceToken = numeroBalance/ Math.pow(10, decimalesToken);

		setBalance(toFixed(balanceToken));	


	}

	function toFixed(x) {
	   if (Math.abs(x) < 1.0) {
	      var e = parseInt(x.toString().split('e-')[1]);
	      if (e) {
	         x *= Math.pow(10, e - 1);
	         x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
	      }
	   } else {
	      var e = parseInt(x.toString().split('+')[1]);
	      if (e > 20) {
	         e -= 20;
	         x /= Math.pow(10, e);
	         x += (new Array(e + 1)).join('0');
	      }
	   }
	   return x;
	}


	const actualizarEthers = () => {
		let proveedorTemporal = new ethers.providers.Web3Provider(window.ethereum);
		let firmaTemporal = proveedorTemporal.getSigner();
		let contratoTemporal = new ethers.Contract(direccionContrato, token_de_abi, firmaTemporal);
		setContrato(contratoTemporal);
		setProveedor(proveedorTemporal);
		setFirma(firmaTemporal);
	}

	const cuentaModificadaHandler = (nuevaDireccion) => {
		setCuentaDefecto(nuevaDireccion);
		actualizarEthers();
	}

	useEffect(() => {
		if (contrato != null) {
			actualizarBalance();
			actualizarNombreToken();
		}
	}, [contrato]);


	return (
		<div>
			<h2>{nombreToken} + "Monedero ERC-20" </h2>
			<button className="button" onClick={conexionMonederoHandler}>{textoBotonConexion}</button>
		    <div className="tarjetaMonedero">
		    	<div>
		    		<h3>Direccion: {cuentaDefecto}</h3>
		    	</div>
		    	<div>
		    		<h3>{nombreToken} Balance: {balance}</h3>
		    	</div>
		    </div>
		    {mensajeError}
		<Interacciones contrato = {contrato}/>
		</div>
	);
}

export default Monedero;