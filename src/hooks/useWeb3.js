import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';

const useWeb3 = (abi, tokenAddress) => {
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [tokenBalance, setTokenBalance] = useState('');
    const [tokenDecimals, setTokenDecimals] = useState('');
    const [gasFee, setGasFee] = useState('');
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(abi, tokenAddress);

    const tokenAmountFromWei = (balance, decimals) => balance / (10 ** decimals);
    const tokenAmountToWei = (amount, decimals) => amount * 10 ** decimals;

    const getAccounts = useCallback(async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    }, [web3]);

    const getDecimals = useCallback(async () => {
        const decimals = await contract.methods.decimals().call();
        setTokenDecimals(decimals);
    }, [contract.methods]);

    const getBalances = useCallback(async () => {
        if (account) {
            const ethBalance = await web3.eth.getBalance(account);
            setBalance(web3.utils.fromWei(ethBalance));

            const gasPrice = await web3.eth.getGasPrice();
            setGasFee(web3.utils.fromWei(gasPrice, 'ether'));

            const tokenBal = await contract.methods.balanceOf(account).call();
            setTokenBalance(tokenAmountFromWei(Number(tokenBal), tokenDecimals));
        }
    }, [account, contract.methods, tokenDecimals, web3.eth]);

    useEffect(() => {
        getAccounts();
        getDecimals();
    }, [getAccounts, getDecimals]);

    useEffect(() => {
        getBalances();
    }, [account, getBalances]);

    useEffect(() => {
        window.ethereum?.on('accountsChanged', getAccounts);
        return () => {
            window.ethereum?.removeListener('accountsChanged', getAccounts);
        };
    }, [getAccounts]);

    return {
        account,
        balance,
        tokenBalance,
        tokenDecimals,
        gasFee,
        tokenAmountToWei,
        contract,
        web3,
        getAccounts
    };
};

export default useWeb3;