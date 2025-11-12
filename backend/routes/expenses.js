const express = require('express');
const prisma = require('../prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all expenses with search, sort, filter, and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'date',
      sortOrder = 'desc',
      category = '',
      startDate = '',
      endDate = '',
      minAmount = '',
      maxAmount = ''
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {
      userId: req.user.id
    };

    // Search by description (MySQL supports contains)
    if (search) {
      where.description = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) {
        where.amount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.amount.lte = parseFloat(maxAmount);
      }
    }

    // Build orderBy
    const orderBy = {};
    const validSortFields = ['date', 'amount', 'category', 'description', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'date';
    orderBy[sortField] = sortOrder === 'asc' ? 'asc' : 'desc';

    // Get expenses and total count
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy,
        skip,
        take: limitNum
      }),
      prisma.expense.count({ where })
    ]);

    res.json({
      expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single expense
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || amount === undefined || !category) {
      return res.status(400).json({ error: 'Description, amount, and category are required' });
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: date ? new Date(date) : new Date(),
        userId: req.user.id
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData
    });

    res.json(expense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({
      where: { id }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

