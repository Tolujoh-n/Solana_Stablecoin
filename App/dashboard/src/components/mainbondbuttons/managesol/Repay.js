import React, { useState } from "react";

const Repay = ({ handleSubmit, onClose }) => {
  const [field1, setField1] = useState("");

  const handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault(); // prevent the default form submission
    handleSubmit(); // call the handleSubmit function passed as prop
  };

  return (
    <div className="maincard">
      <div className="stake">
        <div className="col-md-12 mb-3">
          <form>
            <div className="form-group">
              <label className="css-1owdu0o">
                <div className="css-zkfaav">Staked LP Tokens</div>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0.00"
                value={field1}
                onChange={(e) => setField1(e.target.value)}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <div>
        <h5>Rewards</h5>
        <p>
          <b>SUSD: </b>0.00
        </p>
        <p>
          <b>bSUSD LP APR: </b>0.01%
        </p>
      </div>

      <p>
        Your staked LP tokens will be unstaked from the bSUSD Curve gauge and
        moved into your wallet. Pending rewards will also be claimed and moved
        into your wallet.
      </p>

      <br />
      <button
        style={cancelbut}
        type="button"
        onClick={onClose}
        className="button-style"
      >
        Back
      </button>
      <button style={submitbut} type="submit" onClick={handleFormSubmit} className="button-style">
        Confirm
      </button>
    </div>
  );
};

export default Repay;

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
