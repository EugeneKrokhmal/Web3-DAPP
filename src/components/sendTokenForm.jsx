import React, { useState } from 'react'
import { Button, Form, Card, Alert, ListGroup } from 'react-bootstrap'
import Web3 from 'web3'

function SendTokenForm() {
	const [account, setAccount] = useState('')
	const [balance, setBalance] = useState('')
	const [tokenBalance, setTokenBalance] = useState('')
	const [tokenDecimals, setTokenDecimals] = useState('')
	const [gasFee, setGasFee] = useState('')
	const [tokenAmount, setTokenAmount] = useState('')
	const [destinationAddress, setDestinationAddress] = useState('')
	const [validationErrorText, throwError] = useState('')
	const [show, setShowAlert] = useState(false)
	const abi = require('../ABI.json')
	const web3 = new Web3(window.ethereum)
	const tokenAddress = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6'
	const contract = new web3.eth.Contract(abi, tokenAddress)

	const transfer = () => {
		contract.methods
			.transfer(destinationAddress, tokenAmountToWei(tokenAmount, tokenDecimals))
			.send({ from: account }, (e, res) => {
				if (!e) {
					throwError(`Success! Your transaction hash is ${res}`)
					setShowAlert(true)
				} else {
					throwError(e.message)
					setShowAlert(true)
				}
			})
	}

	const getAccounts = () => {
		web3.eth.getAccounts()
			.then(res => setAccount(res[0]))
	}

	const getDecimals = () => {
		contract.methods
			.decimals()
			.call()
			.then(res => setTokenDecimals(res))
	}

	const getBalances = () => {
		if (account) {
			web3.eth.getBalance(account)
				.then(res => setBalance(web3.utils.fromWei(res)))

			web3.eth.getGasPrice()
				.then(res => setGasFee(web3.utils.fromWei(res, 'ether')))

			contract.methods
				.balanceOf(account)
				.call()
				.then(res => setTokenBalance(tokenAmountFromWei(Number(res), tokenDecimals)))
		}
	}

	const validateForm = () => {
		const isValidAddress = web3.utils.isAddress(destinationAddress)
		const isValidAmount = tokenAmount < tokenBalance && tokenAmount > 0

		if (!isValidAddress) {
			throwError('Enter valid address')
			setShowAlert(true)

		} else if (!isValidAmount) {
			throwError('Enter valid amount')
			setShowAlert(true)

		} else {
			throwError('')
			setShowAlert(false)
			transfer()
		}
	}

	const tokenAmountFromWei = (balance, decimals) => balance / (10 ** decimals)

	const tokenAmountToWei = (amount, decimals) => amount * 10 ** decimals

	const handleSubmit = e => {
		e.preventDefault()
		validateForm()
	}

	const metamaskConnect = async () => {
		if (window.ethereum) {
			try {
				await window.ethereum.request({
					method: 'eth_requestAccounts',
				})
			} catch (e) {
				throwError('There was a problem connecting to MetaMask')
			}
		}
	}

	getAccounts()
	getBalances()
	getDecimals()

	window.ethereum
		.on('accountsChanged', () => getAccounts())

	return (
		<div className='App'>
			<Card style={{ width: '35rem', padding: '1rem' }}>
				<ListGroup className='mb-5'>
					<ListGroup.Item>
						<small><strong>Account is:</strong> {account}</small>
					</ListGroup.Item>
					{/* <ListGroup.Item><strong>Account balance is:</strong> {balance}</ListGroup.Item>*/}
					<ListGroup.Item><strong>Token balance is:</strong> {tokenBalance}</ListGroup.Item>
					{/*<ListGroup.Item><strong>Gas fee is:</strong> {gasFee}</ListGroup.Item>*/}
					{/*<ListGroup.Item><strong>Decimals:</strong> {tokenDecimals}</ListGroup.Item>*/}
				</ListGroup>
				<Form onSubmit={handleSubmit}>
					<Form.Group className='mb-3'>
						<Form.Label>Destination address</Form.Label>
						<Form.Control
							type='text'
							value={destinationAddress}
							onChange={e => setDestinationAddress(e.target.value)}
							required
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label>Amount</Form.Label>
						<Form.Control
							type='number'
							value={tokenAmount}
							onChange={e => setTokenAmount(e.target.value)}
							required
						/>
					</Form.Group>
					<Button
						variant='primary'
						type='submit'
					>
						Send
					</Button>{' '}
					{!account ?
						<Button
							onClick={metamaskConnect}
							variant='dark'
						>
							🦊 Connect Metamask
						</Button> : ''
					}
				</Form>
			</Card>
			<Alert
				style={{ width: '35rem' }}
				show={show}
				className='mt-3'
				variant='warning'
			>
				<small>{validationErrorText}</small>
			</Alert>
		</div>
	)
}

export default SendTokenForm
