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
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.click('button:has-text("Log in")')

      await page.fill('input[type="text"]', 'testuser')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')

      const loginForm = await page.locator('form')
      await expect(loginForm).toBeVisible()
    })
  })

  describe('When logged in', () => {  
    test('a new blog can be created', async ({ page }) => {

        await page.click('button:has-text("Log in")')
        await page.fill('input[type="text"]', 'testuser')
        await page.fill('input[type="password"]', 'testpassword')
        await page.click('button[type="submit"]')
        await page.getByRole('button', { name: 'Add new blog' }).click()
      
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('New Blog Title')
        await textboxes[1].fill('Author Name')
        await textboxes[2].fill('http://newblogurl.com')
        
        await page.click('button#add-blog-button:has-text("add")')
      })
  })
  
})
