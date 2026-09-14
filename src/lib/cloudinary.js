import { v2 as cloudinary } from "cloudinary";

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  process.env.CLOUDINATY_CLOUD_NAME ||
  "";

const apiKey =
  process.env.CLOUDINARY_API_KEY ||
  process.env.CLOUDINATY_API_KEY ||
  "";

const apiSecret =
  process.env.CLOUDINARY_API_SECRET ||
  process.env.CLOUDINATY_API_SECRET ||
  "";

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a base64 image data URL or image path to Cloudinary
 * @param {string} fileStr Base64 encoded image string (e.g. data:image/jpeg;base64,...)
 * @param {string} folder Target Cloudinary folder
 * @returns {Promise<string>} Secure URL of uploaded image or fallback string
 */
export async function uploadToCloudinary(fileStr, folder = "kaamsaathi/applications") {
  if (!fileStr || typeof fileStr !== "string") {
    return "";
  }

  // If already an external hosted URL
  if (fileStr.startsWith("http://") || fileStr.startsWith("https://")) {
    return fileStr;
  }

  // Ensure Cloudinary is configured
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(
      "[Cloudinary] Missing credentials (cloud_name, api_key, or api_secret). Storing image data directly as fallback."
    );
    return fileStr;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: "image",
      transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
    });

    return uploadResponse.secure_url;
  } catch (err) {
    console.error("[Cloudinary Upload Error]:", err);
    // Return original string as fallback so application isn't lost
    return fileStr;
  }
}

export default cloudinary;
