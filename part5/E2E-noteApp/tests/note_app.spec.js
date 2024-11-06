const { test, describe, expect } = require('@playwright/test')


describe('Note app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
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
      })  
})