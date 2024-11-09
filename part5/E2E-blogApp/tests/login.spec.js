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
        // Crear un nuevo blog
        await page.getByRole('button', { name: 'New blog' }).click()
        const textboxes = await page.getByRole('textbox').all()
        await textboxes[0].fill('Test Blog Title')
        await textboxes[1].fill('Author Name')
        await textboxes[2].fill('http://testblogurl.com')
        await page.getByRole('button', { name: 'add' }).click()
      
        // Verificar que el nuevo blog se muestra en la lista
        await expect(page.getByText('Test Blog Title Author Name')).toBeVisible()
      
        // Hacer clic en "show more" para ver los detalles del blog
        await page.getByRole('button', { name: 'show more' }).click()
      
        // Verificar que el botón "like" esté visible
        const likeButton = await page.getByRole('button', { name: 'like' })
        await expect(likeButton).toBeVisible()
      
        // Obtener el número de likes antes de hacer clic en "like"
        const likesBeforeText = await page.locator('p:has-text("Likes:")').textContent()
        const likesBefore = parseInt(likesBeforeText.split(': ')[1])
      
        // Hacer clic en el botón "like" para incrementar el contador de likes
        await likeButton.click()
      
        // Esperar un momento para asegurarnos de que la UI se actualiza
        await page.waitForTimeout(500)
      
        // Verificar que el número de likes haya aumentado
        const likesAfterText = await page.locator('p:has-text("Likes:")').textContent()
        const likesAfter = parseInt(likesAfterText.split(': ')[1])
      
        // Asegurarse de que el número de likes haya incrementado
        expect(likesAfter).toBeGreaterThan(likesBefore)
      })
      
  })

})
