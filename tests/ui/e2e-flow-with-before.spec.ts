import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login-page'
import { faker } from '@faker-js/faker/locale/en'
import { PASSWORD, USERNAME } from '../../config/env-data'

let loginPage: LoginPage

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page)
  await loginPage.open()
})

test('signIn button disabled when incorrect data inserted', async ({}) => {
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(7))
  await expect(loginPage.signInButton).toBeDisabled()
})

test('error message displayed when incorrect credentials used', async ({}) => {
  // implement test
  await loginPage.usernameField.fill(faker.lorem.word(2))
  await loginPage.passwordField.fill(faker.lorem.word(9))
  await loginPage.signInButton.click()
  await expect(loginPage.authError).toBeVisible()
})

test('login with correct credentials and verify order creation page', async ({}) => {
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await expect(orderCreationPage.statusButton).toBeVisible()
  await expect(orderCreationPage.usernameInput).toBeVisible()
  await expect(orderCreationPage.phoneInput).toBeVisible()
  await expect(orderCreationPage.commentInput).toBeVisible()
  await expect(orderCreationPage.createOrderButton).toBeVisible()
  // verify at least few elements on the order creation page
})

test('login and create order', async ({}) => {
  // lets create an order
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.usernameInput.fill('random-user')
  await orderCreationPage.phoneInput.fill('75980823')
  await orderCreationPage.commentInput.fill('leave in front of door')
  await orderCreationPage.createOrderButton.click()
  //lets verify success message
  await expect(orderCreationPage.successMessage).toBeVisible()
})

test('check error on order creation', async ({}) => {
  // lets create an order
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)
  await orderCreationPage.usernameInput.fill('s')
  await orderCreationPage.phoneInput.fill('12345')
  await orderCreationPage.commentInput.fill('leave in front of door')
//checks
  await expect(orderCreationPage.createOrderButton).toBeDisabled()
  //errors
  await expect(orderCreationPage.customerNamerError).toBeVisible()
  await expect(orderCreationPage.phoneError).toBeVisible()
})

test('logout from order page', async ({}) => {
  // lets create an order
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  await orderCreationPage.logoutButton.click()
  //checks
  await expect(loginPage.signInButton).toBeVisible()
  await expect(orderCreationPage.logoutButton).toBeHidden()
expect(loginPage.url).toContain('signin')
})

test('order not found page', async ({}) => {
  // lets create an order
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

 await orderCreationPage.statusButton.click()
  await orderCreationPage.searchOrderInput.fill('250000')
  await orderCreationPage.searchOrderButton.click()
  //checks
  await expect(orderCreationPage.orderNotFoundText).toBeVisible()
  await expect(orderCreationPage.orderNotFoundImage).toBeVisible()
})

test('order found page', async ({}) => {
  // lets create an order
  const orderCreationPage = await loginPage.signIn(USERNAME, PASSWORD)

  await orderCreationPage.statusButton.click()
  await orderCreationPage.searchOrderInput.fill('21099')
  await orderCreationPage.searchOrderButton.click()
  //checks
  await expect(orderCreationPage.orderStatusOpen).toBeVisible()
  await expect(orderCreationPage.orderNameDetails).toBeVisible()
})
