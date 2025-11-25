/**
 * Results Chain API Routes
 * Routes for managing explicit linkages between hierarchy levels
 */

const express = require('express');
const router = express.Router();

module.exports = (resultsChainService) => {
    // ==============================================
    // CREATE
    // ==============================================

    router.post('/', async (req, res) => {
        try {
            const id = await resultsChainService.createLink(req.body);
            res.json({
                success: true,
                id,
                message: 'Results chain link created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.post('/bulk', async (req, res) => {
        try {
            const ids = await resultsChainService.createBulkLinks(req.body.links);
            res.json({
                success: true,
                ids,
                count: ids.length,
                message: 'Bulk results chain links created successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // READ
    // ==============================================

    router.get('/', async (req, res) => {
        try {
            const links = await resultsChainService.getAllLinks();
            res.json({
                success: true,
                data: links,
                count: links.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/:id', async (req, res) => {
        try {
            const link = await resultsChainService.getLinkById(req.params.id);
            if (!link) {
                return res.status(404).json({
                    success: false,
                    error: 'Results chain link not found'
                });
            }
            res.json({
                success: true,
                data: link
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/from/:type/:id', async (req, res) => {
        try {
            const links = await resultsChainService.getLinksFromEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: links,
                count: links.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/to/:type/:id', async (req, res) => {
        try {
            const links = await resultsChainService.getLinksToEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: links,
                count: links.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/chain/:type/:id', async (req, res) => {
        try {
            const chain = await resultsChainService.getFullChain(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                data: chain
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/hierarchy/module/:moduleId', async (req, res) => {
        try {
            const hierarchy = await resultsChainService.getResultsHierarchy(req.params.moduleId);
            res.json({
                success: true,
                data: hierarchy,
                count: hierarchy.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.get('/statistics/module/:moduleId', async (req, res) => {
        try {
            const stats = await resultsChainService.getStatistics(req.params.moduleId);
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // UPDATE
    // ==============================================

    router.put('/:id', async (req, res) => {
        try {
            await resultsChainService.updateLink(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Results chain link updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    // ==============================================
    // DELETE
    // ==============================================

    router.delete('/:id', async (req, res) => {
        try {
            await resultsChainService.deleteLink(req.params.id);
            res.json({
                success: true,
                message: 'Results chain link deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    router.delete('/entity/:type/:id', async (req, res) => {
        try {
            const count = await resultsChainService.deleteLinksForEntity(
                req.params.type,
                req.params.id
            );
            res.json({
                success: true,
                count,
                message: `Deleted ${count} results chain links`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });

    return router;
};
