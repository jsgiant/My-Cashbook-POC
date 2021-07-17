import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import './App.css';

function App() {

  const [shouldShowModel,setShouldShowModel] = useState(false);
  const [amount,setAmount] = useState("");
  const [type,setType] = useState(1);
  const [note,setNote] = useState("");
  const [transactions,setTransactions] = useState([])
  const [isButtonDisabled,setIsButtonDisabled] = useState(true);

  useEffect(()=>{
    getTransactions()
  },[])

  const getTransactions = () => {
    fetch('/entry')
    .then(response => response.json())
    .then(data => setTransactions(data));
  }

  const postTransaction = () => {
     const requestObject ={
      note,
      amount,
      type,
      timestamp: Date.now()
      }
    fetch('/entry',
    { method: 'POST',body:JSON.stringify(requestObject)})
    .then(_ => getTransactions())
  }

  const closeModel = () => {
    setShouldShowModel(false);
  }

  const handleCashInClick = () => {
    setType(1);
    setShouldShowModel(true);
  }

  const handleCashOutClick = () => {
    setType(2);
    setShouldShowModel(true);
  }

  const setButtonDisabled = () => {
    setIsButtonDisabled(!(amount !== "" && note !== ""))
  }

  const handleOnChangeAmount = (event) => {
    setAmount(event.target.value);
    setButtonDisabled()
  }

  const handleOnChangeNote = (event) => {
    setNote(event.target.value);
    setButtonDisabled()
  }

  const handleEntrySubmit = () => {
      postTransaction();
      setShouldShowModel(false);
  }

  const renderTransaction = (transaction) => {
    const {timestamp,note,amount,type} = transaction;
    return (
      <div className="transaction" id={timestamp}>
        <div className="entry">
          <Moment date={timestamp} />
          <p>{note}</p>
        </div>
              <div className="entry out">
                <p>Out</p>
                <p>{type == 2 ? amount : +"-"}</p>
              </div>
              <div className="entry in">
                <p>In</p>
                <p>{type == 1 ? amount : +"-"}</p>
              </div>
      </div>
    )
  }

  const renderModel = () => {
    return (
      <div className="model">
        <div className="model-content">
          <button className="close-btn" onClick={closeModel}>Close</button>
          <p>New Entry</p>
          <input type="number" placeholder ="INR 0.00" onChange={handleOnChangeAmount} value={amount} data-testid="amount"/>
          <textarea placeholder="Enter note" onChange={handleOnChangeNote} value={note} data-testid="note"></textarea>
          {
            type == 1?
            <button disabled={isButtonDisabled} className="green-btn" onClick={handleEntrySubmit} data-testid="create-entry-btn">IN</button>
            : <button disabled={isButtonDisabled} className="red-btn" onClick={handleEntrySubmit} data-testid="create-entry-btn">OUT</button> 
          }
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="header">
        <h1>My Cashbook</h1>
        <div className="today-balance">
          <h1 data-testid="balance">0 INR</h1>
          <p>Today's Balance</p>
        </div>
      </header>
      <div className="transactions-list">
             {transactions.length ? 
              transactions.map(transaction=> renderTransaction(transaction))
              : <p>No Entry Found!</p>}
      </div>

      <div className="action-group">
          <button className="green" onClick={handleCashInClick} data-testid="cashout-btn">IN</button>
          <button className="red" onClick={handleCashOutClick} data-testid="cashin-btn">OUT</button>
      </div>
      {shouldShowModel && renderModel()}
    </div>
  );
}

export default App;
