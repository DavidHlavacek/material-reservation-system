CREATE DATABASE IF NOT EXISTS materialreservation;
USE materialreservation;

CREATE TABLE `Admin` (
  `AdminID` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `HashedPassword` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `Admin` (`AdminID`, `Email`, `HashedPassword`, `Name`) VALUES
(1, 'admin.test@gmail.com', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', 'Admin Adminovich');



CREATE TABLE `Browser` (
  `UserID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `NFCId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




INSERT INTO `Browser` (`UserID`, `Name`, `Email`, `NFCID`) VALUES
(4, 'User Userovich', 'email.test@test.com', 501),
(53, 'John Doe', 'test.test@email.com', 12);



CREATE TABLE `Category` (
  `CategoryName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



INSERT INTO `Category` (`CategoryName`, `Description`) VALUES
('BattleBot', 'Arduino with some stuff atahced on top'),
('Raspbery PI', 'Small little computer');



CREATE TABLE `Item` (
  `ItemID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `BarcodeID` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




INSERT INTO `Item` (`ItemID`, `CategoryName`, `BarcodeID`, `Name`, `Status`) VALUES
(12, 'BattleBot', 25612, 'Battle bot numero uno', 'Not issued'),
(125, 'Raspbery PI', 2512, 'Raspbery PI numero dos', 'Issued');



CREATE TABLE `Reservation` (
  `UserID` int(11) NOT NULL,
  `ItemID` int(11) NOT NULL,
  `BorrowDate` date NOT NULL DEFAULT (CURRENT_DATE),
  `ReturnDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `Reservation` (`UserID`, `ItemID`, `BorrowDate`, `ReturnDate`) VALUES
(4, 125, '2023-12-12', NULL);

ALTER TABLE `Admin`
  ADD PRIMARY KEY (`AdminID`);


ALTER TABLE `Browser`
  ADD PRIMARY KEY (`UserID`);

ALTER TABLE `Category`
  ADD PRIMARY KEY (`CategoryName`);


ALTER TABLE `Item`
  ADD PRIMARY KEY (`ItemID`),
  ADD KEY `CategoryName` (`CategoryName`);


ALTER TABLE `Reservation`
  ADD KEY `UserID` (`UserID`),
  ADD KEY `ItemID` (`ItemID`);



ALTER TABLE `Admin`
  MODIFY `AdminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;


ALTER TABLE `Browser`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;


ALTER TABLE `Item`
  MODIFY `ItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;



ALTER TABLE `Item`
  ADD CONSTRAINT `Item_ibfk_1` FOREIGN KEY (`CategoryName`) REFERENCES `Category` (`CategoryName`);


ALTER TABLE `Reservation`
  ADD CONSTRAINT `Reservation_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Browser` (`UserID`),
  ADD CONSTRAINT `Reservation_ibfk_2` FOREIGN KEY (`ItemID`) REFERENCES `Item` (`ItemID`);
