import React, { useState } from "react";

const Deposit = ({ handleSubmit, onClose }) => {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault(); // prevent the default form submission
    handleSubmit(); // call the handleSubmit function passed as prop
  };

  return (
    <div className="maincard">
      {/* <div className="stake">
        <div className="col-md-12 mb-3">
          <form>
            <div className="form-group">
              <label className="css-1owdu0o">
                <div className="css-zkfaav">bSUSD Amount</div>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00 bSUSD"
                value={field1}
                onChange={(e) => setField1(e.target.value)}
                required
              />

              <label className="css-1owdu0o">
                <div className="css-zkfaav">SUSD Amount</div>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00 SUSD"
                value={field2}
                onChange={(e) => setField2(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
      </div> */}

      {/* <div>
        <p>
          <b>Mint SOLT tokens: </b>0.00
        </p>
      </div> */}

      {/* <div>
        <input type="checkbox" id="red" name="deposit" value="red" checked />
        <label for="red">Deposit tokens in a balanced ratio</label>
      </div>
      <div>
        <input type="checkbox" id="blue" name="stake" value="blue" checked />
        <label for="blue">Stake SOLT tokens in Curve gauge</label>
      </div> */}

      {/* <details>
        <summary id="pooldetails">POOL DETAILS</summary>
        <div>
          <p>
            <b>Pool Balance: </b>1,589,847.51 bSUSD + 1,528,904.65 SUSD-3CRV
          </p>
          <p>
            <b>Pool Balance Ratio: </b>1 bSUSD : 0.96 SUSD-3CRV
          </p>
          <p>
            <b>LP Token Supply: </b>1,556,971.29
          </p>
          <p>
            <b>bSUSD Price: </b>1.16 SUSD
          </p>
          <p>
            <b>bSUSD LP APR: </b>0.01%
          </p>
        </div>
      </details> */}

      <br />
      <button
        style={cancelbut}
        type="button"
        onClick={onClose}
        className="button-style"
      >
        Cancel
      </button>
      <button style={submitbut} type="submit" className="button-style" onClick={handleFormSubmit}> 
        Confirm
      </button>
    </div>
  );
};

export default Deposit;

const cancelbut = {
  /* Your button style here */
  padding: "8px 12px",
  backgroundColor: "rgb(129, 128, 125)",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "10px",
  marginRight: "8px",
};

const submitbut = {
  /* Your button style here */
  padding: "8px 12px",
  backgroundColor: "rgb(79, 209, 226)",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  margin: "10px",
  marginRight: "8px",
};
