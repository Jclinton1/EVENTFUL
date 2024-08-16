import QRCode from 'qrcode';

/**
 * Generates a QR code for the given text.
 * @param text - The text to encode into the QR code.
 * @returns A promise that resolves to the QR code image data URL.
 */

export const generateQRCode = async (text: string): Promise<string> => {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(text);
        return qrCodeDataUrl;
    } catch (err: any) {
        throw new Error('Failed to generate QR code: ' + err.message);
    }
};
