const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// In-memory storage (replace with MongoDB later)
let prompts = [
    {
        _id: '1',
        title: 'Professional Email Writer',
        description: 'Generate well-structured professional emails for any business context',
        category: 'writing',
        tags: ['email', 'business', 'communication'],
        author: 'Sarah Johnson',
        content: 'Write a professional email about {Topic} addressed to {Recipient}. Use a {Tone} tone and ensure clarity, proper formatting, and a clear call-to-action.',
        upvotes: 42,
        createdAt: new Date('2025-02-10')
    },
    {
        _id: '2',
        title: 'Code Review Assistant',
        description: 'Get comprehensive code reviews with best practices and improvements',
        category: 'coding',
        tags: ['code-review', 'best-practices', 'refactoring'],
        author: 'Alex Chen',
        content: 'Review the following {Language} code for:\n1. Code quality and readability\n2. Performance optimization\n3. Security vulnerabilities\n4. Best practices adherence\n\nProvide specific suggestions with examples.\n\nCode:\n{Code}',
        upvotes: 87,
        createdAt: new Date('2025-02-09')
    },
    {
        _id: '3',
        title: 'Social Media Content Creator',
        description: 'Create engaging social media posts for different platforms',
        category: 'marketing',
        tags: ['social-media', 'content', 'engagement'],
        author: 'Maria Garcia',
        content: 'Create a {Platform} post about {Topic} that:\n- Captures attention in the first line\n- Includes relevant hashtags\n- Has a clear call-to-action\n- Matches {Brand Voice} tone\n- Optimized for {Target Audience}',
        upvotes: 65,
        createdAt: new Date('2025-02-11')
    },
    {
        _id: '4',
        title: 'Study Notes Generator',
        description: 'Convert complex topics into clear, organized study notes',
        category: 'study',
        tags: ['notes', 'learning', 'education'],
        author: 'David Kim',
        content: 'Create comprehensive study notes for {Topic} including:\n1. Key concepts and definitions\n2. Important formulas or principles\n3. Real-world examples\n4. Practice questions\n5. Memory aids and mnemonics\n\nFormat for easy review and retention.',
        upvotes: 53,
        createdAt: new Date('2025-02-08')
    },
    {
        _id: '5',
        title: 'Product Description Optimizer',
        description: 'Write SEO-optimized product descriptions that convert',
        category: 'marketing',
        tags: ['seo', 'e-commerce', 'copywriting'],
        author: 'Emily White',
        content: 'Write an SEO-optimized product description for:\n\nProduct: {Product Name}\nFeatures: {Key Features}\nTarget Audience: {Audience}\n\nInclude:\n- Compelling headline\n- Benefit-focused bullet points\n- Emotional appeal\n- Strong call-to-action\n- Relevant keywords naturally integrated',
        upvotes: 78,
        createdAt: new Date('2025-02-07')
    }
];

let nextId = 6;

// GET /api/prompts - Fetch all prompts
router.get('/', (req, res) => {
    try {
        // Sort by upvotes (descending) and creation date
        const sortedPrompts = [...prompts].sort((a, b) => {
            if (b.upvotes !== a.upvotes) {
                return b.upvotes - a.upvotes;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json(sortedPrompts);
    } catch (error) {
        console.error('Error fetching prompts:', error);
        res.status(500).json({ error: 'Failed to fetch prompts' });
    }
});

// GET /api/prompts/:id - Fetch single prompt
router.get('/:id', (req, res) => {
    try {
        const prompt = prompts.find(p => p._id === req.params.id);
        
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        res.json(prompt);
    } catch (error) {
        console.error('Error fetching prompt:', error);
        res.status(500).json({ error: 'Failed to fetch prompt' });
    }
});

// POST /api/prompts - Create new prompt
router.post('/', (req, res) => {
    try {
        const { title, description, category, tags, author, content } = req.body;

        // Validation
        if (!title || !description || !category || !author || !content) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['title', 'description', 'category', 'author', 'content']
            });
        }

        // Create new prompt
        const newPrompt = {
            _id: String(nextId++),
            title: title.trim(),
            description: description.trim(),
            category: category.toLowerCase(),
            tags: Array.isArray(tags) ? tags.map(t => t.trim()) : [],
            author: author.trim(),
            content: content.trim(),
            upvotes: 0,
            createdAt: new Date()
        };

        prompts.push(newPrompt);

        res.status(201).json({
            message: 'Prompt created successfully',
            prompt: newPrompt
        });
    } catch (error) {
        console.error('Error creating prompt:', error);
        res.status(500).json({ error: 'Failed to create prompt' });
    }
});

// POST /api/prompts/:id/upvote - Upvote a prompt
router.post('/:id/upvote', (req, res) => {
    try {
        const prompt = prompts.find(p => p._id === req.params.id);
        
        if (!prompt) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        prompt.upvotes += 1;

        res.json({
            message: 'Prompt upvoted successfully',
            upvotes: prompt.upvotes
        });
    } catch (error) {
        console.error('Error upvoting prompt:', error);
        res.status(500).json({ error: 'Failed to upvote prompt' });
    }
});

// DELETE /api/prompts/:id - Delete a prompt (optional for admin)
router.delete('/:id', (req, res) => {
    try {
        const index = prompts.findIndex(p => p._id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Prompt not found' });
        }

        prompts.splice(index, 1);

        res.json({ message: 'Prompt deleted successfully' });
    } catch (error) {
        console.error('Error deleting prompt:', error);
        res.status(500).json({ error: 'Failed to delete prompt' });
    }
});

module.exports = router;