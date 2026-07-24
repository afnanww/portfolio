# AI Support Agent for Manufacturing Company

An AI-powered support chatbot designed specifically for manufacturing companies to automate product information delivery, lead generation, booking client meetings, and processing initial purchase order requests.

## System Overview

This chatbot acts as a first-line support representative. By indexing internal catalog data and integrating directly with Google Sheets and Google Calendar APIs, it handles customer onboarding, checks item availability, reserves time on executive calendars, and logs incoming orders automatically without human intervention.

## Core Features

* **Intent Recognition**: Fine-tuned prompt models to identify customer intent (e.g., inquiry, schedule meeting, buy).
* **Google Calendar Integration**: Fetches real-time availability and schedules consultation meetings directly in sales representative calendars.
* **Google Sheets Database**: Logs user interactions, leads, and feedback in structured spreadsheets for simple sales CRM tracking.
* **Product Catalog Search**: Instant semantic responses regarding part dimensions, specs, and availability.
* **Order Automation**: Secure intake of purchase order requests, sending email notifications and database updates to warehouse managers.

## Technology Stack

* **Backend Framework**: PHP / Blade
* **AI Model**: Google Gemini API
* **Database**: PostgreSQL
* **Third-Party APIs**: Google Calendar API, Google Sheets API
* **Styling**: Tailwind CSS
