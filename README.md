<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Learn To Bank Logo" src="./assets/logo.png">
  <h1 align="center"><strong>Bank-Simulator</strong> deployment guide!</h1>
</a>

<p align="center">
 This document will guide you through setting up an account on Vercel, retrieving API keys from Supabase,
  and deploying the project<br> to make it live.<br><br>
  Information regarding our user stories, models and more can be navigated in the <a href="#for-more-information-visit-our-wiki"> Wiki</a>!
</p>

<p align="center">
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#issues"><strong>Issues</strong></a> ·
  <a href="#changelog"><strong>Changelog</strong></a> ·
  <a href="#for-more-information-visit-our-wiki"><strong>Wiki</strong></a>
</p>
<br/>

## Table of Contents
### Demo
- **[Demo](#demo)**
### Deployment
- **[Getting Started with Vercel](#1-getting-started-with-vercel)**
   - [Step 1: Sign Up for a Vercel Account](#step-1-sign-up-for-a-vercel-account)
   - [Step 2: Connect Vercel to GitHub](#step-2-connect-vercel-to-github)
- **[Retrieving API Keys from Supabase](#2-retrieving-api-keys-from-supabase)**
   - [Step 3: Go to Supabase and Grab API Keys](#step-3-go-to-supabase-and-grab-api-keys)
- **[Setting Environment Variables in Vercel](#3-setting-environment-variables-in-vercel)**
- **[Final Deployment on Vercel](#4-final-deployment-on-vercel)**
- **[Customizing Domain and Additional Settings](#5-customizing-domain-and-additional-settings)**
- **[Additional Resources](#6-additional-resources)**
### Running Locally
- **[System Requirements](#system-requirements)**
- **[Clone and Run Locally](#clone-and-run-locally)**
### Information
- **[Wiki](#for-more-information-visit-our-wiki)**
- **[Changelog](#changelog)**
- **[Issues](#issues)**

## Demo

You can view a fully working demo at [learn-to-bank.vercel.app](https://learn-to-bank.vercel.app/).
---
<br><br>
## Deploy to Vercel

In order to see <strong>Learn To Bank</strong> live, you will need to deploy using vercel, we have broken down the steps below.

By clicking this button below and follow the steps as instructed.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This%20starter%20configures%20Supabase%20Auth%20to%20use%20cookies%2C%20making%20the%20user's%20session%20available%20throughout%20the%20entire%20Next.js%20app%20-%20Client%20Components%2C%20Server%20Components%2C%20Route%20Handlers%2C%20Server%20Actions%20and%20Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6)


If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).
<br><br>
## 1. Getting Started with Vercel

### Step 1: Sign Up for a Vercel Account

- **Go to [vercel.com](https://vercel.com/):** Visit the Vercel website.
- **Sign Up for Vercel:**
  - Click on **Sign Up**.
  - Choose **Sign up with GitHub** (recommended).
  - **Verify with Phone Number**: Vercel may require a phone number to complete the account setup. Follow the prompts and enter your phone number for verification.

![Vercel Sign-up Page and Phone Verification Prompt](./assets/phone-verification.png)

### Step 2: Connect Vercel to GitHub

- After creating your Vercel account, ensure that Vercel is connected to the GitHub account that holds this **Bank-Simulator** repository.
- In Vercel, go to your **Dashboard** and click **New Project**.
- You should see a list of GitHub repositories. Locate **Bank-Simulator** and select it.

![Vercel “New Project” Button and Repository Selection](./assets/add-new-project.png)

---

## 2. Retrieving API Keys from Supabase

### Step 3: Go to Supabase and Grab API Keys

1. **Visit [Supabase](https://supabase.com/):** Log in with the same credentials as provided.
2. **Locate Your Project:**
   - Go to your Supabase dashboard, and select the project related to Bank-Simulator.
3. **Retrieve API Keys:**
   - Find the following API keys in the Supabase settings:
     - **Supabase URL**
     - **Service Role Key**
     - **Anon Key**
   - Copy each of these keys. You’ll use them in Vercel in the next step.

![Supabase Dashboard with API Keys Highlighted](./assets/fetch-api-keys.png)

---

## 3. Setting Environment Variables in Vercel

1. **Go to Project Settings on Vercel:**
   - In your Vercel dashboard, find your **Bank-Simulator** project.
2. **Add Environment Variables:**
   - Go to **Settings > Environment Variables**.
   - For each of the Supabase keys, click **Add New Variable** and enter:
     - `NEXT_SUPABASE_URL` for the Supabase URL.
     - `NEXT_PUBLIC_SERVICE_ROLE_KEY` for the Service Role Key.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` for the Anon Key.
   - Paste the respective values you copied from Supabase.

![Environment Variables Section in Vercel](./assets/insert-api-keys.png)

---

## 4. Final Deployment on Vercel

1. **Deploy the Project:**
   - After setting up the environment variables, return to the **Overview** tab in Vercel and click **Deploy**.
   - Wait for Vercel to build and deploy the project. This may take a few minutes.

2. **Access Your Deployed Site:**
   - Once the deployment is complete, click **Visit** to view the live version of **Bank-Simulator**.

![Final Deployment Page with “Visit” Button](./assets/deploying.png)

---

## 5. Customizing Domain and Additional Settings

- **Change the Domain Name**:
  - If you want a custom domain, go to the **Domains** section in your project settings on Vercel.
  - Follow the prompts to add and configure a custom domain.

- **Additional Project Settings**:
  - Review other settings in Vercel, such as **Privacy Settings** or **Build and Development Settings**, as needed.

![Domain Configuration Settings](./assets/domain-settings.png)

---

## 6. Additional Resources

- [Vercel Documentation](https://vercel.com/docs): For additional information on managing deployments.
- [Supabase Documentation](https://supabase.com/docs): Learn more about managing and securing your Supabase project.

---

By following this guide, you should be able to deploy **Bank-Simulator** successfully on Vercel! If you run into any issues, please reach out to your developer for further assistance.

<br><br>
------
# Running Locally
## System Requirements

This project, **Learn to Bank**, is a fake bank simulator designed to help seniors. The application was developed using the following tools and environment configurations. Please follow the setup guides linked for each item to ensure compatibility.

### Operating System
- **[Windows 11](https://www.microsoft.com/software-download/windows11)** (recommended): The project was primarily tested on Windows 11. Other operating systems (e.g., macOS, Linux) may work, but slight differences in setup might arise.

### Development Tools and Dependencies

- **[Node.js](https://nodejs.org/)**: JavaScript runtime environment required for both frontend and backend development.
  - **Recommended Version**: 20.17.0 or above.
  - Ensure that `npm` (Node Package Manager) is also installed with Node.js.

- **[Git](https://git-scm.com/)**: Version control system for collaborative development.
  - **Minimum Version**: 2.x
  - Git is compatible with most versions, so any recent version should work fine.

### Database

- **[Supabase (PostgreSQL)](https://supabase.io)**: Primary database for data storage.
  - Supabase is based on PostgreSQL, providing an SQL interface and real-time features.

### Configuration Files

- **Environment Variables**: Configuration files for environment variables (e.g., `.env` file) should include the following keys:
  - `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase project.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public API key for Supabase.
  - `SUPABASE_SERVICE_ROLE_KEY`: (if needed for backend operations).

- **Frontend and Backend Dependencies**:
  - For the versions of plugins, packages, and frameworks used, refer to:
    - `package.json` in the root directory for frontend dependencies.
    - Environment variables are specified in `.env.local` for both frontend and backend configurations.

### Additional Tools

- **[React Developer Tools](https://react.dev/)**: Recommended for inspecting and debugging React components.
- **[Vercel Deployment Setup](https://vercel.com/)**: For deploying the application, use the Vercel CLI or link the GitHub repository to Vercel for automatic deployments.

### Recommended IDE

- **[Visual Studio Code](https://code.visualstudio.com/)** (VS Code) or any modern code editor with support for JavaScript and TypeScript.
<br><br>
## Clone and run locally
1.
   ```bash
   git clone https://github.com/Legacy-Banking/Bank-Simulator.git
   ```

2. Use `cd` to change into the app's directory

   ```bash
   cd Bank-Simulator
   ```

3. Rename `.env.local.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   NEXT_PUBLIC_SERVICE_ROLE_KEY=[INSERT SUPABASE PROJECT SERVICE ROLE KEY]
   ```

   All `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SERVICE_ROLE_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

4. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
<br><br>
## For more information, visit our wiki!
Our wiki includes:
- User Stories
- Personas
- Motivational Model
- Domain Model
- Architecture Diagram
- Database Diagram

https://github.com/Legacy-Banking/Bank-Simulator/wiki

## Changelog 
[Click here to view the release versions!](https://github.com/Legacy-Banking/Bank-Simulator/wiki/Changelog)

### Issues

Here are some notable issues that have been identified but have not yet been fully addressed in the codebase:

---

#### 1. **User Session Expiry and Inactivity Logout Bug**
The current implementation of the user session expiry, which logs users out after a period of inactivity or when they close the browser tab, occasionally fails. Specifically, the code does not always log the user out when they close the tab or when they switch between tabs.

##### **Root Cause**:
- The `beforeunload` event sometimes doesn't trigger correctly across all browsers when a tab is closed, particularly if the tab is closed quickly or if the user switches tabs frequently.
- The `performance` check for reloads might not be capturing certain cases where the tab is closed without being reloaded, leading to situations where the logout isn't performed as expected.

##### **Potential Fixes**:
- Use more robust event handling for detecting when the tab is closed or the user becomes inactive for an extended period. Possible solutions could include using session storage or integrating a more reliable listener for detecting inactivity across tabs.
- Explore adding background timers or service workers that can more reliably detect when the tab has been closed and trigger the logout process.

---

#### 2. **Code Optimization for Faster Load Times**
The application's performance could be improved, especially in areas like user sign-up initialization, BPAY transactions, and other pages where data fetching and processing can be optimized for speed.

##### **Sign-Up Initialization Performance Issue**:
- Currently, during user sign-up, multiple asynchronous processes occur sequentially, leading to longer wait times before the user is fully registered.

##### **Root Cause**:
- The `signUpInitialization` function fetches preset data and processes each item sequentially, which causes delays. Additionally, the bills for the user are created one at a time, which increases the sign-up processing time.

##### **Potential Fixes**:
- Use `Promise.all` more effectively by bundling as many asynchronous operations as possible to run in parallel. For example, creating user accounts and initializing bills can happen simultaneously, reducing the wait time.
- For the bill assignment process, refactor the loop to allow batch processing of bills and avoid redundant operations.
- Consider caching some static data, like preset bills and saved billers, to reduce redundant fetch requests.

---

### Conclusion
These issues represent areas of the codebase where improvements are needed to enhance both functionality and performance. Addressing these bugs and optimizations will result in a more seamless user experience and faster response times across the application.

