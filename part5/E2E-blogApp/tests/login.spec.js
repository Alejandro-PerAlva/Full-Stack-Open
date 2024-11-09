// tests/login.spec.js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown by default', async ({ page }) => {

    await page.click('button:has-text("Log in")')

    const loginForm = await page.locator('form')
    await expect(loginForm).toBeVisible()

    const usernameInput = await page.locator('input[type="text"]')
    const passwordInput = await page.locator('input[type="password"]')

    await expect(usernameInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })
})
