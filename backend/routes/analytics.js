const express = require('express');
const prisma = require('../prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const monthlyTotals = {};
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[monthKey] = 0;
    }

    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      const monthKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyTotals[monthKey] !== undefined) {
        monthlyTotals[monthKey] += exp.amount;
      }
    });

    const recentExpenses = expenses.slice(0, 5);

    const averageExpense = totalExpenses > 0 ? totalAmount / totalExpenses : 0;

    res.json({
      totalExpenses,
      totalAmount,
      averageExpense,
      categoryTotals,
      monthlyTotals,
      recentExpenses
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

