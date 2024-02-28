CREATE DATABASE tickers;

-- Creating a table with 3 columns: id, ticker, and company
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    company VARCHAR(255) NOT NULL
);


-- Insert 2 rows for each ticker and corresponding
INSERT INTO stocks (ticker, company) VALUES
('TSLA', 'Tesla'),
('AAPL', 'Apple'),
('MSFT', 'Microsoft');
