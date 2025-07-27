/**
 * @file This file mocks the data that would be fetched from the fi-mcp service.
 * In a real application, these functions would make API calls to a secure backend
 * that communicates with the financial data provider.
 */

import { Expense } from "@/context/transactions-context";

export function getInitialTransactions(): Expense[] {
    return [
        { id: '1', description: 'June Salary', category: 'Salary', date: '2024-06-27', amount: 8000.00, type: 'income' },
        { id: '2', description: 'Groceries from Central Market', category: 'Food', date: '2024-06-28', amount: 150.75, type: 'expense' },
        { id: '3', description: 'Uber ride to office', category: 'Transport', date: '2024-06-26', amount: 250.00, type: 'expense' },
        { id: '4', description: 'Zomato Order', category: 'Food', date: '2024-06-25', amount: 450.00, type: 'expense' },
        { id: '5', description: 'Electricity Bill', category: 'Utilities', date: '2024-06-24', amount: 1200.00, type: 'expense' },
        { id: '6', description: 'Movie tickets', category: 'Entertainment', amount: 700.00, date: '2024-07-28' , type: 'expense'},
        { id: '7', description: 'Groceries', category: 'Shopping', amount: 2100.00, date: '2024-07-27', type: 'expense' },
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSipData() {
    return [
        { name: "SBI Bluechip Fund", invested: 10000, current: 12500, returns: 25.00 },
        { name: "Mirae Asset Large Cap", invested: 7500, current: 8200, returns: 9.30 },
        { name: "Parag Parikh Flexi Cap", invested: 15000, current: 21000, returns: 40.00 },
    ];
}

export function getLoanData() {
    return [
        { name: 'Personal Loan', outstanding: 45000, emiDate: '05 Aug 2024', emiAmount: 5200 },
    ];
}

export function getFinancialDataExample() {
    return {
        assets: {
            savingsAccount: 50000,
            checkingAccount: 25000,
            stocks: 150000,
            mutualFunds: 200000,
            epf: 75000,
        },
        liabilities: {
            creditCardDebt: 15000,
            personalLoan: 50000,
        },
        sips: getSipData().map(sip => ({
            name: sip.name,
            monthly: sip.invested / 12, // A simple approximation
            returns: sip.returns / 100,
        })),
        creditScore: 780,
    };
}

    