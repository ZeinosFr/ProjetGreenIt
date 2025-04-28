-- Création de la base de données
CREATE DATABASE IF NOT EXISTS personal_finance CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE personal_finance;

-- Table users
CREATE TABLE `users` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
);

-- Table categories
CREATE TABLE `categories` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Type` enum('Income','Expense') NOT NULL,
  `UserID` int DEFAULT NULL,
  PRIMARY KEY (`CategoryID`),
  UNIQUE KEY `Name` (`Name`),
  KEY `UserID` (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO `categories` (`Name`, `Type`) VALUES 
  ('Salary', 'Income'),
  ('Freelancing', 'Income'),
  ('Investments', 'Income'),
  ('Groceries', 'Expense'),
  ('Utilities', 'Expense'),
  ('Rent', 'Expense'),
  ('Entertainment', 'Expense'),
  ('Transport', 'Expense'),
  ('Savings', 'Expense');

-- Table budgets
CREATE TABLE `budgets` (
  `BudgetID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `UserID` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  PRIMARY KEY (`BudgetID`),
  KEY `UserID` (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
);

-- Table budgetcategories
CREATE TABLE `budgetcategories` (
  `BudgetID` int NOT NULL,
  `CategoryID` int NOT NULL,
  PRIMARY KEY (`BudgetID`, `CategoryID`),
  KEY `CategoryID` (`CategoryID`),
  FOREIGN KEY (`BudgetID`) REFERENCES `budgets` (`BudgetID`) ON DELETE CASCADE,
  FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE CASCADE
);

-- Table currencies
CREATE TABLE `currencies` (
  `CurrencyCode` varchar(3) NOT NULL,
  `ExchangeRate` decimal(10,4) NOT NULL,
  PRIMARY KEY (`CurrencyCode`)
);

-- Table transactions
CREATE TABLE `transactions` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `BaseAmount` decimal(10,2) NOT NULL,
  `Currency` varchar(3) NOT NULL,
  `Date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Description` text,
  `RecurringID` int DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `UserID` (`UserID`),
  KEY `CategoryID` (`CategoryID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE CASCADE
);

-- Table recurringtransactions
CREATE TABLE `recurringtransactions` (
  `RecurringID` int NOT NULL AUTO_INCREMENT,
  `UserID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `Currency` varchar(3) NOT NULL,
  `Frequency` enum('Daily','Weekly','Monthly','Yearly') NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  `Description` text,
  PRIMARY KEY (`RecurringID`),
  KEY `UserID` (`UserID`),
  KEY `CategoryID` (`CategoryID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`) ON DELETE CASCADE
);

