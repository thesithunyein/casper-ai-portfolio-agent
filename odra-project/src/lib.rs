#![cfg_attr(not(test), no_std)]
use odra::prelude::*;
use odra::casper_types::U256;

/// PortfolioAgent - Smart contract for storing AI portfolio analysis on Casper
/// This demonstrates agentic AI with on-chain data persistence
#[odra::module]
pub struct PortfolioAgent {
    /// Map of wallet address -> portfolio analysis result
    analyses: Mapping<Address, AnalysisResult>,
    /// Count of total analyses performed
    total_analyses: Var<u64>,
    /// Contract owner
    owner: Var<Address>,
}

#[odra::module]
impl PortfolioAgent {
    /// Initialize the contract
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
        self.total_analyses.set(0);
    }

    /// Store a portfolio analysis result on-chain
    /// This is called by the AI agent after analysis
    pub fn store_analysis(
        &mut self,
        wallet_address: Address,
        total_value: U256,
        risk_level: String,
        recommendation_count: u8,
        summary_hash: String,  // IPFS or content hash of full analysis
    ) {
        let result = AnalysisResult {
            wallet_address: wallet_address.clone(),
            total_value,
            risk_level,
            recommendation_count,
            summary_hash,
            timestamp: self.env().block_time(),
            analyst: self.env().caller(),
        };

        self.analyses.set(&wallet_address, result);
        
        let count = self.total_analyses.get_or_default();
        self.total_analyses.set(count + 1);
    }

    /// Retrieve analysis for a specific wallet
    pub fn get_analysis(&self, wallet_address: Address) -> Option<AnalysisResult> {
        self.analyses.get(&wallet_address)
    }

    /// Check if analysis exists for a wallet
    pub fn has_analysis(&self, wallet_address: Address) -> bool {
        self.analyses.get(&wallet_address).is_some()
    }

    /// Get total number of analyses performed
    pub fn get_total_analyses(&self) -> u64 {
        self.total_analyses.get_or_default()
    }

    /// Get contract owner
    pub fn get_owner(&self) -> Address {
        self.owner.get_or_default()
    }
}

/// Represents a portfolio analysis stored on-chain
#[odra::odra_type]
pub struct AnalysisResult {
    pub wallet_address: Address,
    pub total_value: U256,
    pub risk_level: String,
    pub recommendation_count: u8,
    pub summary_hash: String,
    pub timestamp: u64,
    pub analyst: Address,
}
