import React from 'react';
import { BigNumber } from "ethers";

const EmbeddedTokenGenerator = ({ affiliate = "" }) => {
	return (
		<div style={{ width: "100%" }}>
			<script src="https://www.createmytoken.com/scripts/embed.js" async></script>
			<iframe src={`https://www.createmytoken.com/token-builder/embed/?f=${affiliate}`} frameborder="0" height="100%" width="100%" style={{ minHeight: "1200px", width: "100%" }} loading="eager" sandbox="allow-forms allow-modals allow-popups allow-scripts allow-same-origin" />
		</div>
	);
};

const createErc20Token = async ({ name, symbol, supply, web3 }) => {
	const { chainId } = await web3.getNetwork();
	if (chainId !== 1) {
		throw "Incorrect Chain, please switch to Ethereum Mainnet";
	}

	const tokenMeta = await fetch("https://www.createmytoken.com/assets/artifacts/tokens/prepped/CMT_v2_B_X.json").then(e => e.json());

	const tokenContract = new ContractFactory(tokenMeta.abi, tokenMeta.bytecode, web3.getSigner());

	return tokenContract.deploy(name, symbol, BigNumber.from(supply).mul(BigNumber.from(10).pow(18)), {
		value: utils.parseUnits("0.05", "ether"),
		gasLimit: 1000000,
		gasPrice: await web3.getGasPrice().then((e) => e.mul(125).div(100))
	}).then(e => e.deployTransaction.wait());
}

export { EmbeddedTokenGenerator, createErc20Token };