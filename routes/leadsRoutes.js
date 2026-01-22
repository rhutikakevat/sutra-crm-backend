const express = require("express")
const router = express.Router();
const Leads = require("../models/leads.model");
const mongoose = require("mongoose");

// POST Route - for create a new data in Leads

async function createLeadData(newLead) {
    try {
        const lead = new Leads(newLead);
        const savedLead = await lead.save();

        return savedLead
    } catch (error) {
        console.log("Error occurred while creating the new lead's data", error)
    }
}

router.post("/", async (req, res) => {
    try {
        const { name, source, salesAgent, status, tags, timeToClose, priority } = req.body
        const leadData = await createLeadData(req.body);

        if (!leadData.name) {
            return res.status(400).json({ error: "Invaild input: 'name' is required." })
        }

        if (!leadData.salesAgent || !mongoose.Types.ObjectId.isValid(leadData.salesAgent)) {
            return res.status(404).json({ error: `Sales agent with ID ${leadData.salesAgent} not found` })
        }

        res.status(201).json({
            message: "The new lead's data is created successfully!",
            leadData
        })


    } catch (error) {
        res.status(500).json({ error: "Failed to fetch the data" })
    }
})

// GET Route = for get all data in Leads DB

async function readAllLeads(filter = {}) {
    try {
        const fetchLeadsData = await Leads.find(filter).populate("salesAgent", "name");

        return fetchLeadsData;
    } catch (error) {
        console.log("Error is occured while fetching all the data", error)
        throw error;
    }
}

router.get("/", async (req, res) => {
    try {
        const { salesAgent, status, tags, source } = req.query;

        const validStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
        const validSources = ['Website', 'Referral', 'Cold Call', 'Advertisement', 'Email', 'Other'];

        const filter = {}

        if (salesAgent) {
            if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
                return res.status(400).json({
                    error: "Invalid input: 'salesAgent' must be a valid ObjectId"
                })
            }
            filter.salesAgent = salesAgent;
        }

        if (status) {
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    error: `Invalid input: 'status' must be one of ${validStatuses.join(", ")}`
                })
            }
            filter.status = status
        }

        if (tags) {
            const tagsArray = tags.split(",")
            filter.tags = { $in: tagsArray }
        }

        if (source) {
            if (!validSources.includes(source)) {
                return res.status(400).json({
                    error: `Invalid input: 'source' must be one of ${validSources.join(", ")}`
                })
            }
            filter.source = source;
        }

        const allLeadsData = await readAllLeads(filter);
        res.status(200).json(allLeadsData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch the lead's data" })
    }
})

module.exports = router;