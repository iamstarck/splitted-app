import * as mindee from "mindee";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const apiKey = process.env.MINDEE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'MINDEE_API_KEY is not configured in .env' });
    }

    const MODEL_ID = "8523bbdf-9288-495d-af80-e815aeae40a4";

    // Initialize Mindee Client (SDK v5, defaults to V2 client)
    const mindeeClient = new mindee.Client({ apiKey });

    // Extract base64 data from data URL
    const base64Data = image.split(",")[1] || image;
    const buffer = Buffer.from(base64Data, "base64");

    const inputSource = new mindee.BufferInput({
      buffer: buffer,
      filename: "receipt.png",
    });

    console.log(`[OCR] Enqueueing to Mindee Extraction (Model: ${MODEL_ID})...`);

    // Official SDK v5 pattern:
    // Arg 1: product class (mindee.product.Extraction)
    // Arg 2: input source
    // Arg 3: params with required modelId
    // Arg 4: polling options
    const response = await mindeeClient.enqueueAndGetResult(
      mindee.product.Extraction,
      inputSource,
      { modelId: MODEL_ID },
      { initialDelaySec: 2, delaySec: 2, maxRetries: 15 }
    );

    // Response structure: response.inference.result.fields (InferenceFields extends Map)
    const fields = response.inference.result.fields;

    console.log(`[OCR] Received ${fields.size} fields from Mindee.`);

    // Extract line_items (ListField)
    let items: Array<{ name: string; price: number; quantity: number }> = [];
    
    if (fields.has("line_items")) {
      const lineItemsField = fields.get("line_items") as any;
      if (lineItemsField && lineItemsField.items && lineItemsField.items.length > 0) {
        items = lineItemsField.items.map((item: any) => {
          // Each item in a ListField is an ObjectField with sub-fields
          const subFields = item.fields || item;
          
          const description = subFields.get?.("description")?.value 
            || subFields.description?.value
            || subFields.get?.("item_description")?.value
            || "Item";
          
          const totalAmount = subFields.get?.("total_amount")?.value
            || subFields.total_amount?.value
            || subFields.get?.("unit_price")?.value
            || subFields.unit_price?.value
            || 0;

          const quantity = subFields.get?.("quantity")?.value
            || subFields.quantity?.value
            || 1;

          return {
            name: String(description),
            price: Number(totalAmount) || 0,
            quantity: Number(quantity) || 1,
          };
        });
      }
    }

    // Extract totals (SimpleField)
    const totalAmount = (fields.get("total_amount") as any)?.value ?? 0;
    const totalNet = (fields.get("total_net") as any)?.value ?? 0;
    const totalTax = (fields.get("total_tax") as any)?.value ?? 0;

    // If no line items but we have a total, create a single entry
    if (items.length === 0 && totalAmount > 0) {
      items = [{ name: "Struk Berhasil Dibaca", price: Number(totalAmount), quantity: 1 }];
    }

    console.log(`[OCR] Parsed ${items.length} items. Total: ${totalAmount}, Tax: ${totalTax}`);

    return res.status(200).json({
      items,
      subtotal: Number(totalNet) || (Number(totalAmount) - Number(totalTax)) || 0,
      total: Number(totalAmount) || 0,
      tax: Number(totalTax) || 0,
    });

  } catch (error: any) {
    console.error("[OCR] Error:", error.message || error);
    return res.status(500).json({
      error: error.message || "Terjadi kesalahan pada server OCR",
    });
  }
}
