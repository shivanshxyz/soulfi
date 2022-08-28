import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, Transaction } from "@solana/web3.js";
import type { NextPage } from "next";
import { getOrca, OrcaFarmConfig, OrcaPoolConfig, Network } from "@orca-so/sdk";
import Head from "next/head";
import Decimal from "decimal.js";
import { notify } from "utils/notifications";
import { useState } from "react";

const Swap: NextPage = (props) => {
  const { connection } = useConnection();
  const orcaConnection = new Connection("https://api.mainnet-beta.solana.com");
  const { publicKey, sendTransaction } = useWallet();
  const orca = getOrca(orcaConnection);
  const [optionVal, setOptionVal] = useState(null);
  const [swapAmount, setSwapAmount] = useState(null);
  const handleChange = (e) => {
    setOptionVal(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = async () => {
    console.log(optionVal);
    console.log(swapAmount);
    const pool = orca.getPool(optionVal);
    const secondToken = pool.getTokenB();
    const amount = new Decimal(swapAmount);
    const quote = await pool.getQuote(secondToken, amount);
    const firstTokenAmount = quote.getMinOutputAmount();
    console.log(
      `Swap ${amount.toString()} SOL for at least ${firstTokenAmount.toNumber()} ORCA`
    );
    const swapPayLoad = await pool.swap(
      publicKey,
      secondToken,
      amount,
      firstTokenAmount
    );
    const transaction = new Transaction().add(swapPayLoad.transaction);
    const signature = await sendTransaction(transaction, connection);
    console.log(transaction);
    console.log(signature);
    await connection.confirmTransaction(signature, "confirmed");
    notify({
      type: "success",
      message: "Transaction successful!",
      txid: signature,
    });
  };

  async function handleClick() {
    try {
      // 3. We will be swapping 0.1 SOL for some ORCA
      const orcaSolPool = orca.getPool(OrcaPoolConfig.ORCA_SOL);
      const solToken = orcaSolPool.getTokenB();
      const solAmount = new Decimal(1);
      const quote = await orcaSolPool.getQuote(solToken, solAmount);
      const orcaAmount = quote.getMinOutputAmount();

      console.log(
        `Swap ${solAmount.toString()} SOL for at least ${orcaAmount.toNumber()} ORCA`
      );
      const swapPayLoad = await orcaSolPool.swap(
        publicKey,
        solToken,
        solAmount,
        orcaAmount
      );
      console.log(swapPayLoad);
      const transaction = new Transaction().add(swapPayLoad.transaction);
      const signature = await sendTransaction(transaction, connection);
      console.log(transaction);
      console.log(signature);
      await connection.confirmTransaction(signature, "confirmed");
      notify({
        type: "success",
        message: "Transaction successful!",
        txid: signature,
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Swap
        </h1>
        {/* <button onClick={handleClick}>something</button> */}
        <div className="text-center text-xl text-transparent bg-black flex flex-col gap-3 px-10 py-2 rounded-xl mx-10 mt-10 gap-5">
          <div className="flex flex-row gap-10 justify-center items-center mb-10">
            <h3 className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
              powered by:
            </h3>
            <img src="./orca.png" alt="orca" className="w-28" />
          </div>
          <input
            type="number"
            placeholder="amount"
            onChange={(e) => setSwapAmount(e.target.value)}
            className="bg-gray-900 text-white"
          />
          <select
            title="chain"
            className="bg-gray-900 text-white"
            value={optionVal}
            onChange={handleChange}
          >
            {Object.entries(OrcaPoolConfig).map(([key, value]) => {
              return (
                <option key={key} className="text-white" value={value}>
                  {key.split("_")[0]} --&gt; {key.split("_")[1]}
                </option>
              );
            })}
          </select>
        <button onClick={handleSubmit} className="text-white bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Submit
        </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
