import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage with brand hero', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CasperAgent', exact: true })).toBeVisible()
    await expect(
      page.getByText('Autonomous portfolio analysis with x402 settle and on-chain proof.')
    ).toBeVisible()
  })

  test('should display live testnet badge', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByText('Live on Casper Testnet', { exact: true })
    ).toBeVisible()
  })

  test('should have Connect & Analyze and Try demo', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Connect & Analyze' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Try demo' })).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/')
    const navButtons = page.locator('nav button')
    await expect(navButtons.first()).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')
    // Logo is first nav button; theme toggle is second
    await page.locator('nav button').nth(1).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })
})

test.describe('Mobile Layout', () => {
  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'CasperAgent', exact: true })).toBeVisible()
  })

  test('theme toggle should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('nav button').nth(1)).toBeVisible()
  })

  test('Connect & Analyze should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Connect & Analyze' })).toBeVisible()
  })
})
