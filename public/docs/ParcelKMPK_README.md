# ParcelKMPK - Parcel Tracking System

A tracking web application and parcel inbound/outbound handling management system built for KMPK under a private tender. Designed to optimize parcel operations and keep students and staff informed.

## System Overview

ParcelKMPK automates the manual tracking of incoming and outgoing shipments within a college campus. It provides a secure administrative interface for campus staff to log parcels as they arrive, automatically generate notifications, and process sign-outs when parcels are collected.

## Core Features

* **Inbound Scanning**: Quick entry forms for logs including tracking numbers, courier services, recipient names, and storage shelf allocations.
* **Outbound Processing**: Verification flows requiring digital signatures or student ID validation prior to parcel release.
* **Notification Dispatcher**: Integrated automated alert engine to notify students via email or SMS when their parcels are ready.
* **Redis Caching**: High-performance transient caching of active parcel records to reduce database pressure during peak pickup times.
* **Search & Filter**: Comprehensive dashboard filtering by date, status (Pending/Claimed), student ID, and parcel location.

## Technology Stack

* **Frontend**: React, Tailwind CSS, JavaScript
* **Backend**: Laravel, PHP
* **Caching**: Redis
* **Database**: MySQL
* **Deployment**: Railway
