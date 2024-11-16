// tests/login.spec.js
const { test, expect, beforeEach, describe, afterAll } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')

        const newUser = {
          username: 'testuser',
          name: 'Test User',
          password: 'testpassword'
        }

        const otherUser = {
          username: 'otheruser',
          name: 'Test User',
          password: 'otherpassword'
        }
    
        await request.post('/api/users', {
          data: newUser
        })

        await request.post('/api/users', {
          data: otherUser
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
    test('pass with correct credentials', async ({ page }) => {
        await page.getByRole('button', { name: 'Log in' }).click()
        const loginboxes = await page.getByRole('textbox').all()
        await loginboxes[0].fill('testuser')
        await loginboxes[1].fill('testpassword')
        await page.getByRole('button', { name: 'login' }).click()
  
        const loginForm = await page.locator('form')
        await expect(loginForm).not.toBeVisible()
      })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'Log in' }).click()
        const loginboxes = await page.getByRole('textbox').all()
        await loginboxes[0].fill('abc')
        await loginboxes[1].fill('abc')
        await page.getByRole('button', { name: 'login' }).click()

      const loginForm = await page.locator('form')
      await expect(loginForm).toBeVisible()
    })
  })

  describe('When logged in', () => { 
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

        await page.getByRole('button', { name: 'Log in' }).click()
        const loginboxes = await page.getByRole('textbox').all()
        await loginboxes[0].fill('testuser')
        await loginboxes[1].fill('testpassword')
        await page.getByRole('button', { name: 'login' }).click()
   
      })
    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'New blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('New Blog Title')
        await textboxes[1].fill('Author Name')
        await textboxes[2].fill('http://newblogurl.com')
        await page.getByRole('button', { name: 'add' }).click()

        await expect(page.getByText('New Blog Title Author Name')).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {

        await page.getByRole('button', { name: 'New blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Test Blog Title')
        await textboxes[1].fill('Author Name')
        await textboxes[2].fill('http://testblogurl.com')
        await page.getByRole('button', { name: 'add' }).click()  

        await expect(page.getByText('Test Blog Title Author Name')).toBeVisible()
      
        await page.getByRole('button', { name: 'show more' }).click()
      
        const likeButton = await page.getByRole('button', { name: 'like' })
        await expect(likeButton).toBeVisible()
      
        const likesBeforeText = await page.locator('p:has-text("Likes:")').textContent()
        const likesBefore = parseInt(likesBeforeText.split(': ')[1])

        await likeButton.click()

        await page.waitForTimeout(500)

        const likesAfterText = await page.locator('p:has-text("Likes:")').textContent()
        const likesAfter = parseInt(likesAfterText.split(': ')[1])

        expect(likesAfter).toBeGreaterThan(likesBefore)
      })

      test('the user can delete a blog they created', async ({ page }) => {
        await page.getByRole('button', { name: 'New blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Blog to be deleted')
        await textboxes[1].fill('Author Name')
        await textboxes[2].fill('http://deletethisblog.com')
        await page.getByRole('button', { name: 'add' }).click()

        await expect(page.getByText('Blog to be deleted Author Name')).toBeVisible()

        await page.getByRole('button', { name: 'show more' }).click()

        page.once('dialog', dialog => dialog.accept())

        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('Blog to be deleted Author Name')).not.toBeVisible()
      })
      
  })

  describe('When a blog exists', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole('button', { name: 'Log in' }).click()
      const loginboxes = await page.getByRole('textbox').all()
      await loginboxes[0].fill('testuser')
      await loginboxes[1].fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'New blog' }).click()
      const textboxes = await page.getByRole('textbox').all()
      await textboxes[0].fill('Blog with restricted delete')
      await textboxes[1].fill('Author Name')
      await textboxes[2].fill('http://restricteddelete.com')
      await page.getByRole('button', { name: 'add' }).click()

      await page.getByRole('button', { name: 'Logout' }).click()
    })
  
    test('only the creator can see the delete button', async ({ page }) => {
      await page.getByRole('button', { name: 'Log in' }).click()
      const loginboxes = await page.getByRole('textbox').all()
      await loginboxes[0].fill('otheruser')
      await loginboxes[1].fill('otherpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Blog with restricted delete Author Name')).toBeVisible()

      await page.getByRole('button', { name: 'show more' }).click()

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog with restricted delete Author Name')).toBeVisible()

      await page.getByRole('button', { name: 'Logout' }).click()

      await page.getByRole('button', { name: 'Log in' }).click()
      await loginboxes[0].fill('testuser')
      await loginboxes[1].fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'show more' }).click()

      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog with restricted delete Author Name')).not.toBeVisible()
    })
  })
  
  describe('Blog order based on likes', () => {
    beforeEach(async ({ page, request }) => {
      await page.getByRole('button', { name: 'Log in' }).click()
      const loginboxes = await page.getByRole('textbox').all()
      await loginboxes[0].fill('testuser')
      await loginboxes[1].fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'New blog' }).click()
      const textboxes1 = await page.getByRole('textbox').all()
      await textboxes1[0].fill('Blog with 5 likes')
      await textboxes1[1].fill('Author One')
      await textboxes1[2].fill('http://blog1.com')
      await page.getByRole('button', { name: 'add' }).click()
      await page.getByRole('button', { name: 'show more' }).click()
      for (let i = 0; i < 5; i++) {
        await page.getByRole('button', { name: 'like' }).click()
      }
      await page.waitForTimeout(100)

      await page.getByRole('button', { name: 'New blog' }).click()
      const textboxes2 = await page.getByRole('textbox').all()
      await textboxes2[0].fill('Blog with 10 likes')
      await textboxes2[1].fill('Author Two')
      await textboxes2[2].fill('http://blog2.com')
      await page.getByRole('button', { name: 'add' }).click()
      await page.getByRole('button', { name: 'show more' }).last().click()
      for (let i = 0; i < 10; i++) {
        await page.getByRole('button', { name: 'like' }).last().click()
      }
      await page.waitForTimeout(100)

      await page.getByRole('button', { name: 'New blog' }).click()
      const textboxes3 = await page.getByRole('textbox').all()
      await textboxes3[0].fill('Blog with 3 likes')
      await textboxes3[1].fill('Author Three')
      await textboxes3[2].fill('http://blog3.com')
      await page.getByRole('button', { name: 'add' }).click()
      await page.getByRole('button', { name: 'show more' }).last().click()
      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: 'like' }).last().click()
      }
      await page.waitForTimeout(100)
    })
  
    test('blogs are ordered by likes in descending order', async ({ page }) => {
      const blogElements = await page.locator('.blog-summary').allTextContents()

      expect(blogElements).toEqual([
        'Blog with 10 likes Author Twoshow less',
        'Blog with 5 likes Author Oneshow less',
        'Blog with 3 likes Author Threeshow less',
      ])
    })
  })
  
  
})
