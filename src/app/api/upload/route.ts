import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { temporaryFile } from "tempy";

export async function POST(req) {
  const formData = await req.formData();
  const imageBase64 = formData.get("image") as string;

  if (!imageBase64) {
    return new Response(JSON.stringify({ error: "No image data provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Decode the base64 string
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const dataBuffer = Buffer.from(base64Data, "base64");
    const id = uuidv4();
    // Generate a unique filename
    const filename = id + ".png";

    // Define the path to save the image
    const tmpPath = temporaryFile({ name: filename });

    // Write the file
    fs.writeFileSync(tmpPath, dataBuffer);

    // Return the file path
    return new Response(JSON.stringify({ id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error processing your request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
