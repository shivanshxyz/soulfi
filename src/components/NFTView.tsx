import Image from "next/image";
import React, { useEffect, useState } from "react";

function NFTView(nft) {
  const [nftData, setNftData] = useState(null);
  const [nftName, setNftName] = useState("");
  const [nftImage, setNFTImage] = useState("");
  const [nftSymbol, setNFTSymbol] = useState("");
  var where1, where2;

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
      "https://solana-gateway.moralis.io/nft/devnet/" +
        nft.nft.mint +
        "/metadata",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setNftData(response);
        // setNftName(response.name);
        fetch(response.metaplex.metadataUri)
          .then((response) => response.json())
          .then((response) => {
            setNFTImage(response.image);
            setNftName(response.name);
            setNFTSymbol(response.symbol);
            console.log(response.image);
          });
      })
      .catch((err) => console.error(err));
  }, [where1, where2]);
  return (
    <div className="w-1/4 rounded-lg p-4 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
      {nftData && (
        <div>
          <img src={nftImage} alt={nftData.name} />
          <div className="text-xl font-bold">{nftName}</div>
          <div className="text-xl font-bold">{nftSymbol}</div>
        </div>
      )}
    </div>
  );
}

export default NFTView;
