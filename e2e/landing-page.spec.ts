import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load homepage with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Autonomous portfolio management')).toBeVisible()
  })

  test('should display live testnet badge', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByText('Live on Casper Testnet', { exact: true })
    ).toBeVisible()
  })

  test('should have working nav links', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) {
      // Nav links are hidden on mobile (hidden sm:block)
      await expect(page.locator('a[href="#features"]')).toBeHidden()
    } else {
      await expect(page.locator('a[href="#features"]')).toBeVisible()
      await expect(page.locator('a[href="#how-it-works"]')).toBeVisible()
      await expect(page.locator('a[href="#roadmap"]')).toBeVisible()
    }
  })

  test('should have Connect button', async ({ page }) => {
    await page.goto('/')
    const connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/')
    const themeBtn = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' }).first()
    // Theme toggle is the button with Sun/Moon icon in the nav
    const navButtons = page.locator('nav button')
    await expect(navButtons.first()).toBeVisible()
  })

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/')
    // Click the first button in nav (theme toggle)
    const navButton = page.locator('nav button').first()
    await navButton.click()
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
    const navButton = page.locator('nav button').first()
    await expect(navButton).toBeVisible()
  })

  test('Connect button should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    const connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })
})
