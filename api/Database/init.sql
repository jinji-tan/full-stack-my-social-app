-- Initial Database Schema for MySocialApp
-- Create the database first: CREATE DATABASE MySocialAppDb;
-- Then run this script.

USE MySocialAppDb;
GO

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Social')
BEGIN
    EXEC('CREATE SCHEMA Social');
END
GO

-- 1. Users Table
IF OBJECT_ID('Social.Users', 'U') IS NULL
BEGIN
    CREATE TABLE Social.Users (
        Id INT PRIMARY KEY IDENTITY(1,1),
        FirstName NVARCHAR(100) NOT NULL,
        LastName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash VARBINARY(MAX) NOT NULL,
        PasswordSalt VARBINARY(MAX) NOT NULL,
        ProfileImageUrl NVARCHAR(MAX) NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME()
    );
END

-- 2. Posts Table
IF OBJECT_ID('Social.Posts', 'U') IS NULL
BEGIN
    CREATE TABLE Social.Posts (
        Id INT PRIMARY KEY IDENTITY(1,1),
        UserId INT NOT NULL,
        Title NVARCHAR(255) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Posts_Users FOREIGN KEY (UserId) REFERENCES Social.Users(Id) ON DELETE CASCADE
    );
END

-- 3. Comments Table
IF OBJECT_ID('Social.Comments', 'U') IS NULL
BEGIN
    CREATE TABLE Social.Comments (
        Id INT PRIMARY KEY IDENTITY(1,1),
        PostId INT NOT NULL,
        UserId INT NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        ParentId INT NULL,
        CreatedAt DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Comments_Posts FOREIGN KEY (PostId) REFERENCES Social.Posts(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Comments_Users FOREIGN KEY (UserId) REFERENCES Social.Users(Id),
        CONSTRAINT FK_Comments_Parent FOREIGN KEY (ParentId) REFERENCES Social.Comments(Id)
    );
END

-- 4. Messages Table
IF OBJECT_ID('Social.Messages', 'U') IS NULL
BEGIN
    CREATE TABLE Social.Messages (
        Id INT PRIMARY KEY IDENTITY(1,1),
        SenderId INT NOT NULL,
        ReceiverId INT NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        Timestamp DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME(),
        ParentMessageId INT NULL,
        IsUnsent BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_Messages_Sender FOREIGN KEY (SenderId) REFERENCES Social.Users(Id),
        CONSTRAINT FK_Messages_Receiver FOREIGN KEY (ReceiverId) REFERENCES Social.Users(Id),
        CONSTRAINT FK_Messages_Parent FOREIGN KEY (ParentMessageId) REFERENCES Social.Messages(Id)
    );
END
GO
