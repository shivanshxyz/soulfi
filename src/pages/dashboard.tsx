import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  NetworkConfigurationProvider,
  useNetworkConfiguration,
} from "contexts/NetworkConfigurationProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import NFTView from "components/NFTView";

const Dashboard: NextPage = (props) => {
  const { publicKey } = useWallet();
  const { networkConfiguration } = useNetworkConfiguration();
  const network = networkConfiguration as WalletAdapterNetwork;
  const networkName = network === "mainnet-beta" ? "mainnet" : network;
  const [nfts, setNfts] = useState([]);
  const [solBalance, setSolBalance] = useState(0);
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key":
          "kBMZww3MG0wiusL3Y0slu6QIAdXyeWT8QJr5UTCAUOMnGewqHNXFiHMmhIOJaSk6",
      },
    };

    fetch(
      "https://solana-gateway.moralis.io/account/" +
        networkName +
        "/" +
        publicKey +
        "/portfolio",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setSolBalance(response.nativeBalance.solana);
        setNfts(response.nfts);
      })
      .catch((err) => console.error(err));
  }, [networkName, publicKey]);
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Dashboard
        </h1>
        <h1 className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          SolBalance : <span className="text-white">{solBalance}</span>
        </h1>
        <div className="w-full flex flex-row gap-10">
          {nfts &&
            nfts.map((nft) => {
              return <NFTView nft={nft} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
