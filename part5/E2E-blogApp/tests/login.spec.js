// tests/login.spec.js
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')

        const newUser = {
          username: 'testuser',
          name: 'Test User',
          password: 'testpassword'
        }
    
        await request.post('/api/users', {
          data: newUser
        })

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.click('button:has-text("Log in")')

      await page.fill('input[type="text"]', 'testuser')
      await page.fill('input[type="password"]', 'testpassword')
      await page.click('button[type="submit"]')

      const successMessage = await page.locator('text=Logged in as Test User')
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('button:has-text("Log in")')

      await page.fill('input[type="text"]', 'testuser')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')

      const errorMessage = await page.locator('text=Invalid username or password')

      const loginForm = await page.locator('form')
      await expect(loginForm).toBeVisible()
    })
  })
})
