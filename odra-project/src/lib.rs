#![cfg_attr(not(test), no_std)]
#![allow(unexpected_cfgs)]
use odra::prelude::*;
use odra::casper_types::U256;

/// PortfolioAgent - Smart contract for AI portfolio analysis and autonomous
/// rebalancing on Casper Network. Supports multi-agent roles, allocation
/// tracking, RWA oracle prices, and yield-aware rebalancing execution.
#[odra::module]
pub struct PortfolioAgent {
    /// Map of wallet public key (hex string) -> latest portfolio analysis
    analyses: Mapping<String, AnalysisResult>,
    /// Map of wallet -> current target allocation (percentages)
    allocations: Mapping<String, Allocation>,
    /// Map of wallet -> rebalancing execution history
    rebalance_history: Mapping<String, Vec<RebalanceRecord>>,
    /// Latest RWA oracle prices posted by the oracle agent
    rwa_prices: Var<RWAOraclePrices>,
    /// Count of total analyses performed
    total_analyses: Var<u64>,
    /// Count of total rebalances executed
    total_rebalances: Var<u64>,
    /// Contract owner (deployer)
    owner: Var<Address>,
    /// Authorized agent addresses (multi-agent: risk, treasury, portfolio)
    authorized_agents: Var<Vec<Address>>,
    /// Yield opportunity registry (protocol -> APY)
    yield_opportunities: Mapping<String, YieldOpportunity>,
}

#[odra::module]
impl PortfolioAgent {
    /// Initialize the contract
    pub fn init(&mut self) {
        self.owner.set(self.env().caller());
        self.total_analyses.set(0);
        self.total_rebalances.set(0);
        self.authorized_agents.set(Vec::new());
    }

    // ── Agent Authorization (Multi-Agent Support) ──

    /// Authorize an agent address to perform actions on behalf of users.
    /// Only the contract owner can authorize new agents.
    pub fn authorize_agent(&mut self, agent: Address) {
        self.assert_owner();
        let mut agents = self.authorized_agents.get_or_default();
        if !agents.contains(&agent) {
            agents.push(agent);
            self.authorized_agents.set(agents);
        }
    }

    /// Revoke an agent's authorization.
    pub fn revoke_agent(&mut self, agent: Address) {
        self.assert_owner();
        let mut agents = self.authorized_agents.get_or_default();
        agents.retain(|a| *a != agent);
        self.authorized_agents.set(agents);
    }

    /// Check if an address is an authorized agent.
    pub fn is_authorized_agent(&self, agent: Address) -> bool {
        self.authorized_agents.get_or_default().contains(&agent)
    }

    // ── Analysis Storage ──

    /// Store a portfolio analysis result on-chain.
    /// Called by the Portfolio Agent after AI analysis.
    pub fn store_analysis(
        &mut self,
        wallet_address: String,
        total_value: U256,
        risk_level: String,
        recommendation_count: u8,
        summary_hash: String,
    ) {
        self.assert_authorized();

        let result = AnalysisResult {
            wallet_address: wallet_address.clone(),
            total_value,
            risk_level: risk_level.clone(),
            recommendation_count,
            summary_hash,
            timestamp: self.env().get_block_time(),
            analyst: self.env().caller(),
        };

        self.analyses.set(&wallet_address, result);

        let count = self.total_analyses.get_or_default();
        self.total_analyses.set(count + 1);
    }

    /// Retrieve analysis for a specific wallet
    pub fn get_analysis(&self, wallet_address: String) -> Option<AnalysisResult> {
        self.analyses.get(&wallet_address)
    }

    /// Check if analysis exists for a wallet
    pub fn has_analysis(&self, wallet_address: String) -> bool {
        self.analyses.get(&wallet_address).is_some()
    }

    /// Get total number of analyses performed
    pub fn get_total_analyses(&self) -> u64 {
        self.total_analyses.get_or_default()
    }

    // ── Allocation Tracking ──

    /// Set the target allocation for a wallet (called by Risk Agent).
    /// Percentages must sum to 100.
    pub fn set_target_allocation(
        &mut self,
        wallet_address: String,
        cspr_pct: u8,
        stablecoin_pct: u8,
        rwa_pct: u8,
        defi_pct: u8,
    ) {
        self.assert_authorized();

        let total = cspr_pct as u16 + stablecoin_pct as u16
            + rwa_pct as u16 + defi_pct as u16;
        if total != 100 {
            self.env().revert(1); // InvalidAllocationSum
        }

        let allocation = Allocation {
            cspr_pct,
            stablecoin_pct,
            rwa_pct,
            defi_pct,
            set_by: self.env().caller(),
            set_at: self.env().get_block_time(),
        };

        self.allocations.set(&wallet_address, allocation);
    }

    /// Get the target allocation for a wallet
    pub fn get_allocation(&self, wallet_address: String) -> Option<Allocation> {
        self.allocations.get(&wallet_address)
    }

    // ── Autonomous Rebalancing Execution ──

    /// Execute a rebalancing action on-chain (called by Treasury Agent).
    /// Records the action with rationale and RWA context.
    pub fn execute_rebalance(
        &mut self,
        wallet_address: String,
        action: String,
        from_asset: String,
        to_asset: String,
        amount: U256,
        rationale: String,
        risk_score: u8,
    ) {
        self.assert_authorized();

        let record = RebalanceRecord {
            action: action.clone(),
            from_asset,
            to_asset,
            amount,
            rationale,
            risk_score,
            rwa_context: self.rwa_prices.get_or_default(),
            timestamp: self.env().get_block_time(),
            executed_by: self.env().caller(),
        };

        let mut history = self.rebalance_history.get(&wallet_address).unwrap_or_default();
        history.push(record);
        self.rebalance_history.set(&wallet_address, history);

        let count = self.total_rebalances.get_or_default();
        self.total_rebalances.set(count + 1);
    }

    /// Get rebalancing history for a wallet
    pub fn get_rebalance_history(
        &self,
        wallet_address: String,
    ) -> Vec<RebalanceRecord> {
        self.rebalance_history.get(&wallet_address).unwrap_or_default()
    }

    /// Get total number of rebalances executed across all wallets
    pub fn get_total_rebalances(&self) -> u64 {
        self.total_rebalances.get_or_default()
    }

    // ── RWA Oracle ──

    /// Post updated RWA oracle prices on-chain (called by Oracle Agent).
    /// These prices are used as context for rebalancing decisions.
    pub fn update_rwa_prices(
        &mut self,
        tbill_yield: U256,
        paxg_price: U256,
        ondo_price: U256,
        cspr_price: U256,
    ) {
        self.assert_authorized();

        let prices = RWAOraclePrices {
            tbill_yield_basis_points: tbill_yield,
            paxg_price_cents: paxg_price,
            ondo_price_cents: ondo_price,
            cspr_price_cents: cspr_price,
            updated_by: self.env().caller(),
            updated_at: self.env().get_block_time(),
        };

        self.rwa_prices.set(prices);
    }

    /// Get the latest RWA oracle prices
    pub fn get_rwa_prices(&self) -> Option<RWAOraclePrices> {
        self.rwa_prices.get()
    }

    // ── Yield Opportunity Registry ──

    /// Register a yield opportunity (called by Yield Routing Agent).
    /// protocol_name is e.g. "cspr.trade", "Abyss", "DeFiBox"
    pub fn register_yield_opportunity(
        &mut self,
        protocol_name: String,
        apy_basis_points: u16,
        tvl_cents: U256,
        risk_level: String,
    ) {
        self.assert_authorized();

        let opp = YieldOpportunity {
            protocol_name: protocol_name.clone(),
            apy_basis_points,
            tvl_cents,
            risk_level,
            registered_by: self.env().caller(),
            registered_at: self.env().get_block_time(),
        };

        self.yield_opportunities.set(&protocol_name, opp);
    }

    /// Get a yield opportunity by protocol name
    pub fn get_yield_opportunity(&self, protocol_name: String) -> Option<YieldOpportunity> {
        self.yield_opportunities.get(&protocol_name)
    }

    // ── Admin ──

    /// Get contract owner
    pub fn get_owner(&self) -> Address {
        self.owner.get().expect("owner not initialized")
    }

    /// Get list of authorized agents
    pub fn get_authorized_agents(&self) -> Vec<Address> {
        self.authorized_agents.get_or_default()
    }
}

// ── Internal helpers ──

impl PortfolioAgent {
    fn assert_owner(&self) {
        let owner = self.owner.get().expect("owner not initialized");
        if self.env().caller() != owner {
            self.env().revert(10); // UnauthorizedOwner
        }
    }

    fn assert_authorized(&self) {
        let owner = self.owner.get().expect("owner not initialized");
        let caller = self.env().caller();
        if caller == owner {
            return;
        }
        let agents = self.authorized_agents.get_or_default();
        if !agents.contains(&caller) {
            self.env().revert(11); // UnauthorizedAgent
        }
    }
}

// ── Data Types ──

/// Represents a portfolio analysis stored on-chain
#[odra::odra_type]
pub struct AnalysisResult {
    pub wallet_address: String,
    pub total_value: U256,
    pub risk_level: String,
    pub recommendation_count: u8,
    pub summary_hash: String,
    pub timestamp: u64,
    pub analyst: Address,
}

/// Target allocation for a wallet (percentages, sum = 100)
#[odra::odra_type]
pub struct Allocation {
    pub cspr_pct: u8,
    pub stablecoin_pct: u8,
    pub rwa_pct: u8,
    pub defi_pct: u8,
    pub set_by: Address,
    pub set_at: u64,
}

/// Record of a rebalancing execution
#[odra::odra_type]
pub struct RebalanceRecord {
    pub action: String,
    pub from_asset: String,
    pub to_asset: String,
    pub amount: U256,
    pub rationale: String,
    pub risk_score: u8,
    pub rwa_context: RWAOraclePrices,
    pub timestamp: u64,
    pub executed_by: Address,
}

/// RWA oracle prices posted on-chain
#[odra::odra_type]
pub struct RWAOraclePrices {
    /// T-bill yield in basis points (e.g. 450 = 4.50%)
    pub tbill_yield_basis_points: U256,
    /// PAXG price in cents
    pub paxg_price_cents: U256,
    /// ONDO price in cents
    pub ondo_price_cents: U256,
    /// CSPR price in cents
    pub cspr_price_cents: U256,
    pub updated_by: Address,
    pub updated_at: u64,
}

/// Yield opportunity in a DeFi protocol
#[odra::odra_type]
pub struct YieldOpportunity {
    pub protocol_name: String,
    /// APY in basis points (e.g. 850 = 8.50%)
    pub apy_basis_points: u16,
    /// TVL in cents
    pub tvl_cents: U256,
    pub risk_level: String,
    pub registered_by: Address,
    pub registered_at: u64,
}
