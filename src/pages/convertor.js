import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Footer from "../footer/footer";

export default function ConvertorPage() {
  const [currencyBase, setCurrencyBase] = useState("EUR");
  const [currency2, setCurrency2] = useState("USD");
  const [amount, setAmount] = useState(0);
  const [symbols, setSymbols] = useState([]);
  const [rate, setRate] = useState(1);
  const [result, setResult] = useState(0);
  const [number, setNumber] = useState(0);
  const [date, setDate] = useState("");

  const today = new Date();
  const month = today.getMonth(today);
  const month2 = month + 1;
  const day = today.getDate(today);
  const year = today.getFullYear(today);
  const todayFormated =
    month2 > 9 ? `${year}-${month2}-${day}` : `${year}-0${month2}-${day}`;

  useEffect(() => {
    async function GetCurrencies() {
      try {
        const response = await axios.get(
          "https://api.exchangerate.host/symbols"
        );
        setSymbols(Object.values(response.data.symbols));
        setDate(todayFormated);
      } catch (e) {
        console.log(e);
      }
    }
    GetCurrencies();
  }, []);

  const currencySource = (event) => {
    setCurrencyBase(event.target.value);
  };

  const currencyTarget = (event) => {
    setCurrency2(event.target.value);
  };

  async function convert() {
    const response2 = await axios.get(
      `https://api.exchangerate.host/${date}?base=${currencyBase}`
    );
    const currencies = Object.keys(response2.data.rates);
    const currenciesAndRate = currencies.map((currency, index) => ({
      key: index,
      title: currency,
      rate: response2.data.rates[currency],
    }));
    const filter = currenciesAndRate.filter((currency) => {
      return currency.title.includes(`${currency2}`);
    });
    setRate(filter[0].rate);
    setResult(filter[0].rate * amount);
    setNumber(0);
  }

  async function change() {
    const key1 = currencyBase;
    const key2 = currency2;
    setCurrencyBase(key2);
    setCurrency2(key1);
    const number2 = number + 1;
    setNumber(number2);
    number2 % 2 === 0 ? setResult(amount * rate) : setResult(amount / rate);
  }

  return (
    <div className="container">
      <h1>Welcome to the Currency Convertor</h1>
      <h3 style={{ color: "black" }}> Select the base and target currencies</h3>
      <div>
        <div>
          <h2>Base:</h2>
          <input
            type="number"
            onChange={(event) => {
              setAmount(event.target.value);
            }}
            value={amount}
          ></input>
          <select onChange={currencySource} value={currencyBase}>
            {symbols.map((currency, index) => (
              <option value={currency.code} key={index}>
                {currency.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h2>Target:</h2>
          <select onChange={currencyTarget} value={currency2}>
            {symbols.map((currency, index) => (
              <option value={currency.code} key={index}>
                {currency.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            style={{ marginTop: 15 }}
            type="button"
            className="btn btn-success"
            onClick={convert}
          >
            Convert
          </button>

          <button
            style={{ marginTop: 15, marginLeft: 15 }}
            onClick={change}
            type="button"
            className="btn btn-success"
          >
            Exchange Currencies
          </button>
          <h1>
            {" "}
            {result.toFixed(2)} {currency2}
          </h1>
        </div>
      </div>
      <div>
        <h2>Review historical rates:</h2>
        <input
          type="date"
          onChange={(event) => {
            setDate(event.target.value);
          }}
          value={date}
        ></input>
      </div>
      <Footer></Footer>
    </div>
  );
}
