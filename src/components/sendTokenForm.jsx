import React, { useState } from 'react';
import useWeb3 from '../hooks/useWeb3';
import useFormValidation from '../hooks/useFormValidation';
import { AccountInfo, SendTokenFormUI } from './FormComponents';
import abi from '../ABI.json';

const SendTokenForm = () => {
    const tokenAddress = '0xE72c69b02B4B134fb092d0D083B287cf595ED1E6';
    const {
        account,
        tokenBalance,
        tokenDecimals,
        tokenAmountToWei,
        contract,
        web3,
        getAccounts
    } = useWeb3(abi, tokenAddress);

    const [tokenAmount, setTokenAmount] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [validationErrorText, setValidationErrorText] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const transfer = async () => {
        try {
            const result = await contract.methods
                .transfer(destinationAddress, tokenAmountToWei(tokenAmount, tokenDecimals))
                .send({ from: account });
            setValidationErrorText(`Success! Your transaction hash is ${result.transactionHash}`);
            setShowAlert(true);
        } catch (error) {
            setValidationErrorText(error.message);
            setShowAlert(true);
        }
    };

    const {
        validationErrorText: validationError,
        showAlert: alert,
        validateForm
    } = useFormValidation(web3, tokenBalance, tokenAmount, destinationAddress, transfer);

    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm();
    };

    const metamaskConnect = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                getAccounts();
            } catch (error) {
                setValidationErrorText('There was a problem connecting to MetaMask');
                setShowAlert(true);
            }
        }
    };

    return (
        <div className='App'>
            <AccountInfo account={account} tokenBalance={tokenBalance} />
            <SendTokenFormUI
                handleSubmit={handleSubmit}
                destinationAddress={destinationAddress}
                setDestinationAddress={setDestinationAddress}
                tokenAmount={tokenAmount}
                setTokenAmount={setTokenAmount}
                account={account}
                metamaskConnect={metamaskConnect}
                validationErrorText={validationError}
                showAlert={alert}
            />
        </div>
    );
};

export default SendTokenForm;
