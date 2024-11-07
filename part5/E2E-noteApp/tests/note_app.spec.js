const { test, describe, expect } = require('@playwright/test')


describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = await page.locator('.error')
    await expect(page.getByText('wrong credentials')).toBeVisible()
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

      describe('when logged in', () => {
        beforeEach(async ({ page }) => {
          await page.getByRole('button', { name: 'log in' }).click()
          await page.getByTestId('username').fill('mluukkai')
          await page.getByTestId('password').fill('salainen')
          await page.getByRole('button', { name: 'login' }).click()
        })
    
        test('a new note can be created', async ({ page }) => {
          await page.getByRole('button', { name: 'new note' }).click()
          await page.getByRole('textbox').fill('a note created by playwright')
          await page.getByRole('button', { name: 'save' }).click()
          await expect(page.getByText('a note created by playwright')).toBeVisible()
        })

        describe('and a note exists', () => {
          beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'new note' }).click()
            await page.getByRole('textbox').fill('another note by playwright')
            await page.getByRole('button', { name: 'save' }).click()
          })
      
          test('importance can be changed', async ({ page }) => {
            await page.getByRole('button', { name: 'make not important' }).click()
            await expect(page.getByText('make important')).toBeVisible()
          })
      })  
  })
})