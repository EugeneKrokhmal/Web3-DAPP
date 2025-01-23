import React from 'react';
import { Button, Form, Card, Alert, ListGroup } from 'react-bootstrap';

export const AccountInfo = ({ account, tokenBalance }) => (
    <ListGroup className='mb-5'>
        <ListGroup.Item>
            <small><strong>Account is:</strong> {account}</small>
        </ListGroup.Item>
        <ListGroup.Item><strong>Token balance is:</strong> {tokenBalance}</ListGroup.Item>
    </ListGroup>
);

export const SendTokenFormUI = ({ handleSubmit, destinationAddress, setDestinationAddress, tokenAmount, setTokenAmount, account, metamaskConnect, validationErrorText, showAlert }) => (
    <Card style={{ width: '35rem', padding: '1rem' }}>
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
            <Button variant='primary' type='submit'>
                Send
            </Button>{' '}
            {!account && (
                <Button onClick={metamaskConnect} variant='dark'>
                    🦊 Connect Metamask
                </Button>
            )}
        </Form>
        <Alert style={{ width: '35rem' }} show={showAlert} className='mt-3' variant='warning'>
            <small>{validationErrorText}</small>
        </Alert>
    </Card>
);