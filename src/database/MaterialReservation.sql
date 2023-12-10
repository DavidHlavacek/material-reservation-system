-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Dec 10, 2023 at 07:17 PM
-- Server version: 10.9.2-MariaDB-1:10.9.2+maria~ubu2204
-- PHP Version: 8.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `MaterialReservation`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `AdimID` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `HashedPasword` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`AdimID`, `Email`, `HashedPasword`, `Name`) VALUES
(1, 'admin.test@gmail.com', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Admin Adminovich');

-- --------------------------------------------------------

--
-- Table structure for table `Browser`
--

CREATE TABLE `Browser` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `NFCID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Browser`
--

INSERT INTO `Browser` (`UserID`, `Name`, `Email`, `NFCID`) VALUES
(4, 'User Userovich', 'email.test@test.com', 501),
(53, 'John Doe', 'test.test@email.com', 12);

-- --------------------------------------------------------

--
-- Table structure for table `Category`
--

CREATE TABLE `Category` (
  `CategoryName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Category`
--

INSERT INTO `Category` (`CategoryName`, `Description`) VALUES
('BattleBot', 'Arduino with some stuff atahced on top'),
('Raspbery PI', 'Small little computer');

-- --------------------------------------------------------

--
-- Table structure for table `Item`
--

CREATE TABLE `Item` (
  `ItemID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `BarcodeID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Item`
--

INSERT INTO `Item` (`ItemID`, `CategoryName`, `BarcodeID`, `Name`, `Status`) VALUES
(12, 'BattleBot', 25612, 'Battle bot numero uno', 'Not issued'),
(125, 'Raspbery PI', 2512, 'Raspbery PI numero dos', 'Issued');

-- --------------------------------------------------------

--
-- Table structure for table `Reseervation`
--

CREATE TABLE `Reseervation` (
  `UserID` int(11) NOT NULL,
  `ItemID` int(11) NOT NULL,
  `BorrowDate` date NOT NULL DEFAULT curdate(),
  `ReturnDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Reseervation`
--

INSERT INTO `Reseervation` (`UserID`, `ItemID`, `BorrowDate`, `ReturnDate`) VALUES
(4, 125, '2023-12-12', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`AdimID`);

--
-- Indexes for table `Browser`
--
ALTER TABLE `Browser`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`CategoryName`);

--
-- Indexes for table `Item`
--
ALTER TABLE `Item`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `CategoryName` (`CategoryName`);

--
-- Indexes for table `Reseervation`
--
ALTER TABLE `Reseervation`
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ItemID` (`ItemID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `AdimID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Browser`
--
ALTER TABLE `Browser`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `Item`
--
ALTER TABLE `Item`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Item`
--
ALTER TABLE `Item`
  ADD CONSTRAINT `Item_ibfk_1` FOREIGN KEY (`CategoryName`) REFERENCES `Category` (`CategoryName`);

--
-- Constraints for table `Reseervation`
--
ALTER TABLE `Reseervation`
  ADD CONSTRAINT `Reseervation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Browser` (`UserID`),
  ADD CONSTRAINT `Reseervation_ibfk_2` FOREIGN KEY (`ItemID`) REFERENCES `Item` (`ItemID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
