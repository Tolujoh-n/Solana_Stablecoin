import React, { useState } from "react";

const DEPOSIT2 = ({ handleSubmit, onClose }) => {
  const [selectedOption, setSelectedOption] = useState("option3");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFormSubmit = (e) => {
    console.log("handleFormSubmit");
    e.preventDefault(); // prevent the default form submission
    handleSubmit(); // call the handleSubmit function passed as prop
  };

  const [field1, setField1] = useState("");

  return (
    <div className="maincard">
      <div className="stake">
        <div className="col-md-12 mb-3">
          <form>
            <div className="form-group">
              <label className="css-1owdu0o">
                <div className="css-zkfaav">Burn LP Tokens</div>
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

      <div className="radio-form-container">
        <form className="radio-form">
          <div className="radio-item">
            <input
              type="radio"
              id="radio1"
              name="radio-option"
              value="option1"
              checked={selectedOption === "option1"}
              onChange={handleOptionChange}
            />
            <label htmlFor="radio1">bSUSD</label>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              id="radio2"
              name="radio-option"
              value="option2"
              checked={selectedOption === "option2"}
              onChange={handleOptionChange}
            />
            <label htmlFor="radio2">SUSD</label>
          </div>
          <div className="radio-item">
            <input
              type="radio"
              id="radio3"
              name="radio-option"
              value="option3"
              checked={selectedOption === "option3"}
              onChange={handleOptionChange}
            />
            <label htmlFor="radio3">Both</label>
          </div>
        </form>

        {/* Paragraphs to be shown based on radio selection */}
        <div className="paragraph-container">
          {selectedOption === "option1" && (
            <p>
              <b>Deposit: </b>0.00 bSUSD
            </p>
          )}
          {selectedOption === "option2" && (
            <p>
              <b>Deposit: </b>0.00 SUSD
            </p>
          )}
          {selectedOption === "option3" && (
            <p>
              {" "}
              <b>Deposit: </b>0.00 bSUSD + 0.00 SUSD(default).
            </p>
          )}
        </div>
      </div>

      <details>
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
      </details>

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
        Approve
      </button>
    </div>
  );
};

export default DEPOSIT2;

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
