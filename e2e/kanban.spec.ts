import { test, expect } from '@playwright/test'

const DEMO_EMAIL = 'demo@devboard.dev'
const DEMO_PASSWORD = 'demo1234'
const TEST_BOARD_NAME = `E2E Test Board ${Date.now()}`

test.describe('DevBoard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByTestId('email-input').fill(DEMO_EMAIL)
    await page.getByTestId('password-input').fill(DEMO_PASSWORD)
    await page.getByTestId('login-button').click()
    await page.waitForURL('**/boards')
  })

  test('can create a board', async ({ page }) => {
    await page.getByTestId('new-board-button').click()
    await page.getByTestId('board-name-input').fill(TEST_BOARD_NAME)
    await page.getByTestId('create-board-submit').click()

    await expect(page.getByText(TEST_BOARD_NAME)).toBeVisible()
    await expect(page.getByTestId('board-card').first()).toBeVisible()
  })

  test('can drag a card between columns', async ({ page }) => {
    // Navigate to the first board
    await page.getByTestId('board-card').first().click()
    await page.waitForURL('**/boards/**')

    const columns = page.getByTestId('kanban-column')
    await expect(columns.first()).toBeVisible()

    const cards = page.getByTestId('kanban-card')
    const firstCard = cards.first()
    const secondColumn = columns.nth(1)

    if (await firstCard.isVisible() && await secondColumn.isVisible()) {
      const cardBox = await firstCard.boundingBox()
      const columnBox = await secondColumn.boundingBox()

      if (cardBox && columnBox) {
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
        await page.mouse.down()
        await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 })
        await page.mouse.up()
      }
    }

    // Verify card moved visually (in the DOM)
    await expect(secondColumn.getByTestId('kanban-card').first()).toBeVisible()
  })

  test('card position persists after page reload', async ({ page }) => {
    // Navigate to the first board
    await page.getByTestId('board-card').first().click()
    await page.waitForURL('**/boards/**')

    const columns = page.getByTestId('kanban-column')
    const cards = page.getByTestId('kanban-card')
    const firstCard = cards.first()
    const secondColumn = columns.nth(1)

    // Drag card to second column
    if (await firstCard.isVisible() && await secondColumn.isVisible()) {
      const cardBox = await firstCard.boundingBox()
      const columnBox = await secondColumn.boundingBox()

      if (cardBox && columnBox) {
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2)
        await page.mouse.down()
        await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 })
        await page.mouse.up()
      }
    }

    // Reload the page — position should persist (but BUG: it won't)
    await page.reload()
    await page.waitForURL('**/boards/**')

    // This assertion FAILS due to the intentional bug in useCards.ts
    // handleCardDrop only updates local state, not Supabase
    const secondColumnAfterReload = page.getByTestId('kanban-column').nth(1)
    await expect(secondColumnAfterReload.getByTestId('kanban-card').first()).toBeVisible({ timeout: 5000 })
  })
})
