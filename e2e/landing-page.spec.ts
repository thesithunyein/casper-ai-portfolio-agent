import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Autonomous portfolio management')).toBeVisible()
  })

  test('should display buildathon badge', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Casper Agentic Buildathon 2026')).toBeVisible()
  })

  test('should have working nav links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Features').first()).toBeVisible()
    await expect(page.locator('text=How It Works').first()).toBeVisible()
    await expect(page.locator('text=Roadmap').first()).toBeVisible()
  })

  test('should have Connect button', async ({ page }) => {
    await page.goto('/')
    const connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/')
    const themeBtn = page.locator('button[aria-label="Toggle theme"]')
    await expect(themeBtn).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')
    const themeBtn = page.locator('button[aria-label="Toggle theme"]')
    await themeBtn.click()
    // After clicking, the html should have dark class
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('should display token ticker bar', async ({ page }) => {
    await page.goto('/')
    // Token ticker should be visible below nav
    const ticker = page.locator('[class*="overflow-hidden"]').first()
    await expect(ticker).toBeVisible()
  })

  test('should scroll to wallet section on Connect click', async ({ page }) => {
    await page.goto('/')
    await page.locator('button:has-text("Connect")').click()
    await page.waitForTimeout(1000)
    const walletSection = page.locator('#wallet-section')
    await expect(walletSection).toBeVisible()
  })
})

test.describe('Mobile Layout', () => {
  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    // Nav links should be hidden on mobile
    const navLinks = page.locator('a[href="#features"]')
    await expect(navLinks).toBeHidden()
  })

  test('theme toggle should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const themeBtn = page.locator('button[aria-label="Toggle theme"]')
    await expect(themeBtn).toBeVisible()
  })

  test('Connect button should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })
})
