import { useState } from 'react';

const useFormValidation = (web3, tokenBalance, tokenAmount, destinationAddress, transfer) => {
    const [validationErrorText, setValidationErrorText] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const validateForm = () => {
        const isValidAddress = web3.utils.isAddress(destinationAddress);
        const isValidAmount = tokenAmount < tokenBalance && tokenAmount > 0;

        if (!isValidAddress) {
            setValidationErrorText('Enter valid address');
            setShowAlert(true);
        } else if (!isValidAmount) {
            setValidationErrorText('Enter valid amount');
            setShowAlert(true);
        } else {
            setValidationErrorText('');
            setShowAlert(false);
            transfer();
        }
    };

    return {
        validationErrorText,
        showAlert,
        validateForm
    };
};

export default useFormValidation;