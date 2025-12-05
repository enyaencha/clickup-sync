-- Drop and Recreate SEEP Module Tables
-- This will remove existing tables and recreate them with the correct schema

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS agriculture_production;
DROP TABLE IF EXISTS agriculture_plots;
DROP TABLE IF EXISTS nutrition_assessments;
DROP TABLE IF EXISTS relief_beneficiary_distribution;
DROP TABLE IF EXISTS relief_distributions;
DROP TABLE IF EXISTS gbv_case_services;
DROP TABLE IF EXISTS gbv_case_notes;
DROP TABLE IF EXISTS gbv_cases;
DROP TABLE IF EXISTS loan_repayments;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS shg_savings_transactions;
DROP TABLE IF EXISTS shg_meetings;
DROP TABLE IF EXISTS shg_members;
DROP TABLE IF EXISTS shg_groups;
DROP TABLE IF EXISTS beneficiaries;

-- Now source the main migration file to recreate tables
-- Run: SOURCE /home/user/clickup-sync/backend/migrations/007_add_program_specific_modules.sql
