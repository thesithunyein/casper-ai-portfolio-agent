#!/usr/bin/env node
/**
 * Automated Casper Testnet Contract Deployment Script
 * Usage: node deploy.js
 * Requires: CSPR_TESTNET_PRIVATE_KEY environment variable
 */

const { CasperClient, Keys, DeployUtil, RuntimeArgs, CLValueBuilder } = require('casper-js-sdk');
const fs = require('fs');
const path = require('path');

const NODE_URL = 'http://188.40.120.12:7777/rpc';
const CHAIN_NAME = 'casper-testnet';
const WASM_PATH = path.join(__dirname, 'target', 'wasm32-unknown-unknown', 'release', 'portfolio_agent_contract.wasm');

async function deploy() {
  const privateKey = process.env.CSPR_TESTNET_PRIVATE_KEY;
  if (!privateKey) {
    console.error('Error: Set CSPR_TESTNET_PRIVATE_KEY environment variable');
    console.error('Get testnet CSPR from: https://testnet.cspr.live/tools/faucet');
    process.exit(1);
  }

  if (!fs.existsSync(WASM_PATH)) {
    console.error('Error: WASM file not found. Run: cargo odra build');
    process.exit(1);
  }

  console.log('Connecting to Casper Testnet...');
  const client = new CasperClient(NODE_URL);

  // Parse private key (ed25519 hex format)
  const privateKeyBytes = Buffer.from(privateKey, 'hex');
  const publicKey = Keys.Ed25519.privateToPublicKey(privateKeyBytes);
  const keyPair = Keys.Ed25519.parseKeyPair(publicKey, privateKeyBytes);

  console.log('Deployer Public Key:', keyPair.accountHex());

  // Load WASM
  const wasmBuffer = fs.readFileSync(WASM_PATH);

  // Create deploy
  const deploy = DeployUtil.makeDeploy(
    new DeployUtil.DeployParams(
      keyPair.publicKey,
      CHAIN_NAME,
      1, // gasPrice
      18000000000, // paymentAmount (18 CSPR in motes)
      null, // ttl
      null  // dependencies
    ),
    DeployUtil.ExecutableDeployItem.newModuleBytes(wasmBuffer, RuntimeArgs.fromMap({})),
    DeployUtil.standardPayment(18000000000)
  );

  // Sign deploy
  DeployUtil.signDeploy(deploy, keyPair);

  // Deploy
  console.log('Deploying smart contract...');
  const deployHash = await client.deploy(deploy);

  console.log('\n✅ Deploy submitted!');
  console.log('Deploy Hash:', deployHash);
  console.log('Explorer URL:', `https://testnet.cspr.live/deploy/${deployHash}`);
  console.log('\nWaiting for deployment (this may take 2-5 minutes)...');

  // Poll for deploy status
  let attempts = 0;
  const maxAttempts = 30;
  const interval = 10000; // 10 seconds

  const checkStatus = setInterval(async () => {
    attempts++;
    try {
      const deployInfo = await client.getDeploy(deployHash);
      if (deployInfo.execution_results && deployInfo.execution_results.length > 0) {
        const result = deployInfo.execution_results[0].result;
        if (result.Success) {
          const contractHash = result.Success.effect.transforms.find(
            (t: any) => t.transform && t.transform.WriteContract
          )?.key;

          console.log('\n🎉 Contract deployed successfully!');
          console.log('Contract Hash:', contractHash);
          console.log('Contract URL:', `https://testnet.cspr.live/contract/${contractHash}`);

          // Save deployment info
          const deploymentInfo = {
            deployHash,
            contractHash,
            deployer: keyPair.accountHex(),
            timestamp: new Date().toISOString(),
            network: CHAIN_NAME,
          };
          fs.writeFileSync(
            path.join(__dirname, 'deployment.json'),
            JSON.stringify(deploymentInfo, null, 2)
          );
          console.log('Deployment info saved to contract/deployment.json');

          clearInterval(checkStatus);
          process.exit(0);
        } else {
          console.log('\n❌ Deploy failed:', result.Failure?.error_message || 'Unknown error');
          clearInterval(checkStatus);
          process.exit(1);
        }
      }
    } catch (err) {
      if (attempts >= maxAttempts) {
        console.log('\n⏱️ Timeout waiting for deploy. Check manually at:');
        console.log(`https://testnet.cspr.live/deploy/${deployHash}`);
        clearInterval(checkStatus);
        process.exit(0);
      }
    }
  }, interval);
}

deploy().catch(console.error);
