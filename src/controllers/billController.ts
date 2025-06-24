import { Request, Response } from 'express';
import { BillRequest } from '../types/requests';
import { sendWhatsAppMessage } from '../utils/whatsappUtils';

export const generateBill = async (req: Request<{}, {}, BillRequest>, res: Response) => {
    try {
        const { billId, urlHash, amount, date, customerName, phone } = req.body;
        
        // Generate URL for bill viewing using urlHash
        const billUrl = `https://saree-shop-app.firebaseapp.com/${urlHash}`;

        // Send URL message using urlHash
        await sendWhatsAppMessage(
            phone,
            `Your bill has been generated!\nView here: ${billUrl}`
        );

        res.status(200).json({ message: "Bill URL sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate bill" });
    }
};