# Playwright E2E Testing Framework with Docker & BrowserStack

[![Playwright Tests inside Docker](https://github.com/Dubrovin-N/webTesting/actions/workflows/playwright.yml/badge.svg)](https://github.com/Dubrovin-N/webTesting/actions)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-34D058?style=for-the-badge&logo=playwright&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![BrowserStack](https://img.shields.io/badge/BrowserStack-FF1F5B?style=for-the-badge&logo=browserstack&logoColor=white)

A robust, enterprise-grade End-to-End (E2E) automation framework built with **Playwright**, containerized using **Docker**, and integrated with **BrowserStack Cloud Grid** via **GitHub Actions**.

The project validates critical user workflows on the [Practice Software Testing](https://practicesoftwaretesting.com/) platform.

> ### 🌙 Behind the Scenes & Project Scope (Personal Note)
>
> **Core Objective:** This repository is specifically designed as an **Infrastructure and Architecture Showcase (Boilerplate)** rather than a high-volume test suite. The primary goal was to engineer a bulletproof, production-ready test automation ecosystem from scratch—focusing on modern CI/CD infrastructure challenges: full Docker containerization, dynamic environment routing within testing pipelines, enterprise-grade cloud grid orchestration (BrowserStack), and robust network mocking to isolate the frontend and eliminate environment-specific network restrictions.
>
> **The Human Element:** I built, debugged, and optimized this entire delivery pipeline over several intensive late-night sessions after my day job. Balancing a full-time career, family life, and raising a kid proved one thing: if you can successfully manage daily family logistics, configuring Docker containers and cloud grids is a walk in the park! It represents my drive to deliver scalable, enterprise-ready QA infrastructure under any circumstances.

---

## 🏗️ Architecture: POM & Business Flows

This framework strictly follows the **Page Object Model (POM)** but elevates it by introducing **Business Flows** to maximize code reusability and maintainability.

- **Page Object Model (POM):** Isolates raw elements, selectors, and basic page-specific actions.
- **Flows Layer (`ShopFlow`, `PurchaseFlow`):** Orchestrates multiple page actions into high-level business processes (e.g., adding items to a cart, filling out sequential checkout forms, or completing a purchase).
- **The Result:** The actual test files remain incredibly clean, high-level, and readable like a book, completely decoupled from UI changes or brittle locator logic:
  ```typescript
  await page.goto('/');
  await shopFlow.addProductToCart(targetProduct, 1);
  await purchaseFlow.completeCheckoutWithCashOnDelivery(user);
  ```
  ***

## 🚀 Advanced Engineering Features

- **Dynamic Test Data Factory:** Features automated, realistic on-the-fly user data generation using `@faker-js/faker`. Every test run is completely isolated with unique datasets.
- **Network Interception & Mocking:** Bypasses aggressive Cloudflare 403 blocks on CI runners by utilizing Playwright’s `page.route` to mock backend API responses. This speeds up frontend execution and eliminates third-party dependency flakiness.
- **Dockerized Environments:** Full containerization ensures that tests run identically across local development setups and cloud runner environments.
- **Dynamic CI/CD Pipeline:** Fully automated GitHub Actions workflow integrated with the GitHub CLI (`gh`), allowing remote test triggers straight from the local terminal.

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Testing Engine:** Playwright
- **Design Patterns:** Page Object Model (POM) & Flow-based Architecture
- **Test Data Generation:** @faker-js/faker
- **Code Style & Linting:** Prettier & Lint-staged
- **Git Hooks Automation:** Husky (interceptor for pre-commit quality checks)
- **Containerization:** Docker
- **Cloud Execution:** BrowserStack Cloud Grid (OS X Sonoma / Chrome setup)
- **CI/CD Orchestration:** GitHub Actions & GitHub CLI (`gh`)

---

## 💅 Code Quality Guardrails (Husky & Prettier)

To guarantee that only clean, well-formatted code ever reaches the remote repository:

- **Prettier** automatically formats all stylesheets, configs, and scripts according to strict project rules.
- **Husky** acts as a local git-hook gatekeeper. Every time you run `git commit`, Husky intercepts it and runs `lint-staged` along with Prettier to format code before committing. Messy code is blocked locally.

---

## 📦 Getting Started

### 1. Prerequisites

Ensure you have the following installed locally:

- Node.js (v20+ or v22 recommended)
- Docker Desktop
- GitHub CLI (`gh`)

### 2. Installation

Clone the repository and install the node packages:

```bash
git clone [https://github.com/Dubrovin-N/webTesting.git](https://github.com/Dubrovin-N/webTesting.git)
cd webTesting
npm install
```

### 3. Environment Secrets Setup

Create a local `.env` file based on the provided template:

```bash
cp .env.example .env
```

Open your newly created `.env` file and insert your personal cloud grid credentials:

```text
BROWSERSTACK_USERNAME=your_username_here
BROWSERSTACK_ACCESS_KEY=your_access_key_here
```

---

## 💻 Available Scripts

| Command                   | Environment                     | Description                                                                               |
| :------------------------ | :------------------------------ | :---------------------------------------------------------------------------------------- |
| `npm run test`            | Local Machine / Docker          | Runs standard Playwright tests locally (Headless Chromium).                               |
| `npm run test:cloud`      | Cloud Grid (Direct)             | Direct local-to-cloud execution on remote BrowserStack machines.                          |
| `npm run ci:browserstack` | CI/CD Server (Docker Container) | Leverages the GitHub CLI (`gh`) to trigger the remote container build and cloud test run. |

### Running via GitHub CLI (`gh`)

To command the GitHub servers to build your Docker image and fire up the cloud execution directly from your terminal, run:

```bash
npm run ci:browserstack
```

---

## 📊 CI/CD Pipeline Architecture

The GitHub Actions workflow configuration (`.github/workflows/playwright.yml`) is fine-tuned for high-performance delivery:

1. **Trigger Optimization:** Smart filtering ensures automatic test execution runs only on `push` events to main branches and active `pull_request` integrations, eliminating redundant duplicate tasks.
2. **Dynamic Routing:** Utilizes `workflow_dispatch` choices allowing the runner to dynamically switch traffic directions (`github-local` vs `browserstack-cloud`) inside the Docker container.
3. **Resilient Report Artifacts:** Implements the `if: always()` condition on the HTML artifact upload block. This guarantees that your full Playwright report, video traces, and error screenshots are successfully extracted from the Docker container and uploaded to GitHub **even if a test run fails**.
